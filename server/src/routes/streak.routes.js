import { Router } from 'express';

import { getStreak } from '../controllers/streak.controller.js';

const router = Router();

router.get('/', getStreak);

export default router;
