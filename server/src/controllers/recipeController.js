import { Recipe } from '../models/Recipe.js';
import { Meal } from '../models/Meal.js';

// @desc    Get all diet-friendly recipes with filters
// @route   GET /api/recipes
// @access  Public / Authenticated
export const getRecipes = async (req, res, next) => {
  try {
    const { dietaryType, mealType, tag, search, sort } = req.query;

    const query = {};

    if (dietaryType && dietaryType !== 'All') {
      if (dietaryType === 'Vegetarian') {
        // Include both Vegetarian and Vegan
        query.dietaryType = { $in: ['Vegetarian', 'Vegan'] };
      } else {
        query.dietaryType = dietaryType;
      }
    }

    if (mealType && mealType !== 'All') {
      query.mealType = mealType;
    }

    if (tag && tag !== 'All') {
      query.tags = tag;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { tags: { $regex: s, $options: 'i' } },
        { 'ingredients.item': { $regex: s, $options: 'i' } },
      ];
    }

    let sortOption = { isFeatured: -1, createdAt: -1 };
    if (sort === 'protein_desc') sortOption = { protein: -1 };
    if (sort === 'calories_asc') sortOption = { calories: 1 };
    if (sort === 'time_asc') sortOption = { cookTimeMinutes: 1 };

    const recipes = await Recipe.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public / Authenticated
export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a recipe directly into user's diet tracker for today
// @route   POST /api/recipes/:id/log-to-meal
// @access  Private
export const logRecipeToMeal = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found.',
      });
    }

    // Determine target meal category (default to recipe's mealType or Lunch)
    let category = 'Lunch';
    if (['Breakfast', 'Lunch', 'Dinner', 'Snack'].includes(recipe.mealType)) {
      category = recipe.mealType;
    }

    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');

    const meal = await Meal.create({
      user: req.user._id,
      name: recipe.title,
      category,
      date: today,
      time: `${hours}:${minutes}`,
      foodDescription: recipe.description,
      quantity: `${recipe.servings} serving`,
      calories: recipe.calories,
      protein: recipe.protein,
      carbohydrates: recipe.carbs,
      fat: recipe.fats,
      notes: `Cooked via FitMate AI "Cook Your Meal": ${recipe.videoTitle || recipe.title}`,
    });

    return res.status(201).json({
      success: true,
      message: `"${recipe.title}" logged to your ${category} tracker!`,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};
