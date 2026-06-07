import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, Users, Clock, ChefHat, AlertTriangle, Check, Send, MessageCircle, Plus, ArrowLeft } from 'lucide-react';
import { api } from '@/utils/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Textarea } from '@/components/ui/Textarea';
import PotluckCard from '@/components/PotluckCard';
import KitchenCard from '@/components/KitchenCard';
import Loading from '@/components/Loading';
import type { Recipe, Comment, PotluckEvent, KitchenEvent } from '../../shared/types';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPotlucks, setRelatedPotlucks] = useState<PotluckEvent[]>([]);
  const [relatedKitchens, setRelatedKitchens] = useState<KitchenEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [recipeData, commentsData, potlucksData, kitchensData, favorited] = await Promise.all([
        api.recipes.getById(id),
        api.recipes.getComments(id),
        api.potlucks.getList(),
        api.kitchens.getList(),
        api.recipes.checkFavorite(id),
      ]);
      setRecipe(recipeData);
      setComments(commentsData);
      setFavoriteCount(recipeData.favoriteCount);
      setIsFavorited(favorited);
      setRelatedPotlucks(potlucksData.filter(p => p.recipeId === id));
      setRelatedKitchens(kitchensData.filter(k => k.recipeId === id));
    } catch (err) {
      console.error('加载失败', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id, loadData]);

  const handleToggleFavorite = async () => {
    if (!id) return;
    setIsAnimating(true);
    try {
      const result = await api.recipes.toggleFavorite(id);
      setIsFavorited(result.isFavorited);
      setFavoriteCount(result.favoriteCount);
    } catch (err) {
      console.error('收藏失败', err);
    } finally {
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleAddComment = async () => {
    if (!id || !commentText.trim()) return;
    try {
      const newComment = await api.recipes.addComment(id, commentText.trim());
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      console.error('评论失败', err);
    }
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <Loading size="lg" text="加载中..." />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <p className="text-brown-600 mb-4">菜谱不存在</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={recipe.coverImage} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white font-display mb-2">{recipe.title}</h1>
          <div className="flex items-center gap-3 text-white/90">
            <img src={recipe.author?.avatar} alt={recipe.author?.name} className="w-8 h-8 rounded-full border-2 border-white/50" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{recipe.author?.name}</p>
              <p className="text-xs text-white/70">{recipe.author?.building} · {formatDate(recipe.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6 space-y-6 -mt-4 relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={handleToggleFavorite} className={cn('w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center transition-all', isAnimating && 'animate-bounce-soft')}>
            <Heart className={cn('w-6 h-6 transition-colors', isFavorited ? 'fill-red-500 text-red-500' : 'text-brown-400')} />
          </button>
          <span className="text-brown-600 font-medium">{favoriteCount}</span>
          <button className="w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center hover:bg-warm-50 transition-colors">
            <Share2 className="w-5 h-5 text-brown-500" />
          </button>
          <Button className="flex-1 gap-2">
            <Plus className="w-5 h-5" />
            发起拼菜
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 items-center bg-white rounded-3xl p-4 shadow-card">
          <div className="flex items-center gap-2 text-brown-600">
            <Users className="w-5 h-5 text-primary-500" />
            <span className="font-medium">{recipe.servings} 人份</span>
          </div>
          <div className="w-px h-6 bg-brown-200 hidden sm:block" />
          <div className="flex items-center gap-2 text-brown-600">
            <Clock className="w-5 h-5 text-primary-500" />
            <span className="font-medium">约 45 分钟</span>
          </div>
          <div className="w-px h-6 bg-brown-200 hidden sm:block" />
          <Tag variant="primary" icon={<ChefHat className="w-3.5 h-3.5" />}>{recipe.cuisine}</Tag>
          {recipe.taste.map(t => (
            <Tag key={t} variant="secondary" size="sm">{t}</Tag>
          ))}
        </div>

        {recipe.allergens.length > 0 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-700 mb-2">过敏原提示</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {recipe.allergens.map(a => (
                    <span key={a} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{a}</span>
                  ))}
                </div>
                {recipe.allergenNote && <p className="text-sm text-red-600">{recipe.allergenNote}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-card">
          <h2 className="text-xl font-bold text-brown-700 font-display mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-primary-500" />
            食材清单
          </h2>
          <div className="grid gap-3">
            {recipe.ingredients.map((ing, idx) => (
              <button
                key={idx}
                onClick={() => toggleIngredient(idx)}
                className={cn('flex items-center gap-3 p-3 rounded-2xl transition-all text-left', checkedIngredients.has(idx) ? 'bg-primary-50' : 'bg-warm-50 hover:bg-warm-100')}
              >
                <div className={cn('w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors', checkedIngredients.has(idx) ? 'bg-primary-500 border-primary-500' : 'border-brown-300')}>
                  {checkedIngredients.has(idx) && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className={cn('flex-1 transition-all', checkedIngredients.has(idx) && 'line-through text-brown-400')}>{ing.name}</span>
                <span className="text-brown-500 font-medium">{ing.quantity} {ing.unit}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-card">
          <h2 className="text-xl font-bold text-brown-700 font-display mb-4">烹饪步骤</h2>
          <div className="space-y-4">
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 bg-warm-50 rounded-2xl p-4">
                  <p className="text-brown-700 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-card">
          <h2 className="text-xl font-bold text-brown-700 font-display mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary-500" />
            评论 ({comments.length})
          </h2>
          <div className="space-y-4 mb-6">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img src={comment.user?.avatar} alt={comment.user?.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 bg-warm-50 rounded-2xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-brown-700">{comment.user?.name}</span>
                    <span className="text-xs text-brown-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-brown-600 text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写下你的评论..."
              className="flex-1"
              rows={2}
            />
            <Button onClick={handleAddComment} disabled={!commentText.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {(relatedPotlucks.length > 0 || relatedKitchens.length > 0) && (
          <div>
            <h2 className="text-xl font-bold text-brown-700 font-display mb-4">相关活动</h2>
            {relatedPotlucks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-brown-600 mb-3">拼菜活动</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {relatedPotlucks.map(potluck => (
                    <PotluckCard key={potluck.id} potluck={potluck} />
                  ))}
                </div>
              </div>
            )}
            {relatedKitchens.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-brown-600 mb-3">共享厨房</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {relatedKitchens.map(kitchen => (
                    <KitchenCard key={kitchen.id} kitchen={kitchen} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
