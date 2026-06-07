import { useEffect, useState } from 'react';
import { Search, ChefHat, Utensils, PartyPopper, Plus, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import RecipeCard from '@/components/RecipeCard';
import SpecialCard from '@/components/SpecialCard';
import { Link } from 'react-router-dom';

const cuisineFilters = ['全部', '家常菜', '川菜', '素菜', '面食', '传统糕点'];

const quickActions = [
  { icon: Plus, label: '发布菜谱', color: 'bg-primary-500', to: '/publish' },
  { icon: ChefHat, label: '共享厨房', color: 'bg-secondary-500', to: '/kitchens' },
  { icon: Utensils, label: '拼菜活动', color: 'bg-secondary-400', to: '/potlucks' },
  { icon: PartyPopper, label: '节日专题', color: 'bg-primary-400', to: '/specials' },
];

export default function Home() {
  const { recipes, specials, loading, fetchRecipes, fetchSpecials, toggleFavorite } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('全部');

  useEffect(() => {
    fetchRecipes();
    fetchSpecials(true);
  }, [fetchRecipes, fetchSpecials]);

  const filteredRecipes = recipes.filter((r) => {
    const matchCuisine = activeCuisine === '全部' || r.cuisine === activeCuisine;
    const matchSearch = r.title.includes(searchQuery) || r.description.includes(searchQuery);
    return matchCuisine && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-warm">
      <section className="relative bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-10" />
        <div className="container relative py-12 px-4">
          <div className="flex items-center justify-between mb-6">
            <Link to="/profile" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2 font-display">邻里厨房·美味共享</h1>
          <p className="text-white/80 mb-6">分享家常味道，温暖邻里时光</p>
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
            <input
              type="text"
              placeholder="搜索菜谱、食材..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white text-brown-700 placeholder-brown-400 outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex flex-col items-center gap-2"
              >
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', action.color)}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/90">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="h-8 bg-gradient-warm rounded-t-3xl" />
      </section>

      {specials.length > 0 && (
        <section className="container px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-brown-700 font-display">节日专题</h2>
            <Link to="/specials" className="text-sm text-primary-500">查看全部</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {specials.map((special) => (
              <div key={special.id} className="flex-shrink-0 w-72">
                <SpecialCard special={special} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container px-4 py-6">
        <h2 className="text-xl font-bold text-brown-700 font-display mb-4">精选菜谱</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {cuisineFilters.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setActiveCuisine(cuisine)}
              className={cn(
                'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all',
                activeCuisine === cuisine
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-brown-600 hover:bg-warm-100'
              )}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
