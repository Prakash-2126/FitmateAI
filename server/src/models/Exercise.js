import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
      maxlength: [100, 'Exercise name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Strength', 'Cardio', 'Flexibility', 'Bodyweight', 'HIIT', 'Core'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    instructions: {
      type: [String],
      default: [],
    },
    muscleGroup: {
      type: String,
      required: [true, 'Muscle group is required'],
      enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body', 'Cardio'],
      index: true,
    },
    equipment: {
      type: String,
      enum: ['Barbell', 'Dumbbell', 'Bodyweight', 'Machine', 'Cable', 'Kettlebell', 'Bands', 'None'],
      default: 'Bodyweight',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
      index: true,
    },
    youtubeId: {
      type: String,
      trim: true,
      default: '',
    },
    videoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: '',
    },
    videoTitle: {
      type: String,
      trim: true,
      default: '',
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

exerciseSchema.index({ name: 'text', description: 'text' });

export const Exercise = mongoose.model('Exercise', exerciseSchema);
