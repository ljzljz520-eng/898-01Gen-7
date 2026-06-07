import { Router, Request, Response } from 'express';
import { store } from '../data/store';
import type { PotluckEvent, ApiResponse } from '../../shared/types';

const router = Router();

router.get('/', (req: Request, res: Response<ApiResponse<PotluckEvent[]>>) => {
  const status = req.query.status as string;
  const events = store.getPotluckEvents(status);
  res.json({ success: true, data: events });
});

router.get('/:id', (req: Request, res: Response<ApiResponse<PotluckEvent>>) => {
  const { id } = req.params;
  const event = store.getPotluckEventById(id);

  if (!event) {
    res.status(404).json({ success: false, error: '活动不存在' });
    return;
  }

  res.json({ success: true, data: event });
});

router.post('/', (req: Request, res: Response<ApiResponse<PotluckEvent>>) => {
  const eventData = req.body;

  if (!eventData.title || !eventData.recipeId || !eventData.date || !eventData.time || !eventData.location) {
    res.status(400).json({ success: false, error: '缺少必要信息' });
    return;
  }

  const event = store.createPotluckEvent({
    title: eventData.title,
    recipeId: eventData.recipeId,
    initiatorId: eventData.initiatorId || 'u1',
    date: eventData.date,
    time: eventData.time,
    location: eventData.location,
    maxParticipants: eventData.maxParticipants || 8,
    description: eventData.description || '',
  });

  res.json({ success: true, data: event, message: '拼菜活动创建成功' });
});

router.post('/:id/join', (req: Request, res: Response<ApiResponse<PotluckEvent>>) => {
  const { id } = req.params;
  const { userId, contribution } = req.body;

  const event = store.joinPotluckEvent(id, userId || 'u1', contribution);

  if (!event) {
    res.status(404).json({ success: false, error: '活动不存在' });
    return;
  }

  res.json({ success: true, data: event, message: '报名成功' });
});

export default router;
