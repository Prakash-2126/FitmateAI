import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
      maxlength: [100, 'Meal name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Meal category is required'],
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    time: {
      type: String,
      default: '',
      trim: true,
    },
    foodDescription: {
      type: String,
      trim: true,
      default: '',
    },
    quantity: {
      type: String,
      trim: true,
      default: '',
    },
    calories: {
      type: Number,
      min: [0, 'Calories cannot be negative'],
      default: null,
    },
    protein: {
      type: Number, // in grams
      min: [0, 'Protein cannot be negative'],
      default: null,
    },
    carbohydrates: {
      type: Number, // in grams
      min: [0, 'Carbohydrates cannot be negative'],
      default: null,
    },
    fat: {
      type: Number, // in grams
      min: [0, 'Fat cannot be negative'],
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

mealSchema.index({ user: 1, date: -1 });

export const Meal = mongoose.model('Meal', mealSchema);
