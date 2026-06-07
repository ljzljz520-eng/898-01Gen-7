import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/utils/api';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import type { Ingredient } from '../../shared/types';

const cuisineOptions = ['家常菜', '川菜', '粤菜', '湘菜', '素菜', '面食', '传统糕点', '其他'];
const tasteOptions = ['咸香', '微甜', '麻辣', '清淡', '酸甜', '蒜香', '鲜香', '软糯', '多汁', '绵软'];
const allergenOptions = ['花生', '海鲜', '鸡蛋', '牛奶', '小麦', '大豆', '无'];
const unitOptions = ['g', 'ml', '个', '片', '勺', '杯', '适量'];

export default function PublishRecipe() {
  const navigate = useNavigate();
  const { currentUser, setError } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [servings, setServings] = useState(2);
  const [description, setDescription] = useState('');
  const [allergenNote, setAllergenNote] = useState('');
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: 0, unit: 'g' }]);
  const [steps, setSteps] = useState<string[]>(['']);

  const toggleArray = (arr: string[], item: string, exclude: string[] = []) => {
    if (exclude.includes(item)) return [item];
    const filtered = arr.filter((i) => !exclude.includes(i));
    return filtered.includes(item) ? filtered.filter((i) => i !== item) : [...filtered, item];
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleSubmit = async () => {
    if (!currentUser) return setError('请先登录');
    if (!title.trim() || !cuisine || ingredients.every((i) => !i.name.trim()) || steps.every((s) => !s.trim())) {
      return setError('请填写完整信息');
    }
    setSubmitting(true);
    try {
      await api.recipes.create({
        title: title.trim(),
        coverImage: coverImage || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(title)}%20food%20dish&image_size=square_hd`,
        authorId: currentUser.id,
        cuisine,
        taste: selectedTastes,
        servings,
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps.filter((s) => s.trim()),
        allergens: selectedAllergens.length > 0 ? selectedAllergens : ['无'],
        allergenNote: allergenNote.trim() || undefined,
        description: description.trim(),
      });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  const Section = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-brown-700">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );

  const TagButton = ({ selected, onClick, children, variant = 'primary' }: { selected: boolean; onClick: () => void; children: React.ReactNode; variant?: 'primary' | 'danger' }) => (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm transition-all',
        selected
          ? variant === 'danger' ? 'bg-red-500 text-white' : 'bg-primary-500 text-white'
          : 'bg-warm-100 text-brown-600 hover:bg-warm-200'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-brown-100">
        <div className="container px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-brown-700" />
          </button>
          <h1 className="text-xl font-bold text-brown-700 font-display">发布菜谱</h1>
        </div>
      </div>

      <div className="container px-4 py-6 space-y-6">
        <Section title="基本信息">
          <div>
            <label className="block text-sm text-brown-600 mb-2">菜谱名称</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给你的菜谱起个名字"
              className="w-full px-4 py-3 rounded-xl border border-brown-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="block text-sm text-brown-600 mb-2">封面图片</label>
            <div
              className="aspect-video rounded-xl border-2 border-dashed border-brown-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-400 transition-colors bg-warm-50"
              onClick={() => setCoverImage(prompt('输入图片URL') || '')}
            >
              {coverImage ? (
                <img src={coverImage} alt="封面" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-brown-400" />
                  <span className="text-sm text-brown-500">点击上传或输入图片URL</span>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm text-brown-600 mb-2">菜系</label>
            <div className="grid grid-cols-4 gap-2">
              {cuisineOptions.map((c) => (
                <TagButton key={c} selected={cuisine === c} onClick={() => setCuisine(c)}>{c}</TagButton>
              ))}
            </div>
          </div>
        </Section>

        <Section title="食材" action={
          <button onClick={() => setIngredients([...ingredients, { name: '', quantity: 0, unit: 'g' }])} className="flex items-center gap-1 text-primary-500 text-sm">
            <Plus className="w-4 h-4" /> 添加
          </button>
        }>
          <div className="space-y-3">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="食材名称"
                  className="flex-1 px-3 py-2 rounded-lg border border-brown-200 outline-none focus:border-primary-400"
                />
                <input
                  type="number"
                  value={ing.quantity || ''}
                  onChange={(e) => updateIngredient(index, 'quantity', Number(e.target.value) || 0)}
                  placeholder="用量"
                  className="w-20 px-3 py-2 rounded-lg border border-brown-200 outline-none focus:border-primary-400"
                />
                <select
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  className="w-16 px-2 py-2 rounded-lg border border-brown-200 outline-none focus:border-primary-400"
                >
                  {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                {ingredients.length > 1 && (
                  <button
                    onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                    className="w-10 h-10 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section title="口味标签">
          <div className="flex flex-wrap gap-2">
            {tasteOptions.map((taste) => (
              <TagButton
                key={taste}
                selected={selectedTastes.includes(taste)}
                onClick={() => setSelectedTastes(toggleArray(selectedTastes, taste))}
              >
                {taste}
              </TagButton>
            ))}
          </div>
        </Section>

        <Section title="份量">
          <div className="flex items-center gap-4">
            <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-10 h-10 rounded-full bg-warm-100 text-brown-700 flex items-center justify-center text-xl">-</button>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 text-center text-2xl font-bold text-brown-700 bg-transparent outline-none"
            />
            <button onClick={() => setServings(servings + 1)} className="w-10 h-10 rounded-full bg-warm-100 text-brown-700 flex items-center justify-center text-xl">+</button>
            <span className="text-brown-600">人份</span>
          </div>
        </Section>

        <Section title="过敏原提示">
          <div className="flex flex-wrap gap-2 mb-3">
            {allergenOptions.map((allergen) => (
              <TagButton
                key={allergen}
                variant="danger"
                selected={selectedAllergens.includes(allergen)}
                onClick={() => setSelectedAllergens(toggleArray(selectedAllergens, allergen, ['无']))}
              >
                {allergen}
              </TagButton>
            ))}
          </div>
          <input
            type="text"
            value={allergenNote}
            onChange={(e) => setAllergenNote(e.target.value)}
            placeholder="其他备注（选填）"
            className="w-full px-4 py-3 rounded-xl border border-brown-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </Section>

        <Section title="制作步骤" action={
          <button onClick={() => setSteps([...steps, ''])} className="flex items-center gap-1 text-primary-500 text-sm">
            <Plus className="w-4 h-4" /> 添加步骤
          </button>
        }>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">{index + 1}</div>
                <div className="flex-1 flex gap-2">
                  <textarea
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`第${index + 1}步...`}
                    rows={3}
                    className="flex-1 px-4 py-3 rounded-xl border border-brown-200 outline-none focus:border-primary-400 resize-none"
                  />
                  {steps.length > 1 && (
                    <button
                      onClick={() => setSteps(steps.filter((_, i) => i !== index))}
                      className="self-start w-10 h-10 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="菜谱描述">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="介绍一下这道菜的特色、故事..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-brown-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
          />
        </Section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brown-100 p-4">
        <div className="container px-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> 发布中...</> : '发布菜谱'}
          </button>
        </div>
      </div>
    </div>
  );
}
