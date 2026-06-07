import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Calendar, Building2, ChefHat, Heart, PartyPopper, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { api } from '@/utils/api';
import { cn } from '@/lib/utils';
import RecipeCard from '@/components/RecipeCard';
import { useNavigate } from 'react-router-dom';
import type { Recipe, PotluckEvent, KitchenEvent } from '../../shared/types';

const tabs = [
  { id: 'recipes', label: '我的菜谱', icon: ChefHat },
  { id: 'favorites', label: '我的收藏', icon: Heart },
  { id: 'events', label: '我的活动', icon: PartyPopper },
];

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, fetchCurrentUser, potluckEvents, kitchenEvents, fetchPotlucks, fetchKitchens, toggleFavorite } = useStore();
  const [activeTab, setActiveTab] = useState('recipes');
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [userFavorites, setUserFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
    fetchPotlucks();
    fetchKitchens();
  }, [fetchCurrentUser, fetchPotlucks, fetchKitchens]);

  const loadUserData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [recipes, favorites] = await Promise.all([
        api.users.getRecipes(currentUser.id),
        api.users.getFavorites(currentUser.id),
      ]);
      setUserRecipes(recipes);
      setUserFavorites(favorites);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser, loadUserData]);

  const userEvents: (PotluckEvent | KitchenEvent)[] = [
    ...potluckEvents.filter((e) => e.participants.some((p) => p.userId === currentUser?.id)),
    ...kitchenEvents.filter((e) => e.participants.some((p) => p.userId === currentUser?.id)),
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleLogout = () => {
    useStore.getState().setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-brown-100">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-brown-700" />
            </button>
            <h1 className="text-xl font-bold text-brown-700 font-display">个人中心</h1>
          </div>
          <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center text-red-500">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {currentUser && (
        <div className="bg-gradient-primary text-white">
          <div className="container px-4 py-8">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full border-4 border-white/30"
              />
              <div>
                <h2 className="text-2xl font-bold mb-1">{currentUser.name}</h2>
                <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {currentUser.building}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    加入于 {formatDate(currentUser.joinDate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <div className="text-2xl font-bold">{userRecipes.length}</div>
                <div className="text-xs text-white/80">菜谱</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <div className="text-2xl font-bold">{userFavorites.length}</div>
                <div className="text-xs text-white/80">收藏</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <div className="text-2xl font-bold">{userEvents.length}</div>
                <div className="text-xs text-white/80">活动</div>
              </div>
            </div>
          </div>
          <div className="h-8 bg-gradient-warm rounded-t-3xl" />
        </div>
      )}

      <div className="container px-4">
        <div className="flex gap-1 bg-white rounded-full p-1 mb-6 shadow-card">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-2 px-3 rounded-full text-sm font-medium flex items-center justify-center gap-1 transition-all',
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-brown-600 hover:bg-warm-100'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'recipes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {userRecipes.length > 0 ? (
                  userRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onFavorite={toggleFavorite} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 text-brown-500">
                    <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>还没有发布菜谱</p>
                    <button onClick={() => navigate('/publish')} className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-full">
                      去发布
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {userFavorites.length > 0 ? (
                  userFavorites.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onFavorite={toggleFavorite} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 text-brown-500">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>还没有收藏的菜谱</p>
                    <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-full">
                      去发现
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-4 pb-8">
                {userEvents.length > 0 ? (
                  userEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-2xl p-4 shadow-card">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-brown-700">{event.title}</h3>
                          <p className="text-sm text-brown-500">
                            {event.date} {'time' in event ? event.time : (event as KitchenEvent).startTime}
                          </p>
                        </div>
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-full',
                          event.status === 'recruiting' || event.status === 'upcoming'
                            ? 'bg-green-100 text-green-700'
                            : event.status === 'full'
                            ? 'bg-yellow-100 text-yellow-700'
                            : event.status === 'completed'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-red-100 text-red-600'
                        )}>
                          {event.status === 'recruiting' ? '招募中' :
                           event.status === 'upcoming' ? '即将开始' :
                           event.status === 'full' ? '已满员' :
                           event.status === 'completed' ? '已结束' : '已取消'}
                        </span>
                      </div>
                      <p className="text-sm text-brown-500">{event.location}</p>
                      <p className="text-sm text-brown-500 mt-1">
                        {event.participants.length}/{event.maxParticipants} 人参与
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-brown-500">
                    <PartyPopper className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>还没有参与的活动</p>
                    <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-full">
                      去看看
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
