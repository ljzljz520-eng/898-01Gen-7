import { Router, Request, Response } from 'express';
import { store } from '../data/store';
import type { KitchenEvent, ApiResponse } from '../../shared/types';

const router = Router();

router.get('/', (req: Request, res: Response<ApiResponse<KitchenEvent[]>>) => {
  const date = req.query.date as string;
  const events = store.getKitchenEvents(date);
  res.json({ success: true, data: events });
});

router.get('/:id', (req: Request, res: Response<ApiResponse<KitchenEvent>>) => {
  const { id } = req.params;
  const event = store.getKitchenEventById(id);

  if (!event) {
    res.status(404).json({ success: false, error: '活动不存在' });
    return;
  }

  res.json({ success: true, data: event });
});

router.post('/', (req: Request, res: Response<ApiResponse<KitchenEvent>>) => {
  const eventData = req.body;

  if (!eventData.title || !eventData.recipeId || !eventData.date || !eventData.startTime || !eventData.endTime || !eventData.location) {
    res.status(400).json({ success: false, error: '缺少必要信息' });
    return;
  }

  const event = store.createKitchenEvent({
    title: eventData.title,
    recipeId: eventData.recipeId,
    hostId: eventData.hostId || 'u1',
    date: eventData.date,
    startTime: eventData.startTime,
    endTime: eventData.endTime,
    location: eventData.location,
    maxParticipants: eventData.maxParticipants || 8,
    description: eventData.description || '',
  });

  res.json({ success: true, data: event, message: '共享厨房活动创建成功' });
});

router.post('/:id/register', (req: Request, res: Response<ApiResponse<KitchenEvent>>) => {
  const { id } = req.params;
  const { userId } = req.body;

  const event = store.registerKitchenEvent(id, userId || 'u1');

  if (!event) {
    res.status(404).json({ success: false, error: '活动不存在' });
    return;
  }

  res.json({ success: true, data: event, message: '报名成功' });
});

export default router;
