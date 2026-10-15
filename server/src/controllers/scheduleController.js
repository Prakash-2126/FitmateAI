import { WorkoutSchedule } from '../models/WorkoutSchedule.js';
import { Workout } from '../models/Workout.js';

// @desc    Get workout schedules for user
// @route   GET /api/schedule
// @access  Private
export const getSchedules = async (req, res, next) => {
  try {
    const { startDate, endDate, status } = req.query;

    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      if (endDate) query.scheduledDate.$lte = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
    }

    const schedules = await WorkoutSchedule.find(query)
      .populate('workout')
      .populate('completion')
      .sort({ scheduledDate: 1, scheduledTime: 1 });

    return res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new scheduled workout
// @route   POST /api/schedule
// @access  Private
export const createSchedule = async (req, res, next) => {
  try {
    const { workoutId, scheduledDate, scheduledTime, notes } = req.body;

    if (!workoutId || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide workoutId and scheduledDate.',
      });
    }

    // Verify workout belongs to user
    const workout = await Workout.findOne({ _id: workoutId, user: req.user._id });
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout routine not found or access denied.',
      });
    }

    const schedule = await WorkoutSchedule.create({
      user: req.user._id,
      workout: workout._id,
      scheduledDate: new Date(scheduledDate),
      scheduledTime: scheduledTime || '',
      notes: notes || '',
      status: 'scheduled',
    });

    const populated = await WorkoutSchedule.findById(schedule._id).populate('workout');

    return res.status(201).json({
      success: true,
      message: 'Workout scheduled successfully!',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a scheduled workout
// @route   PUT /api/schedule/:id
// @access  Private
export const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await WorkoutSchedule.findOne({ _id: req.params.id, user: req.user._id });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Scheduled workout not found or access denied.',
      });
    }

    const { scheduledDate, scheduledTime, notes, status, completionId } = req.body;

    if (scheduledDate !== undefined) schedule.scheduledDate = new Date(scheduledDate);
    if (scheduledTime !== undefined) schedule.scheduledTime = scheduledTime;
    if (notes !== undefined) schedule.notes = notes;
    if (status !== undefined) schedule.status = status;
    if (completionId !== undefined) schedule.completion = completionId;

    await schedule.save();

    const populated = await WorkoutSchedule.findById(schedule._id).populate('workout');

    return res.status(200).json({
      success: true,
      message: 'Schedule updated successfully!',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a scheduled workout
// @route   DELETE /api/schedule/:id
// @access  Private
export const deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await WorkoutSchedule.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Scheduled workout not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Scheduled workout removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
