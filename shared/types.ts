export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'resident' | 'admin';
  building: string;
  joinDate: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  coverImage: string;
  authorId: string;
  author?: User;
  cuisine: string;
  taste: string[];
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  allergens: string[];
  allergenNote?: string;
  description: string;
  isApproved: boolean;
  favoriteCount: number;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  recipeId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  recipeId: string;
  userId: string;
}

export interface PotluckEvent {
  id: string;
  title: string;
  recipeId: string;
  recipe?: Recipe;
  initiatorId: string;
  initiator?: User;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  participants: { userId: string; user?: User; contribution?: string }[];
  ingredientSplit: { userId: string; ingredients: Ingredient[] }[];
  status: 'recruiting' | 'full' | 'completed' | 'cancelled';
  description: string;
  createdAt: string;
}

export interface KitchenEvent {
  id: string;
  title: string;
  recipeId: string;
  recipe?: Recipe;
  hostId: string;
  host?: User;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  participants: { userId: string; user?: User }[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
  createdAt: string;
}

export interface SpecialCollection {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  festival: string;
  recipeIds: string[];
  recipes?: Recipe[];
  adminId: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
