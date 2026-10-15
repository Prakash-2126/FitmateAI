import express from 'express';
import {
  getWorkoutCompletions,
  getWorkoutCompletionById,
  createWorkoutCompletion,
} from '../controllers/completionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWorkoutCompletions)
  .post(createWorkoutCompletion);

router.route('/:id')
  .get(getWorkoutCompletionById);

export default router;
