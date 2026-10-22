import { Router } from 'express';

import { listAchievements } from '../controllers/achievement.controller.js';

const router = Router();

// Milestone badges derived from workout stats; read-only.
router.get('/', listAchievements);

export default router;
