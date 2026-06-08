import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ChefHat, Users } from 'lucide-react';
import { api } from '@/utils/api';
import type { SpecialCollection, Recipe } from '../../shared/types';
import RecipeCard from '@/components/RecipeCard';
import { useStore } from '@/store/useStore';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import { Tag } from '@/components/ui/Tag';

export default function SpecialDetail() {
  const { id } = useParams<{ id: string }>();
  const { toggleFavorite } = useStore();
  const [special, setSpecial] = useState<SpecialCollection | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await api.specials.getById(id);
        setSpecial(data);
        setRecipes(data.recipes || []);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <Loading />;
  if (!special) return <Empty text="专题不存在" />;

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={special.coverImage}
          alt={special.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Link to="/specials" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>返回专题列表</span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Tag variant="primary" size="sm">{special.festival}</Tag>
            <span className="text-white/70 text-sm flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(special.createdAt).toLocaleDateString('zh-CN')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">{special.title}</h1>
          <p className="text-white/80 max-w-2xl">{special.description}</p>
        </div>
      </div>

      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ChefHat className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-bold text-brown-700 font-display">
              收录菜谱 ({recipes.length})
            </h2>
          </div>
        </div>

        {recipes.length === 0 ? (
          <Empty text="该专题暂无菜谱" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
