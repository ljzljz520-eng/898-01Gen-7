import { Router, Request, Response } from 'express';
import { store } from '../data/store';
import type { User, Recipe, ApiResponse } from '../../shared/types';

const router = Router();

let currentUserId = 'u1';

router.get('/current', (req: Request, res: Response<ApiResponse<User>>) => {
  const user = store.getUserById(currentUserId);
  if (!user) {
    res.status(404).json({ success: false, error: '用户不存在' });
    return;
  }
  res.json({ success: true, data: user });
});

router.post('/switch/:id', (req: Request, res: Response<ApiResponse<User>>) => {
  const { id } = req.params;
  const user = store.getUserById(id);
  if (!user) {
    res.status(404).json({ success: false, error: '用户不存在' });
    return;
  }
  currentUserId = id;
  res.json({ success: true, data: user });
});

router.get('/list', (req: Request, res: Response<ApiResponse<User[]>>) => {
  const users = store.getUsers();
  res.json({ success: true, data: users });
});

router.get('/:id', (req: Request, res: Response<ApiResponse<User>>) => {
  const { id } = req.params;
  const user = store.getUserById(id);

  if (!user) {
    res.status(404).json({ success: false, error: '用户不存在' });
    return;
  }

  res.json({ success: true, data: user });
});

router.get('/:id/favorites', (req: Request, res: Response<ApiResponse<Recipe[]>>) => {
  const { id } = req.params;
  const recipes = store.getUserFavorites(id);
  res.json({ success: true, data: recipes });
});

router.get('/:id/recipes', (req: Request, res: Response<ApiResponse<Recipe[]>>) => {
  const { id } = req.params;
  const recipes = store.getUserRecipes(id);
  res.json({ success: true, data: recipes });
});

router.delete('/comments/:id', (req: Request, res: Response<ApiResponse<null>>) => {
  const { id } = req.params;
  const success = store.deleteComment(id);

  if (!success) {
    res.status(404).json({ success: false, error: '评论不存在' });
    return;
  }

  res.json({ success: true, message: '删除成功' });
});

export default router;
