import express from 'express';
import {
  getRecipes,
  getRecipeById,
  logRecipeToMeal,
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.post('/:id/log-to-meal', protect, logRecipeToMeal);

export default router;
