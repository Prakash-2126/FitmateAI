import express from 'express';
import { getRecommendations } from '../controllers/recommendationsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getRecommendations);

export default router;
