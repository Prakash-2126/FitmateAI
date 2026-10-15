import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    age: {
      type: Number,
      min: [10, 'Age must be at least 10'],
      max: [120, 'Age cannot exceed 120'],
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say',
    },
    height: {
      type: Number, // in cm
      min: [50, 'Height must be at least 50 cm'],
      max: [280, 'Height cannot exceed 280 cm'],
      default: null,
    },
    currentWeight: {
      type: Number, // in kg
      min: [20, 'Weight must be at least 20 kg'],
      max: [400, 'Weight cannot exceed 400 kg'],
      default: null,
    },
    targetWeight: {
      type: Number, // in kg
      min: [20, 'Target weight must be at least 20 kg'],
      max: [400, 'Target weight cannot exceed 400 kg'],
      default: null,
    },
    activityLevel: {
      type: String,
      enum: [
        'sedentary',
        'lightly_active',
        'moderately_active',
        'very_active',
        'extra_active',
      ],
      default: 'moderately_active',
    },
    fitnessExperience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    preferredWorkoutTypes: {
      type: [String],
      default: ['Strength Training', 'Cardio'],
    },
    dietaryPreferences: {
      type: [String],
      default: [],
    },
    fitnessPreferences: {
      type: String,
      default: '',
    },
    measurementUnit: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric',
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model('Profile', profileSchema);
