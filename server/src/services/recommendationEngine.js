import { Profile } from '../models/Profile.js';
import { Goal } from '../models/Goal.js';
import { Meal } from '../models/Meal.js';
import { Workout } from '../models/Workout.js';
import { WorkoutSchedule } from '../models/WorkoutSchedule.js';
import { WorkoutCompletion } from '../models/WorkoutCompletion.js';

export const generateRecommendations = async (userId) => {
  const recommendations = [];

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setUTCHours(23, 59, 59, 999);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    profile,
    activeGoals,
    todayMeals,
    workoutsCount,
    upcomingSchedule,
    recentCompletions,
  ] = await Promise.all([
    Profile.findOne({ user: userId }),
    Goal.find({ user: userId, status: 'active' }),
    Meal.find({ user: userId, date: { $gte: startOfToday, $lte: endOfToday } }),
    Workout.countDocuments({ user: userId }),
    WorkoutSchedule.findOne({
      user: userId,
      status: 'scheduled',
      scheduledDate: { $gte: startOfToday },
    }).populate('workout').sort({ scheduledDate: 1 }),
    WorkoutCompletion.find({
      user: userId,
      completionDate: { $gte: sevenDaysAgo },
    }).sort({ completionDate: -1 }),
  ]);

  // 1. Profile completeness check
  if (!profile || !profile.height || !profile.currentWeight || !profile.activityLevel) {
    recommendations.push({
      id: 'rec-profile-setup',
      category: 'Profile',
      priority: 'high',
      title: 'Complete Your Fitness Profile',
      description:
        'Setting your height, weight, and activity level enables FitMate AI to provide accurate fitness benchmarks and tailored insights.',
      actionText: 'Complete Profile',
      actionUrl: '/profile',
      icon: 'UserCheck',
    });
  }

  // 2. Workout routines check
  if (workoutsCount === 0) {
    recommendations.push({
      id: 'rec-create-workout',
      category: 'Workouts',
      priority: 'high',
      title: 'Build Your First Workout Routine',
      description:
        'You have not created any custom workout routines yet. Pick exercises from the library and assemble your training split.',
      actionText: 'Create Workout',
      actionUrl: '/workouts/create',
      icon: 'Dumbbell',
    });
  }

  // 3. Today's meals check
  if (todayMeals.length === 0) {
    recommendations.push({
      id: 'rec-log-meal',
      category: 'Nutrition',
      priority: 'medium',
      title: 'Log Today’s Nutrition',
      description:
        'No meals have been recorded for today yet. Logging your breakfast, lunch, or dinner keeps your energy balance on track.',
      actionText: 'Add Meal',
      actionUrl: '/diet',
      icon: 'Utensils',
    });
  } else {
    const totalCals = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
    recommendations.push({
      id: 'rec-nutrition-progress',
      category: 'Nutrition',
      priority: 'low',
      title: `Logged ${todayMeals.length} Meal${todayMeals.length > 1 ? 's' : ''} Today (${totalCals} kcal)`,
      description:
        'Great consistency! Review your daily macronutrients to ensure you are meeting your protein and hydration needs.',
      actionText: 'View Diet Overview',
      actionUrl: '/diet',
      icon: 'CheckCircle',
    });
  }

  // 4. Upcoming scheduled workout reminder
  if (upcomingSchedule) {
    const isToday =
      new Date(upcomingSchedule.scheduledDate).toISOString().split('T')[0] ===
      new Date().toISOString().split('T')[0];

    recommendations.push({
      id: 'rec-scheduled-workout',
      category: 'Schedule',
      priority: isToday ? 'high' : 'medium',
      title: isToday
        ? `Upcoming Workout Today: ${upcomingSchedule.workout?.name || 'Session'}`
        : `Scheduled Workout Ahead: ${upcomingSchedule.workout?.name || 'Session'}`,
      description: `You have a workout scheduled for ${new Date(
        upcomingSchedule.scheduledDate
      ).toLocaleDateString()}${
        upcomingSchedule.scheduledTime ? ` at ${upcomingSchedule.scheduledTime}` : ''
      }. Stay hydrated and ready!`,
      actionText: 'View Schedule',
      actionUrl: '/schedule',
      icon: 'Calendar',
    });
  } else if (workoutsCount > 0) {
    recommendations.push({
      id: 'rec-schedule-session',
      category: 'Schedule',
      priority: 'low',
      title: 'Plan Your Training Week',
      description:
        'Scheduling workouts on your calendar significantly increases adherence. Add your next session to the schedule.',
      actionText: 'Open Schedule',
      actionUrl: '/schedule',
      icon: 'CalendarPlus',
    });
  }

  // 5. Active Goals progress
  if (activeGoals.length === 0) {
    recommendations.push({
      id: 'rec-set-goals',
      category: 'Goals',
      priority: 'medium',
      title: 'Define a Fitness Target',
      description:
        'Users with clearly defined goals reach milestones 3x faster. Create a goal for weekly workouts, consistency, or strength.',
      actionText: 'Set Fitness Goal',
      actionUrl: '/goals',
      icon: 'Target',
    });
  } else {
    const freqGoal = activeGoals.find((g) => g.category === 'workout_frequency');
    if (freqGoal) {
      recommendations.push({
        id: 'rec-goal-progress',
        category: 'Goals',
        priority: 'medium',
        title: `Goal Tracking: "${freqGoal.title}"`,
        description: `Current recorded progress: ${freqGoal.currentProgress}${
          freqGoal.targetValue ? ` / ${freqGoal.targetValue} ${freqGoal.unit || 'workouts'}` : ''
        }. Keep up the momentum!`,
        actionText: 'Manage Goals',
        actionUrl: '/goals',
        icon: 'Award',
      });
    }
  }

  // 6. Recent activity summary
  if (recentCompletions.length > 0) {
    const totalMinutes = recentCompletions.reduce((s, c) => s + (c.durationMinutes || 0), 0);
    recommendations.push({
      id: 'rec-recent-activity',
      category: 'Activity',
      priority: 'low',
      title: `7-Day Consistency: ${recentCompletions.length} Workout${
        recentCompletions.length > 1 ? 's' : ''
      } Completed`,
      description: `You have accumulated ${totalMinutes} active minutes over the past 7 days. Consistency is key to lasting adaptation.`,
      actionText: 'Inspect Analytics',
      actionUrl: '/progress',
      icon: 'TrendingUp',
    });
  }

  return recommendations;
};
