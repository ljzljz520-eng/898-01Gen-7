import { v4 as uuidv4 } from 'uuid';
import type { User, Recipe, Comment, PotluckEvent, KitchenEvent, SpecialCollection } from '../../shared/types';
import { mockUsers, mockRecipes, mockComments, mockPotluckEvents, mockKitchenEvents, mockSpecials, mockFavorites } from './mockData';

class DataStore {
  private users: User[] = [...mockUsers];
  private recipes: Recipe[] = [...mockRecipes];
  private comments: Comment[] = [...mockComments];
  private potluckEvents: PotluckEvent[] = [...mockPotluckEvents];
  private kitchenEvents: KitchenEvent[] = [...mockKitchenEvents];
  private specials: SpecialCollection[] = [...mockSpecials];
  private favorites: { id: string; userId: string; recipeId: string }[] = mockFavorites.map((f, i) => ({
    id: `f${i + 1}`,
    ...f,
  }));

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUsers(): User[] {
    return this.users;
  }

  getRecipes(options?: { page?: number; pageSize?: number; cuisine?: string; taste?: string; isApproved?: boolean }): { list: Recipe[]; total: number } {
    let filtered = this.recipes;

    if (options?.isApproved !== undefined) {
      filtered = filtered.filter((r) => r.isApproved === options.isApproved);
    }

    if (options?.cuisine) {
      filtered = filtered.filter((r) => r.cuisine === options.cuisine);
    }

    if (options?.taste) {
      filtered = filtered.filter((r) => r.taste.includes(options.taste));
    }

    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;

    if (options?.page && options?.pageSize) {
      const start = (options.page - 1) * options.pageSize;
      filtered = filtered.slice(start, start + options.pageSize);
    }

    const list = filtered.map((recipe) => ({
      ...recipe,
      author: this.getUserById(recipe.authorId),
    }));

    return { list, total };
  }

  getRecipeById(id: string): (Recipe & { author?: User }) | undefined {
    const recipe = this.recipes.find((r) => r.id === id);
    if (!recipe) return undefined;
    return { ...recipe, author: this.getUserById(recipe.authorId) };
  }

  createRecipe(data: Omit<Recipe, 'id' | 'createdAt' | 'isApproved' | 'favoriteCount' | 'commentCount'>): Recipe {
    const recipe: Recipe = {
      ...data,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
      isApproved: false,
      favoriteCount: 0,
      commentCount: 0,
    };
    this.recipes.unshift(recipe);
    return recipe;
  }

  approveRecipe(id: string): Recipe | undefined {
    const recipe = this.recipes.find((r) => r.id === id);
    if (recipe) {
      recipe.isApproved = true;
    }
    return recipe;
  }

