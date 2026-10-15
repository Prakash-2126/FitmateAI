import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id }).populate(
      'user',
      'name email createdAt'
    );

    if (!profile) {
      profile = await Profile.create({ user: req.user._id });
      profile = await Profile.findById(profile._id).populate('user', 'name email createdAt');
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      age,
      gender,
      height,
      currentWeight,
      targetWeight,
      activityLevel,
      fitnessExperience,
      preferredWorkoutTypes,
      dietaryPreferences,
      fitnessPreferences,
      measurementUnit,
    } = req.body;

    // If name is updated, update User model as well
    if (name && name.trim()) {
      await User.findByIdAndUpdate(req.user._id, { name: name.trim() });
    }

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    if (age !== undefined) profile.age = age === '' ? null : Number(age);
    if (gender !== undefined) profile.gender = gender;
    if (height !== undefined) profile.height = height === '' ? null : Number(height);
    if (currentWeight !== undefined) profile.currentWeight = currentWeight === '' ? null : Number(currentWeight);
    if (targetWeight !== undefined) profile.targetWeight = targetWeight === '' ? null : Number(targetWeight);
    if (activityLevel !== undefined) profile.activityLevel = activityLevel;
    if (fitnessExperience !== undefined) profile.fitnessExperience = fitnessExperience;
    if (preferredWorkoutTypes !== undefined) profile.preferredWorkoutTypes = preferredWorkoutTypes;
    if (dietaryPreferences !== undefined) profile.dietaryPreferences = dietaryPreferences;
    if (fitnessPreferences !== undefined) profile.fitnessPreferences = fitnessPreferences;
    if (measurementUnit !== undefined) profile.measurementUnit = measurementUnit;

    await profile.save();

    const updatedProfile = await Profile.findById(profile._id).populate(
      'user',
      'name email createdAt'
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};
