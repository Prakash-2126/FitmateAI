import mongoose from 'mongoose';

const workoutScheduleSchema = new mongoose.Schema(
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
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
      index: true,
    },
    scheduledTime: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    completion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutCompletion',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

workoutScheduleSchema.index({ user: 1, scheduledDate: 1 });

export const WorkoutSchedule = mongoose.model('WorkoutSchedule', workoutScheduleSchema);
