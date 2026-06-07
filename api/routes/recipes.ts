import { Router, Request, Response } from 'express';
import { store } from '../data/store';
import type { Recipe, ApiResponse, PaginatedResponse, Comment } from '../../shared/types';

const router = Router();

router.get('/', (req: Request, res: Response<ApiResponse<PaginatedResponse<Recipe>>>) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 12;
  const cuisine = req.query.cuisine as string;
  const taste = req.query.taste as string;

  const { list, total } = store.getRecipes({
    page,
    pageSize,
    cuisine,
    taste,
    isApproved: true,
  });

  res.json({
    success: true,
    data: {
      list,
      total,
      page,
      pageSize,
    },
  });
});

router.get('/pending', (req: Request, res: Response<ApiResponse<Recipe[]>>) => {
  const { list } = store.getRecipes({ isApproved: false });
  res.json({ success: true, data: list });
});

router.get('/cuisines', (req: Request, res: Response<ApiResponse<string[]>>) => {
  const cuisines = store.getCuisines();
  res.json({ success: true, data: cuisines });
});

router.get('/tastes', (req: Request, res: Response<ApiResponse<string[]>>) => {
  const tastes = store.getTastes();
  res.json({ success: true, data: tastes });
});

router.get('/:id', (req: Request, res: Response<ApiResponse<Recipe>>) => {
  const { id } = req.params;
  const recipe = store.getRecipeById(id);

  if (!recipe) {
    res.status(404).json({ success: false, error: '菜谱不存在' });
    return;
  }

  res.json({ success: true, data: recipe });
});

router.post('/', (req: Request, res: Response<ApiResponse<Recipe>>) => {
  const recipeData = req.body;

  if (!recipeData.title || !recipeData.ingredients || !recipeData.steps) {
    res.status(400).json({ success: false, error: '缺少必要信息' });
    return;
  }

  const recipe = store.createRecipe({
    title: recipeData.title,
    coverImage: recipeData.coverImage || '',
    authorId: recipeData.authorId || 'u1',
    cuisine: recipeData.cuisine || '家常菜',
    taste: recipeData.taste || [],
    servings: recipeData.servings || 2,
    ingredients: recipeData.ingredients,
    steps: recipeData.steps,
    allergens: recipeData.allergens || [],
    allergenNote: recipeData.allergenNote,
    description: recipeData.description || '',
  });

  res.json({ success: true, data: recipe, message: '菜谱发布成功，等待审核' });
});

router.put('/:id/approve', (req: Request, res: Response<ApiResponse<Recipe>>) => {
  const { id } = req.params;
  const recipe = store.approveRecipe(id);

  if (!recipe) {
    res.status(404).json({ success: false, error: '菜谱不存在' });
    return;
  }

  res.json({ success: true, data: recipe, message: '审核通过' });
});

router.delete('/:id', (req: Request, res: Response<ApiResponse<null>>) => {
  const { id } = req.params;
  const success = store.deleteRecipe(id);

  if (!success) {
    res.status(404).json({ success: false, error: '菜谱不存在' });
    return;
  }

  res.json({ success: true, message: '删除成功' });
});

router.get('/:id/comments', (req: Request, res: Response<ApiResponse<Comment[]>>) => {
  const { id } = req.params;
  const comments = store.getCommentsByRecipeId(id);
  res.json({ success: true, data: comments });
});

router.post('/:id/comments', (req: Request, res: Response<ApiResponse<Comment>>) => {
  const { id } = req.params;
  const { userId, content } = req.body;

  if (!content) {
    res.status(400).json({ success: false, error: '评论内容不能为空' });
    return;
  }

  const comment = store.addComment(id, userId || 'u1', content);
  res.json({ success: true, data: comment, message: '评论成功' });
});

router.post('/:id/favorite', (req: Request, res: Response<ApiResponse<{ favoriteCount: number; isFavorited: boolean }>>) => {
  const { id } = req.params;
  const { userId } = req.body;
  const result = store.toggleFavorite(userId || 'u1', id);
  res.json({ success: true, data: result });
});

router.get('/:id/favorite', (req: Request, res: Response<ApiResponse<boolean>>) => {
  const { id } = req.params;
  const userId = req.query.userId as string;
  const isFavorited = store.isFavorited(userId || 'u1', id);
  res.json({ success: true, data: isFavorited });
});

export default router;
