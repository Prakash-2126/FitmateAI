import mongoose from 'mongoose';

const completedExerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    setsCompleted: {
      type: Number,
      default: 3,
    },
    repsCompleted: {
      type: Number,
      default: 10,
    },
    weightUsed: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const workoutCompletionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      default: null,
    },
    workoutName: {
      type: String,
      required: [true, 'Workout name is required'],
      trim: true,
    },
    completionDate: {
      type: Date,
      required: [true, 'Completion date is required'],
      default: Date.now,
      index: true,
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    caloriesBurned: {
      type: Number,
      default: null,
    },
    exercisesCompleted: [completedExerciseSchema],
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutSchedule',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

workoutCompletionSchema.index({ user: 1, completionDate: -1 });

export const WorkoutCompletion = mongoose.model('WorkoutCompletion', workoutCompletionSchema);
