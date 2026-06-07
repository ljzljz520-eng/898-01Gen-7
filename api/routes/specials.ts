import { Router, Request, Response } from 'express';
import { store } from '../data/store';
import type { SpecialCollection, ApiResponse } from '../../shared/types';

const router = Router();

router.get('/', (req: Request, res: Response<ApiResponse<SpecialCollection[]>>) => {
  const published = req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined;
  const specials = store.getSpecials(published);
  res.json({ success: true, data: specials });
});

router.get('/:id', (req: Request, res: Response<ApiResponse<SpecialCollection>>) => {
  const { id } = req.params;
  const special = store.getSpecialById(id);

  if (!special) {
    res.status(404).json({ success: false, error: '专题不存在' });
    return;
  }

  res.json({ success: true, data: special });
});

router.post('/', (req: Request, res: Response<ApiResponse<SpecialCollection>>) => {
  const specialData = req.body;

  if (!specialData.title || !specialData.recipeIds) {
    res.status(400).json({ success: false, error: '缺少必要信息' });
    return;
  }

  const special = store.createSpecial({
    title: specialData.title,
    description: specialData.description || '',
    coverImage: specialData.coverImage || '',
    festival: specialData.festival || '',
    recipeIds: specialData.recipeIds,
    adminId: specialData.adminId || 'u4',
    isPublished: specialData.isPublished || false,
  });

  res.json({ success: true, data: special, message: '专题创建成功' });
});

router.put('/:id', (req: Request, res: Response<ApiResponse<SpecialCollection>>) => {
  const { id } = req.params;
  const { title, description, recipeIds, coverImage, festival, isPublished } = req.body;

  const special = store.updateSpecial(id, {
    title,
    description,
    recipeIds,
    coverImage,
    festival,
    isPublished,
  });

  if (!special) {
    res.status(404).json({ success: false, error: '专题不存在' });
    return;
  }

  res.json({ success: true, data: special, message: '专题更新成功' });
});

export default router;
