import mongoose from 'mongoose';

const workoutExerciseItemSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sets: {
      type: Number,
      min: [1, 'Sets must be at least 1'],
      default: 3,
    },
    reps: {
      type: Number,
      min: [1, 'Reps must be at least 1'],
      default: 10,
    },
    weight: {
      type: Number,
      default: null, // in kg
    },
    duration: {
      type: Number, // in minutes or seconds
      default: null,
    },
    restInterval: {
      type: Number, // in seconds
      default: 60,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Workout routine name is required'],
      trim: true,
      maxlength: [100, 'Workout name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    workoutType: {
      type: String,
      enum: ['Strength', 'Cardio', 'HIIT', 'Full Body', 'Split', 'Yoga/Mobility', 'Other'],
      default: 'Strength',
      index: true,
    },
    estimatedDuration: {
      type: Number, // in minutes
      min: [5, 'Estimated duration must be at least 5 minutes'],
      max: [300, 'Estimated duration cannot exceed 300 minutes'],
      default: 45,
    },
    exercises: [workoutExerciseItemSchema],
  },
  {
    timestamps: true,
  }
);

workoutSchema.index({ user: 1, createdAt: -1 });

export const Workout = mongoose.model('Workout', workoutSchema);
