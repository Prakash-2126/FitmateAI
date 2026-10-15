import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Goal } from '../models/Goal.js';
import { Meal } from '../models/Meal.js';
import { Workout } from '../models/Workout.js';
import { WorkoutSchedule } from '../models/WorkoutSchedule.js';
import { WorkoutCompletion } from '../models/WorkoutCompletion.js';
import { Conversation } from '../models/Conversation.js';

// @desc    Change user password
// @route   PUT /api/settings/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new passwords.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match.',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match our records.',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete account and all user data
// @route   DELETE /api/settings/delete-account
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your account password to confirm deletion.',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Account deletion cancelled.',
      });
    }

    const userId = req.user._id;

    // Cascade deletion of all associated user records
    await Promise.all([
      Profile.deleteMany({ user: userId }),
      Goal.deleteMany({ user: userId }),
      Meal.deleteMany({ user: userId }),
      Workout.deleteMany({ user: userId }),
      WorkoutSchedule.deleteMany({ user: userId }),
      WorkoutCompletion.deleteMany({ user: userId }),
      Conversation.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 1000),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Your FitMate AI account and all associated records have been permanently removed.',
    });
  } catch (error) {
    next(error);
  }
};
