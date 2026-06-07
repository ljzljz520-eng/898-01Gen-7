import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Share2, X, Search, Plus, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { api } from '@/utils/api';
import { cn } from '@/lib/utils';
import { Button, Tag, Input, Textarea, Modal } from '@/components/ui';
import type { Recipe } from '../../shared/types';

const festivals = ['春节', '元宵节', '清明节', '端午节', '中秋节', '国庆节', '元旦', '其他'];

export default function SpecialEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, fetchCurrentUser, fetchSpecials } = useStore();
  const [title, setTitle] = useState('');
  const [festival, setFestival] = useState(festivals[0]);
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [previewRecipe, setPreviewRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const isEdit = id && id !== 'new';

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (currentUser?.role !== 'admin') navigate('/');
  }, [currentUser, navigate]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [recipesRes, cuisinesList] = await Promise.all([
          api.recipes.getList({ pageSize: 100 }),
          api.recipes.getCuisines(),
        ]);
        setAllRecipes(recipesRes.list);
        setCuisines(cuisinesList);
        if (isEdit) {
          const special = await api.specials.getById(id);
          setTitle(special.title);
          setFestival(special.festival);
          setCoverImage(special.coverImage);
          setDescription(special.description);
          const selected = recipesRes.list.filter(r => special.recipeIds.includes(r.id));
          setSelectedRecipes(special.recipeIds.map(rid => selected.find(r => r.id === rid)!).filter(Boolean));
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEdit]);

  const filtered = allRecipes.filter(r => {
    if (selectedRecipes.some(sr => sr.id === r.id)) return false;
    if (searchQuery && !r.title.includes(searchQuery) && !r.author?.name?.includes(searchQuery)) return false;
    if (cuisineFilter && r.cuisine !== cuisineFilter) return false;
    return true;
  });

  const addRecipe = (r: Recipe) => setSelectedRecipes([...selectedRecipes, r]);
  const removeRecipe = (id: string) => setSelectedRecipes(selectedRecipes.filter(r => r.id !== id));

  const onDragStart = (idx: number) => setDragIdx(idx);
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newArr = [...selectedRecipes];
    const [item] = newArr.splice(dragIdx, 1);
    newArr.splice(idx, 0, item);
    setSelectedRecipes(newArr);
    setDragIdx(idx);
  };
  const onDragEnd = () => setDragIdx(null);

  const handleSave = async (publish: boolean) => {
    const data = {
      title, festival, coverImage, description,
      recipeIds: selectedRecipes.map(r => r.id),
      isPublished: publish,
      adminId: currentUser?.id || 'admin',
    };
    if (isEdit) {
      await api.specials.update(id, data);
    } else {
      await api.specials.create(data);
    }
    fetchSpecials();
    navigate('/admin');
  };

  const Preview = () => previewRecipe && (
    <div>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <div>
          <p className="font-medium text-xs">作者原文 · 仅用于预览，不可修改</p>
          <p className="text-xs text-white/80">此为作者原创内容，管理员仅可链接</p>
        </div>
      </div>
      <img src={previewRecipe.coverImage} alt="" className="w-full h-28 object-cover rounded-xl mb-2" />
      <h4 className="font-bold text-brown-700 text-sm mb-0.5">{previewRecipe.title}</h4>
      <p className="text-xs text-brown-500 mb-1">作者：{previewRecipe.author?.name}</p>
      <p className="text-xs text-brown-600 mb-2 line-clamp-1">{previewRecipe.description}</p>
      <div className="mb-2">
        <h5 className="font-semibold text-brown-700 mb-1 text-xs">食材</h5>
        <div className="flex flex-wrap gap-1">
          {previewRecipe.ingredients.slice(0, 4).map((ing, i) => (
            <Tag key={i} size="sm">{ing.name}</Tag>
          ))}
        </div>
      </div>
      <div>
        <h5 className="font-semibold text-brown-700 mb-1 text-xs">步骤</h5>
        <ol className="space-y-0.5">
          {previewRecipe.steps.slice(0, 2).map((step, i) => (
            <li key={i} className="text-xs text-brown-600 flex gap-1">
              <span className="text-primary-500">{i + 1}.</span>
              <span className="line-clamp-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="bg-gradient-to-r from-brown-800 to-brown-900 text-white">
        <div className="container px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold font-display">{isEdit ? '编辑专题' : '创建专题'}</h1>
            <p className="text-xs text-white/70">节日专题编辑器</p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-4 pb-24">
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-medium text-brown-700 mb-1">专题标题</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="请输入专题标题" className="h-9" />
          </div>
          <div>
            <label className="block text-xs font-medium text-brown-700 mb-1">节日</label>
            <div className="flex flex-wrap gap-1.5">
              {festivals.map((f) => (
                <button
                  key={f}
                  onClick={() => setFestival(f)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-all',
                    festival === f ? 'bg-primary-500 text-white' : 'bg-white text-brown-600 hover:bg-warm-100'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-brown-700 mb-1">封面图片 URL</label>
            <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="请输入封面图片链接" className="h-9" />
          </div>
          <div>
            <label className="block text-xs font-medium text-brown-700 mb-1">专题描述</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="请输入专题描述" rows={2} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-brown-700 mb-2">选择菜谱</label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-3 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索菜谱..." icon={<Search className="w-3.5 h-3.5" />} className="h-8" />
                </div>
                <select value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)} className="h-8 px-2 rounded-full border-2 border-brown-200 bg-warm-50 text-xs text-brown-700 focus:border-primary-400 focus:outline-none">
                  <option value="">全部菜系</option>
                  {cuisines.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {filtered.length > 0 ? filtered.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-warm-50 transition-colors group">
                    <div className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer" onMouseEnter={() => setPreviewRecipe(r)} onMouseLeave={() => setPreviewRecipe(null)}>
                      <img src={r.coverImage} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-brown-700 truncate">{r.title}</p>
                        <p className="text-xs text-brown-500">{r.author?.name} · {r.cuisine}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => addRecipe(r)} className="h-7 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-6 text-brown-500 text-xs">暂无可选菜谱</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3 shadow-card">
              <h3 className="text-xs font-medium text-brown-700 mb-2">已选菜谱 ({selectedRecipes.length})</h3>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {selectedRecipes.length > 0 ? selectedRecipes.map((r, idx) => (
                  <div key={r.id} draggable onDragStart={() => onDragStart(idx)} onDragOver={(e) => onDragOver(e, idx)} onDragEnd={onDragEnd} className={cn('flex items-center justify-between gap-2 p-1.5 rounded-lg bg-warm-50 cursor-move transition-all', dragIdx === idx && 'opacity-50 scale-95')}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="w-3.5 h-3.5 text-brown-400 flex-shrink-0" />
                      <img src={r.coverImage} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 cursor-pointer" onMouseEnter={() => setPreviewRecipe(r)} onMouseLeave={() => setPreviewRecipe(null)} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-brown-700 truncate">{r.title}</p>
                        <p className="text-xs text-brown-500">{r.author?.name}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => removeRecipe(r.id)} className="h-7 px-1.5 text-red-500 border-red-300 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-6 text-brown-500 text-xs">请从左侧添加菜谱</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brown-100 p-3 shadow-lg">
        <div className="container px-4 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => navigate('/admin')} className="h-9 text-sm">
            <X className="w-4 h-4" /> 取消
          </Button>
          <Button variant="ghost" onClick={() => handleSave(false)} className="h-9 text-sm text-brown-600">
            <Save className="w-4 h-4" /> 草稿
          </Button>
          <Button onClick={() => handleSave(true)} className="h-9 text-sm">
            <Share2 className="w-4 h-4" /> 发布
          </Button>
        </div>
      </div>

      <Modal open={!!previewRecipe} onClose={() => setPreviewRecipe(null)} title="菜谱预览">
        <Preview />
      </Modal>
    </div>
  );
}
