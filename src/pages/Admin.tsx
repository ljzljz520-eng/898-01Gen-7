import { useEffect, useState } from 'react';
import { Eye, CheckCircle, Trash2, Plus, Edit, EyeOff, LogOut, ChefHat, PartyPopper, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { api } from '@/utils/api';
import { cn } from '@/lib/utils';
import { Button, Tag, Modal } from '@/components/ui';
import type { Recipe, Comment } from '../../shared/types';

const tabs = [
  { id: 'pending', label: '待审核菜谱', icon: ChefHat },
  { id: 'specials', label: '节日专题', icon: PartyPopper },
  { id: 'content', label: '内容管理', icon: MessageSquare },
];

export default function Admin() {
  const navigate = useNavigate();
  const { currentUser, fetchCurrentUser, specials, fetchSpecials } = useStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingRecipes, setPendingRecipes] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewRecipe, setPreviewRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchSpecials();
  }, [fetchCurrentUser, fetchSpecials]);

  useEffect(() => {
    if (currentUser?.role !== 'admin') navigate('/');
  }, [currentUser, navigate]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [pending, recipesRes] = await Promise.all([
          api.recipes.getPending(),
          api.recipes.getList({ pageSize: 100 }),
        ]);
        setPendingRecipes(pending);
        setAllRecipes(recipesRes.list);
        const allComments: Comment[] = [];
        for (const r of recipesRes.list) {
          if (r.commentCount > 0) {
            const cs = await api.recipes.getComments(r.id);
            allComments.push(...cs);
          }
        }
        setComments(allComments);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    await api.recipes.approve(id);
    setPendingRecipes(prev => prev.filter(r => r.id !== id));
  };

  const handleDeleteRecipe = async (id: string, isPending: boolean) => {
    await api.recipes.delete(id);
    if (isPending) {
      setPendingRecipes(prev => prev.filter(r => r.id !== id));
    } else {
      setAllRecipes(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleDeleteComment = async (id: string) => {
    await api.users.deleteComment(id);
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const handlePublishSpecial = async (id: string, isPublished: boolean) => {
    await api.specials.update(id, { isPublished: !isPublished });
    fetchSpecials();
  };

  const handleLogout = () => {
    useStore.getState().setCurrentUser(null);
    navigate('/');
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('zh-CN');

  const ActionBtn = ({ onClick, icon: Icon, variant = 'ghost', className, children }: any) => (
    <Button size="sm" variant={variant} onClick={onClick} className={cn('h-8 px-2', className)}>
      <Icon className="w-3.5 h-3.5" />
      {children && <span className="hidden sm:inline ml-1">{children}</span>}
    </Button>
  );

  const RecipeCard = ({ recipe, showApprove = false }: { recipe: Recipe; showApprove?: boolean }) => (
    <div className="bg-white rounded-2xl p-3 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0 cursor-pointer" onClick={() => setPreviewRecipe(recipe)}>
          <img src={recipe.coverImage} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brown-700 truncate text-sm hover:text-primary-600">{recipe.title}</h3>
            <p className="text-xs text-brown-500 mt-0.5">作者：{recipe.author?.name || '未知'}</p>
            <p className="text-xs text-brown-400 mt-0.5">{fmtDate(recipe.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <ActionBtn onClick={() => setPreviewRecipe(recipe)} icon={Eye} />
          {showApprove && <ActionBtn onClick={() => handleApprove(recipe.id)} icon={CheckCircle} variant="secondary">通过</ActionBtn>}
          <ActionBtn onClick={() => handleDeleteRecipe(recipe.id, showApprove)} icon={Trash2} variant="outline" className="text-red-500 border-red-300 hover:bg-red-50" />
        </div>
      </div>
    </div>
  );

  const SpecialCard = ({ sp }: { sp: any }) => (
    <div className="bg-white rounded-2xl p-3 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <img src={sp.coverImage} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brown-700 truncate text-sm">{sp.title}</h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              <Tag variant="primary" size="sm">{sp.festival}</Tag>
              <span className="text-xs text-brown-500">{sp.recipeIds.length} 道</span>
              <Tag variant={sp.isPublished ? 'success' : 'warning'} size="sm">
                {sp.isPublished ? '已发' : '草稿'}
              </Tag>
            </div>
            <p className="text-xs text-brown-400 mt-0.5">{fmtDate(sp.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <ActionBtn onClick={() => navigate(`/admin/special/${sp.id}`)} icon={Edit} />
          {sp.isPublished ? (
            <ActionBtn onClick={() => handlePublishSpecial(sp.id, true)} icon={EyeOff} variant="outline">取消</ActionBtn>
          ) : (
            <ActionBtn onClick={() => handlePublishSpecial(sp.id, false)} icon={Eye} variant="secondary">发布</ActionBtn>
          )}
          <ActionBtn onClick={() => handleDeleteRecipe(sp.id, false)} icon={Trash2} variant="outline" className="text-red-500 border-red-300 hover:bg-red-50" />
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ icon: Icon, text }: { icon: any; text: string }) => (
    <div className="text-center py-12 text-brown-500">
      <Icon className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p className="text-sm">{text}</p>
    </div>
  );

  const CommentItem = ({ c }: { c: Comment }) => (
    <div className="bg-white rounded-xl p-2.5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-medium text-brown-700">{c.user?.name}</span>
            <span className="text-brown-400">评论</span>
            <span className="text-primary-600 truncate">{allRecipes.find(r => r.id === c.recipeId)?.title}</span>
          </div>
          <p className="text-xs text-brown-600 mt-0.5">{c.content}</p>
          <p className="text-xs text-brown-400 mt-0.5">{fmtDate(c.createdAt)}</p>
        </div>
        <Button size="sm" variant="outline" className="text-red-500 border-red-300 hover:bg-red-50 h-7 px-2" onClick={() => handleDeleteComment(c.id)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  const RecipeManageItem = ({ r }: { r: Recipe }) => (
    <div className="bg-white rounded-xl p-2.5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <img src={r.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-brown-700 truncate text-sm">{r.title}</p>
            <p className="text-xs text-brown-500">作者：{r.author?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Tag variant={r.isApproved ? 'success' : 'warning'} size="sm">
            {r.isApproved ? '已过' : '待审'}
          </Tag>
          <Button size="sm" variant="outline" className="text-red-500 border-red-300 hover:bg-red-50 h-7 px-2" onClick={() => handleDeleteRecipe(r.id, false)}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  const PreviewContent = () => previewRecipe && (
    <div>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2.5 rounded-xl mb-3 flex items-center gap-2">
        <Eye className="w-4 h-4 flex-shrink-0" />
        <p className="font-medium text-xs">作者原文 · 仅用于预览，不可修改</p>
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
        <div className="container px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold font-display">管理后台</h1>
              <p className="text-xs text-white/70">社区菜谱管理系统</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-2">
                <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full" />
                <span className="text-sm hidden sm:block">{currentUser.name}</span>
                <Tag variant="warning" size="sm" className="bg-yellow-500/20 text-yellow-300">管理员</Tag>
              </div>
            )}
            <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-4">
        <div className="flex gap-1 bg-white rounded-full p-1 mb-4 shadow-card overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 min-w-[90px] py-1.5 px-2 rounded-full text-xs font-medium flex items-center justify-center gap-1 transition-all',
                activeTab === tab.id ? 'bg-primary-500 text-white' : 'text-brown-600 hover:bg-warm-100'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'pending' && (
          <div className="space-y-3 pb-6">
            {pendingRecipes.length > 0
              ? pendingRecipes.map((r) => <RecipeCard key={r.id} recipe={r} showApprove />)
              : <EmptyState icon={CheckCircle} text="暂无待审核菜谱" />
            }
          </div>
        )}

        {activeTab === 'specials' && (
          <div className="space-y-3 pb-6">
            <div className="flex justify-end">
              <Button onClick={() => navigate('/admin/special/new')} className="h-8 px-4 text-sm">
                <Plus className="w-4 h-4" /> 创建专题
              </Button>
            </div>
            {specials.length > 0
              ? specials.map((sp) => <SpecialCard key={sp.id} sp={sp} />)
              : <EmptyState icon={PartyPopper} text="暂无节日专题" />
            }
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4 pb-6">
            <div>
              <h3 className="font-bold text-brown-700 mb-2 flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4" />
                评论管理 ({comments.length})
              </h3>
              <div className="space-y-2">
                {comments.length > 0
                  ? comments.map((c) => <CommentItem key={c.id} c={c} />)
                  : <div className="text-center py-6 text-brown-500 bg-white rounded-xl text-sm">暂无评论</div>
                }
              </div>
            </div>
            <div>
              <h3 className="font-bold text-brown-700 mb-2 flex items-center gap-2 text-sm">
                <ChefHat className="w-4 h-4" />
                菜谱管理 ({allRecipes.length})
              </h3>
              <div className="space-y-2">
                {allRecipes.map((r) => <RecipeManageItem key={r.id} r={r} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal open={!!previewRecipe} onClose={() => setPreviewRecipe(null)} title="菜谱预览">
        <PreviewContent />
      </Modal>
    </div>
  );
}