  deleteRecipe(id: string): boolean {
    const index = this.recipes.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.recipes.splice(index, 1);
      this.comments = this.comments.filter((c) => c.recipeId !== id);
      this.favorites = this.favorites.filter((f) => f.recipeId !== id);
      return true;
    }
    return false;
  }

  getCommentsByRecipeId(recipeId: string): (Comment & { user?: User })[] {
    return this.comments
      .filter((c) => c.recipeId === recipeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((comment) => ({
        ...comment,
        user: this.getUserById(comment.userId),
      }));
  }

  addComment(recipeId: string, userId: string, content: string): Comment & { user?: User } {
    const comment: Comment = {
      id: `c${Date.now()}`,
      recipeId,
      userId,
      content,
      createdAt: new Date().toISOString(),
    };
    this.comments.unshift(comment);

    const recipe = this.recipes.find((r) => r.id === recipeId);
    if (recipe) {
      recipe.commentCount += 1;
    }

    return { ...comment, user: this.getUserById(userId) };
  }

  deleteComment(id: string): boolean {
    const index = this.comments.findIndex((c) => c.id === id);
    if (index !== -1) {
      const comment = this.comments[index];
      this.comments.splice(index, 1);

      const recipe = this.recipes.find((r) => r.id === comment.recipeId);
      if (recipe) {
        recipe.commentCount -= 1;
      }
      return true;
    }
    return false;
  }

  toggleFavorite(userId: string, recipeId: string): { favoriteCount: number; isFavorited: boolean } {
    const existingIndex = this.favorites.findIndex((f) => f.userId === userId && f.recipeId === recipeId);
    const recipe = this.recipes.find((r) => r.id === recipeId);
    if (!recipe) return { favoriteCount: 0, isFavorited: false };

    if (existingIndex !== -1) {
      this.favorites.splice(existingIndex, 1);
      recipe.favoriteCount -= 1;
      return { favoriteCount: recipe.favoriteCount, isFavorited: false };
    } else {
      this.favorites.push({
        id: `f${Date.now()}`,
        userId,
        recipeId,
      });
      recipe.favoriteCount += 1;
      return { favoriteCount: recipe.favoriteCount, isFavorited: true };
    }
  }

  isFavorited(userId: string, recipeId: string): boolean {
    return this.favorites.some((f) => f.userId === userId && f.recipeId === recipeId);
  }

  getUserFavorites(userId: string): (Recipe & { author?: User })[] {
    const userFavRecipeIds = this.favorites
      .filter((f) => f.userId === userId)
      .map((f) => f.recipeId);

    return this.recipes
      .filter((r) => userFavRecipeIds.includes(r.id))
      .map((recipe) => ({
        ...recipe,
        author: this.getUserById(recipe.authorId),
      }));
  }

  getUserRecipes(userId: string): (Recipe & { author?: User })[] {
    return this.recipes
      .filter((r) => r.authorId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((recipe) => ({
        ...recipe,
        author: this.getUserById(recipe.authorId),
      }));
  }

  getPotluckEvents(status?: string): (PotluckEvent & { recipe?: Recipe; initiator?: User })[] {
    let filtered = this.potluckEvents;

    if (status) {
      filtered = filtered.filter((e) => e.status === status);
    }

    filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filtered.map((event) => ({
      ...event,
      recipe: this.recipes.find((r) => r.id === event.recipeId),
      initiator: this.getUserById(event.initiatorId),
      participants: event.participants.map((p) => ({
        ...p,
        user: this.getUserById(p.userId),
      })),
    }));
  }

  getPotluckEventById(id: string): (PotluckEvent & { recipe?: Recipe; initiator?: User }) | undefined {
    const event = this.potluckEvents.find((e) => e.id === id);
    if (!event) return undefined;

    return {
      ...event,
      recipe: this.recipes.find((r) => r.id === event.recipeId),
      initiator: this.getUserById(event.initiatorId),
      participants: event.participants.map((p) => ({
        ...p,
        user: this.getUserById(p.userId),
      })),
    };
  }

  createPotluckEvent(data: Omit<PotluckEvent, 'id' | 'createdAt' | 'status' | 'participants' | 'ingredientSplit'>): PotluckEvent {
    const initiator = this.getUserById(data.initiatorId);
    const event: PotluckEvent = {
      ...data,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'recruiting',
      participants: initiator ? [{ userId: data.initiatorId, user: initiator, contribution: '发起人' }] : [],
      ingredientSplit: [],
    };
    this.potluckEvents.unshift(event);
    return event;
  }

  joinPotluckEvent(eventId: string, userId: string, contribution?: string): PotluckEvent | undefined {
    const event = this.potluckEvents.find((e) => e.id === eventId);
    if (!event) return undefined;

    if (event.participants.some((p) => p.userId === userId)) {
      return event;
    }

    if (event.participants.length >= event.maxParticipants) {
      event.status = 'full';
      return event;
    }

    const user = this.getUserById(userId);
    event.participants.push({ userId, user, contribution });

    if (event.participants.length >= event.maxParticipants) {
      event.status = 'full';
    }

    return event;
  }

  getKitchenEvents(date?: string): (KitchenEvent & { recipe?: Recipe; host?: User })[] {
    let filtered = this.kitchenEvents;

    if (date) {
      filtered = filtered.filter((e) => e.date === date);
    }

    filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filtered.map((event) => ({
      ...event,
      recipe: this.recipes.find((r) => r.id === event.recipeId),
      host: this.getUserById(event.hostId),
      participants: event.participants.map((p) => ({
        ...p,
        user: this.getUserById(p.userId),
      })),
    }));
  }

  getKitchenEventById(id: string): (KitchenEvent & { recipe?: Recipe; host?: User }) | undefined {
    const event = this.kitchenEvents.find((e) => e.id === id);
    if (!event) return undefined;

    return {
      ...event,
      recipe: this.recipes.find((r) => r.id === event.recipeId),
      host: this.getUserById(event.hostId),
      participants: event.participants.map((p) => ({
        ...p,
        user: this.getUserById(p.userId),
      })),
    };
  }

  createKitchenEvent(data: Omit<KitchenEvent, 'id' | 'createdAt' | 'status' | 'participants'>): KitchenEvent {
    const host = this.getUserById(data.hostId);
    const event: KitchenEvent = {
      ...data,
      id: `k${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'upcoming',
      participants: host ? [{ userId: data.hostId, user: host }] : [],
    };
    this.kitchenEvents.unshift(event);
    return event;
  }

  registerKitchenEvent(eventId: string, userId: string): KitchenEvent | undefined {
    const event = this.kitchenEvents.find((e) => e.id === eventId);
    if (!event) return undefined;

    if (event.participants.some((p) => p.userId === userId)) {
      return event;
    }

    if (event.participants.length >= event.maxParticipants) {
      return event;
    }

    const user = this.getUserById(userId);
    event.participants.push({ userId, user });

    return event;
  }

  getSpecials(published?: boolean): (SpecialCollection & { recipes?: Recipe[] })[] {
    let filtered = this.specials;

    if (published !== undefined) {
      filtered = filtered.filter((s) => s.isPublished === published);
    }

    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered.map((special) => ({
      ...special,
      recipes: special.recipeIds
        .map((id) => this.recipes.find((r) => r.id === id))
        .filter((r): r is Recipe => r !== undefined)
        .map((r) => ({ ...r, author: this.getUserById(r.authorId) })),
    }));
  }

  getSpecialById(id: string): (SpecialCollection & { recipes?: Recipe[] }) | undefined {
    const special = this.specials.find((s) => s.id === id);
    if (!special) return undefined;

    return {
      ...special,
      recipes: special.recipeIds
        .map((rid) => this.recipes.find((r) => r.id === rid))
        .filter((r): r is Recipe => r !== undefined)
        .map((r) => ({ ...r, author: this.getUserById(r.authorId) })),
    };
  }

  createSpecial(data: Omit<SpecialCollection, 'id' | 'createdAt'>): SpecialCollection {
    const special: SpecialCollection = {
      ...data,
      id: `s${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.specials.unshift(special);
    return special;
  }

  updateSpecial(id: string, data: Partial<Pick<SpecialCollection, 'title' | 'description' | 'recipeIds' | 'coverImage' | 'festival' | 'isPublished'>>): SpecialCollection | undefined {
    const special = this.specials.find((s) => s.id === id);
    if (!special) return undefined;

    Object.assign(special, data);
    return special;
  }

  getCuisines(): string[] {
    const cuisines = new Set(this.recipes.map((r) => r.cuisine).filter(Boolean));
    return Array.from(cuisines);
  }

  getTastes(): string[] {
    const tastes = new Set(this.recipes.flatMap((r) => r.taste).filter(Boolean));
    return Array.from(tastes);
  }
}

export const store = new DataStore();
