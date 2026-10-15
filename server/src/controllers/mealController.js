import { Meal } from '../models/Meal.js';

// @desc    Get meals with date filtering, search, and pagination
// @route   GET /api/meals
// @access  Private
export const getMeals = async (req, res, next) => {
  try {
    const { date, startDate, endDate, category, search, page = 1, limit = 50 } = req.query;

    const query = { user: req.user._id };

    if (date) {
      const selected = new Date(date);
      const startOfDay = new Date(selected.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(selected.setUTCHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      if (endDate) query.date.$lte = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
    }

    if (category) {
      query.category = category;
    }

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [meals, totalCount] = await Promise.all([
      Meal.find(query).sort({ date: -1, time: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Meal.countDocuments(query),
    ]);

    // Calculate nutritional totals from real logged records
    const totals = meals.reduce(
      (acc, meal) => {
        if (meal.calories) acc.calories += Number(meal.calories);
        if (meal.protein) acc.protein += Number(meal.protein);
        if (meal.carbohydrates) acc.carbohydrates += Number(meal.carbohydrates);
        if (meal.fat) acc.fat += Number(meal.fat);
        return acc;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    );

    return res.status(200).json({
      success: true,
      count: meals.length,
      totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein * 10) / 10,
        carbohydrates: Math.round(totals.carbohydrates * 10) / 10,
        fat: Math.round(totals.fat * 10) / 10,
      },
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single meal by ID
// @route   GET /api/meals/:id
// @access  Private
export const getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, user: req.user._id });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a meal
// @route   POST /api/meals
// @access  Private
export const createMeal = async (req, res, next) => {
  try {
    const {
      name,
      category,
      date,
      time,
      foodDescription,
      quantity,
      calories,
      protein,
      carbohydrates,
      fat,
      notes,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Meal name is required.',
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Meal category (Breakfast, Lunch, Dinner, Snack) is required.',
      });
    }

    const mealDate = date ? new Date(date) : new Date();

    const meal = await Meal.create({
      user: req.user._id,
      name: name.trim(),
      category,
      date: mealDate,
      time: time || '',
      foodDescription: foodDescription || '',
      quantity: quantity || '',
      calories: calories !== undefined && calories !== '' ? Number(calories) : null,
      protein: protein !== undefined && protein !== '' ? Number(protein) : null,
      carbohydrates: carbohydrates !== undefined && carbohydrates !== '' ? Number(carbohydrates) : null,
      fat: fat !== undefined && fat !== '' ? Number(fat) : null,
      notes: notes || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Meal logged successfully!',
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a meal
// @route   PUT /api/meals/:id
// @access  Private
export const updateMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, user: req.user._id });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found or access denied.',
      });
    }

    const {
      name,
      category,
      date,
      time,
      foodDescription,
      quantity,
      calories,
      protein,
      carbohydrates,
      fat,
      notes,
    } = req.body;

    if (name !== undefined) meal.name = name.trim();
    if (category !== undefined) meal.category = category;
    if (date !== undefined) meal.date = new Date(date);
    if (time !== undefined) meal.time = time;
    if (foodDescription !== undefined) meal.foodDescription = foodDescription;
    if (quantity !== undefined) meal.quantity = quantity;
    if (calories !== undefined) meal.calories = calories === '' ? null : Number(calories);
    if (protein !== undefined) meal.protein = protein === '' ? null : Number(protein);
    if (carbohydrates !== undefined) meal.carbohydrates = carbohydrates === '' ? null : Number(carbohydrates);
    if (fat !== undefined) meal.fat = fat === '' ? null : Number(fat);
    if (notes !== undefined) meal.notes = notes;

    await meal.save();

    return res.status(200).json({
      success: true,
      message: 'Meal updated successfully!',
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a meal
// @route   DELETE /api/meals/:id
// @access  Private
export const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Meal deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
