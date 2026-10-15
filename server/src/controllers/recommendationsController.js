import { generateRecommendations } from '../services/recommendationEngine.js';

// @desc    Get personalized fitness recommendations
// @route   GET /api/recommendations
// @access  Private
export const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await generateRecommendations(req.user._id);

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};
