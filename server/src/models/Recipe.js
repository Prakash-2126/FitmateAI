import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    dietaryType: {
      type: String,
      required: [true, 'Dietary type is required'],
      enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan'],
      index: true,
    },
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Meal Prep'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    prepTimeMinutes: {
      type: Number,
      default: 10,
    },
    cookTimeMinutes: {
      type: Number,
      default: 15,
    },
    servings: {
      type: Number,
      default: 1,
    },
    // Nutrition Per Serving
    calories: {
      type: Number,
      required: [true, 'Calories count is required'],
      min: 0,
    },
    protein: {
      type: Number,
      required: [true, 'Protein is required'],
      min: 0,
    },
    carbs: {
      type: Number,
      required: [true, 'Carbohydrates are required'],
      min: 0,
    },
    fats: {
      type: Number,
      required: [true, 'Fats are required'],
      min: 0,
    },
    fiber: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Video Demonstration
    youtubeId: {
      type: String,
      required: [true, 'YouTube video ID is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    videoTitle: {
      type: String,
      trim: true,
    },
    // Cooking Details
    ingredients: [
      {
        item: { type: String, required: true },
        amount: { type: String, default: '' },
      },
    ],
    instructions: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Recipe = mongoose.model('Recipe', recipeSchema);
