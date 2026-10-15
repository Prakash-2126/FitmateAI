import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'workout_frequency',
        'exercise_consistency',
        'weight_loss',
        'weight_gain',
        'strength',
        'general_fitness',
        'other',
      ],
      default: 'general_fitness',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    targetValue: {
      type: Number,
      default: null,
    },
    currentProgress: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

goalSchema.index({ user: 1, status: 1 });

export const Goal = mongoose.model('Goal', goalSchema);
