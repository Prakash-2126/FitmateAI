import express from 'express';
import {
  getExercises,
  getExerciseById,
  createCustomExercise,
} from '../controllers/exerciseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Browsing exercises is public, creating custom exercises requires auth
router.get('/', getExercises);
router.get('/:id', getExerciseById);
router.post('/', protect, createCustomExercise);

export default router;
