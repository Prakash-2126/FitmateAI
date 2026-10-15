import { WorkoutCompletion } from '../models/WorkoutCompletion.js';
import { Goal } from '../models/Goal.js';
import { Meal } from '../models/Meal.js';
import { Profile } from '../models/Profile.js';

// @desc    Get aggregated progress metrics for charts and summaries
// @route   GET /api/progress
// @access  Private
export const getProgress = async (req, res, next) => {
  try {
    const { range = '30d', startDate: customStart, endDate: customEnd } = req.query;

    const now = new Date();
    let startDate;
    let endDate = customEnd ? new Date(new Date(customEnd).setUTCHours(23, 59, 59, 999)) : now;

    if (customStart) {
      startDate = new Date(new Date(customStart).setUTCHours(0, 0, 0, 0));
    } else {
      switch (range) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    const query = {
      user: req.user._id,
      completionDate: { $gte: startDate, $lte: endDate },
    };

    const [completions, goals, meals, profile] = await Promise.all([
      WorkoutCompletion.find(query).sort({ completionDate: 1 }),
      Goal.find({ user: req.user._id }),
      Meal.find({
        user: req.user._id,
        date: { $gte: startDate, $lte: endDate },
      }),
      Profile.findOne({ user: req.user._id }),
    ]);

    // Aggregate workout statistics
    const totalWorkouts = completions.length;
    const totalDurationMinutes = completions.reduce(
      (sum, item) => sum + (item.durationMinutes || 0),
      0
    );
    const totalCaloriesBurned = completions.reduce(
      (sum, item) => sum + (item.caloriesBurned || 0),
      0
    );
    const averageDuration = totalWorkouts > 0 ? Math.round(totalDurationMinutes / totalWorkouts) : 0;

    // Daily chart aggregation
    const dailyMap = {};
    const dIter = new Date(startDate);
    while (dIter <= endDate) {
      const dateKey = dIter.toISOString().split('T')[0];
      dailyMap[dateKey] = {
        date: dateKey,
        workouts: 0,
        duration: 0,
        caloriesBurned: 0,
        caloriesConsumed: 0,
      };
      dIter.setDate(dIter.getDate() + 1);
    }

    completions.forEach((comp) => {
      const dKey = new Date(comp.completionDate).toISOString().split('T')[0];
      if (dailyMap[dKey]) {
        dailyMap[dKey].workouts += 1;
        dailyMap[dKey].duration += comp.durationMinutes || 0;
        dailyMap[dKey].caloriesBurned += comp.caloriesBurned || 0;
      }
    });

    meals.forEach((meal) => {
      const dKey = new Date(meal.date).toISOString().split('T')[0];
      if (dailyMap[dKey] && meal.calories) {
        dailyMap[dKey].caloriesConsumed += meal.calories;
      }
    });

    const timelineData = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

    // Goal summary
    const activeGoals = goals.filter((g) => g.status === 'active');
    const completedGoals = goals.filter((g) => g.status === 'completed');

    return res.status(200).json({
      success: true,
      timeframe: {
        startDate,
        endDate,
        range,
      },
      summary: {
        totalWorkouts,
        totalDurationMinutes,
        totalDurationHours: Math.round((totalDurationMinutes / 60) * 10) / 10,
        totalCaloriesBurned,
        averageDuration,
        activeGoalsCount: activeGoals.length,
        completedGoalsCount: completedGoals.length,
        totalMealsLogged: meals.length,
      },
      timelineData,
      goals,
      profileWeight: {
        current: profile?.currentWeight || null,
        target: profile?.targetWeight || null,
        unit: profile?.measurementUnit === 'imperial' ? 'lbs' : 'kg',
      },
    });
  } catch (error) {
    next(error);
  }
};
