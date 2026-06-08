import { create } from 'zustand';
import type { User, Recipe, PotluckEvent, KitchenEvent, SpecialCollection } from '../../shared/types';
import { api } from '../utils/api';

interface AppState {
  currentUser: User | null;
  allUsers: User[];
  recipes: Recipe[];
  potluckEvents: PotluckEvent[];
  kitchenEvents: KitchenEvent[];
  specials: SpecialCollection[];
  loading: boolean;
  error: string | null;

  // Actions
  setCurrentUser: (user: User | null) => void;
  fetchCurrentUser: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  fetchRecipes: (params?: { page?: number; pageSize?: number; cuisine?: string; taste?: string }) => Promise<void>;
  fetchPotlucks: (status?: string) => Promise<void>;
  fetchKitchens: (date?: string) => Promise<void>;
  fetchSpecials: (published?: boolean) => Promise<void>;
  toggleFavorite: (recipeId: string) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  allUsers: [],
  recipes: [],
  potluckEvents: [],
  kitchenEvents: [],
  specials: [],
  loading: false,
  error: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchCurrentUser: async () => {
    try {
      const user = await api.users.getCurrent();
      set({ currentUser: user });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '获取用户信息失败' });
    }
  },

  fetchAllUsers: async () => {
    try {
      const users = await api.users.getList();
      set({ allUsers: users });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '获取用户列表失败' });
    }
  },

  switchUser: async (userId: string) => {
    try {
      const user = await api.users.switchUser(userId);
      set({ currentUser: user });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '切换用户失败' });
    }
  },

  fetchRecipes: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await api.recipes.getList(params);
      set({ recipes: response.list });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '获取菜谱列表失败' });
    } finally {
      set({ loading: false });
    }
  },

  fetchPotlucks: async (status) => {
    set({ loading: true, error: null });
    try {
      const events = await api.potlucks.getList(status);
      set({ potluckEvents: events });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '获取拼菜活动失败' });
    } finally {
      set({ loading: false });
    }
  },

  fetchKitchens: async (date) => {
    set({ loading: true, error: null });
    try {
      const events = await api.kitchens.getList(date);
      set({ kitchenEvents: events });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '获取共享厨房活动失败' });
    } finally {
      set({ loading: false });
    }
  },

  fetchSpecials: async (published) => {
    set({ loading: true, error: null });
    try {
      const specials = await api.specials.getList(published);
      set({ specials });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '获取专题列表失败' });
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: async (recipeId) => {
    const { currentUser } = get();
    if (!currentUser) {
      set({ error: '请先登录后再操作' });
      return;
    }

    try {
      const result = await api.recipes.toggleFavorite(recipeId, currentUser.id);
      set((state) => ({
        recipes: state.recipes.map((r) =>
          r.id === recipeId ? { ...r, favoriteCount: result.favoriteCount } : r
        ),
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '操作失败' });
    }
  },

  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
}));
