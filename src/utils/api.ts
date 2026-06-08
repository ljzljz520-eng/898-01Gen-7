import type {
  Recipe,
  Comment,
  PotluckEvent,
  KitchenEvent,
  SpecialCollection,
  User,
  ApiResponse,
  PaginatedResponse,
} from '../../shared/types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3002/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || '请求失败');
  }

  return data.data;
}

export const api = {
  recipes: {
    getList: (params?: { page?: number; pageSize?: number; cuisine?: string; taste?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', params.page.toString());
      if (params?.pageSize) query.set('pageSize', params.pageSize.toString());
      if (params?.cuisine) query.set('cuisine', params.cuisine);
      if (params?.taste) query.set('taste', params.taste);
      return request<PaginatedResponse<Recipe>>(`/recipes?${query.toString()}`);
    },

    getPending: () => request<Recipe[]>('/recipes/pending'),

    getCuisines: () => request<string[]>('/recipes/cuisines'),

    getTastes: () => request<string[]>('/recipes/tastes'),

    getById: (id: string) => request<Recipe>(`/recipes/${id}`),

    create: (data: Omit<Recipe, 'id' | 'createdAt' | 'isApproved' | 'favoriteCount' | 'commentCount'>) =>
      request<Recipe>('/recipes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    approve: (id: string) =>
      request<Recipe>(`/recipes/${id}/approve`, {
        method: 'PUT',
      }),

    delete: (id: string) =>
      request<null>(`/recipes/${id}`, {
        method: 'DELETE',
      }),

    getComments: (id: string) => request<Comment[]>(`/recipes/${id}/comments`),

    addComment: (id: string, content: string, userId: string) =>
      request<Comment>(`/recipes/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ userId, content }),
      }),

    toggleFavorite: (id: string, userId: string) =>
      request<{ favoriteCount: number; isFavorited: boolean }>(`/recipes/${id}/favorite`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),

    checkFavorite: (id: string, userId: string) =>
      request<boolean>(`/recipes/${id}/favorite?userId=${userId}`),
  },

  potlucks: {
    getList: (status?: string) => {
      const query = status ? `?status=${status}` : '';
      return request<PotluckEvent[]>(`/potlucks${query}`);
    },

    getById: (id: string) => request<PotluckEvent>(`/potlucks/${id}`),

    create: (data: Omit<PotluckEvent, 'id' | 'createdAt' | 'status' | 'participants' | 'ingredientSplit'>) =>
      request<PotluckEvent>('/potlucks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    join: (id: string, userId: string, contribution?: string) =>
      request<PotluckEvent>(`/potlucks/${id}/join`, {
        method: 'POST',
        body: JSON.stringify({ userId, contribution }),
      }),
  },

  kitchens: {
    getList: (date?: string) => {
      const query = date ? `?date=${date}` : '';
      return request<KitchenEvent[]>(`/kitchens${query}`);
    },

    getById: (id: string) => request<KitchenEvent>(`/kitchens/${id}`),

    create: (data: Omit<KitchenEvent, 'id' | 'createdAt' | 'status' | 'participants'>) =>
      request<KitchenEvent>('/kitchens', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    register: (id: string, userId: string) =>
      request<KitchenEvent>(`/kitchens/${id}/register`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),
  },

  specials: {
    getList: (published?: boolean) => {
      const query = published !== undefined ? `?published=${published}` : '';
      return request<SpecialCollection[]>(`/specials${query}`);
    },

    getById: (id: string) => request<SpecialCollection>(`/specials/${id}`),

    create: (data: Omit<SpecialCollection, 'id' | 'createdAt'>) =>
      request<SpecialCollection>('/specials', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Pick<SpecialCollection, 'title' | 'description' | 'recipeIds' | 'coverImage' | 'festival' | 'isPublished'>>) =>
      request<SpecialCollection>(`/specials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  users: {
    getCurrent: () => request<User>('/users/current'),

    getList: () => request<User[]>('/users/list'),

    switchUser: (id: string) => request<User>(`/users/switch/${id}`, {
      method: 'POST',
    }),

    getById: (id: string) => request<User>(`/users/${id}`),

    getFavorites: (id: string) => request<Recipe[]>(`/users/${id}/favorites`),

    getRecipes: (id: string) => request<Recipe[]>(`/users/${id}/recipes`),

    deleteComment: (id: string) =>
      request<null>(`/users/comments/${id}`, {
        method: 'DELETE',
      }),
  },
};
