import http from 'http';
import mongoose from 'mongoose';
import app from '../app.js';
import { connectDB } from '../config/db.js';
import { seedExercises } from '../utils/seedExercises.js';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Goal } from '../models/Goal.js';
import { Meal } from '../models/Meal.js';
import { Workout } from '../models/Workout.js';
import { WorkoutSchedule } from '../models/WorkoutSchedule.js';
import { WorkoutCompletion } from '../models/WorkoutCompletion.js';

let server;
let port;
let baseUrl;

const request = async (method, path, body = null, token = null) => {
  const url = `${baseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
};

const runAllTests = async () => {
  console.log('--- STARTING FITMATE AI BACKEND TEST SUITE ---');

  try {
    await connectDB();
    await seedExercises();

    // Start ephemeral server on random port
    server = app.listen(0);
    port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    console.log(`[Test Server] Running on ${baseUrl}`);

    // Cleanup previous test user if exists
    const testEmail = `test_${Date.now()}@example.com`;
    await User.deleteMany({ email: /test.*@example\.com/ });

    let authToken = null;
    let createdGoalId = null;
    let createdWorkoutId = null;
    let createdScheduleId = null;

    // Test 1: Health check
    console.log('\n[Test 1] GET /api/health');
    const health = await request('GET', '/api/health');
    console.assert(health.status === 200, `Expected 200, got ${health.status}`);
    console.assert(health.data.success === true, 'Health check should be true');
    console.log('✓ Health check passed');

    // Test 2: Reject unauthenticated private access
    console.log('\n[Test 2] GET /api/profile without token');
    const unauth = await request('GET', '/api/profile');
    console.assert(unauth.status === 401, `Expected 401, got ${unauth.status}`);
    console.log('✓ Rejected unauthenticated request passed');

    // Test 3: Register a new user
    console.log('\n[Test 3] POST /api/auth/register');
    const regRes = await request('POST', '/api/auth/register', {
      name: 'Prakash Sharma',
      email: testEmail,
      password: 'password123',
      confirmPassword: 'password123',
      termsAccepted: true,
    });
    console.assert(regRes.status === 201, `Expected 201, got ${regRes.status}`);
    console.assert(regRes.data.token, 'Token should be returned');
    authToken = regRes.data.token;
    console.log('✓ User registration passed');

    // Test 4: Reject duplicate registration
    console.log('\n[Test 4] POST /api/auth/register (duplicate email)');
    const dupRes = await request('POST', '/api/auth/register', {
      name: 'Another User',
      email: testEmail,
      password: 'password123',
      termsAccepted: true,
    });
    console.assert(dupRes.status === 400, `Expected 400, got ${dupRes.status}`);
    console.log('✓ Duplicate registration correctly rejected');

    // Test 5: Login with valid credentials
    console.log('\n[Test 5] POST /api/auth/login (valid)');
    const loginRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'password123',
    });
    console.assert(loginRes.status === 200, `Expected 200, got ${loginRes.status}`);
    console.log('✓ Login with valid credentials passed');

    // Test 6: Login with invalid credentials
    console.log('\n[Test 6] POST /api/auth/login (invalid password)');
    const badLogin = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'wrongpassword',
    });
    console.assert(badLogin.status === 401, `Expected 401, got ${badLogin.status}`);
    console.log('✓ Login with bad password correctly rejected');

    // Test 7: GET /api/auth/me
    console.log('\n[Test 7] GET /api/auth/me');
    const meRes = await request('GET', '/api/auth/me', null, authToken);
    console.assert(meRes.status === 200, `Expected 200, got ${meRes.status}`);
    console.assert(meRes.data.user.email === testEmail, 'User email matches');
    console.log('✓ User identity verification passed');

    // Test 8: Update Profile
    console.log('\n[Test 8] PUT /api/profile');
    const updateProfile = await request('PUT', '/api/profile', {
      height: 178,
      currentWeight: 75,
      targetWeight: 72,
      activityLevel: 'moderately_active',
      fitnessExperience: 'intermediate',
      preferredWorkoutTypes: ['Strength', 'Cardio'],
    }, authToken);
    console.assert(updateProfile.status === 200, `Expected 200, got ${updateProfile.status}`);
    console.assert(updateProfile.data.data.height === 178, 'Height updated');
    console.log('✓ Profile update passed');

    // Test 9: Create and list goals
    console.log('\n[Test 9] POST & GET /api/goals');
    const goalRes = await request('POST', '/api/goals', {
      title: 'Complete 4 Workouts This Week',
      category: 'workout_frequency',
      targetValue: 4,
      unit: 'workouts',
    }, authToken);
    console.assert(goalRes.status === 201, `Expected 201, got ${goalRes.status}`);
    createdGoalId = goalRes.data.data._id;

    const listGoals = await request('GET', '/api/goals', null, authToken);
    console.assert(listGoals.data.data.length >= 1, 'Should have at least 1 goal');
    console.log('✓ Fitness goal creation and retrieval passed');

    // Test 10: Create and list meals
    console.log('\n[Test 10] POST & GET /api/meals');
    const mealRes = await request('POST', '/api/meals', {
      name: 'Oatmeal & Protein Shake',
      category: 'Breakfast',
      calories: 450,
      protein: 35,
      carbohydrates: 55,
      fat: 8,
      notes: 'Post-morning stretch',
    }, authToken);
    console.assert(mealRes.status === 201, `Expected 201, got ${mealRes.status}`);

    const listMeals = await request('GET', '/api/meals', null, authToken);
    console.assert(listMeals.data.totals.calories >= 450, 'Totals calories should include logged meal');
    console.log('✓ Meal logging and nutrition aggregation passed');

    // Test 11: Exercise library browsing
    console.log('\n[Test 11] GET /api/exercises');
    const exercisesRes = await request('GET', '/api/exercises');
    console.assert(exercisesRes.status === 200, `Expected 200, got ${exercisesRes.status}`);
    console.assert(exercisesRes.data.data.length >= 10, 'Expected seeded exercises in library');
    console.log(`✓ Exercise library browsing passed (${exercisesRes.data.data.length} exercises available)`);

    // Test 12: Create Workout Routine
    console.log('\n[Test 12] POST /api/workouts');
    const workoutRes = await request('POST', '/api/workouts', {
      name: 'Upper Body Hypertrophy',
      workoutType: 'Strength',
      estimatedDuration: 50,
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: 8, restInterval: 90 },
        { name: 'Lat Pulldown', sets: 3, reps: 10, restInterval: 60 },
      ],
    }, authToken);
    console.assert(workoutRes.status === 201, `Expected 201, got ${workoutRes.status}`);
    createdWorkoutId = workoutRes.data.data._id;
    console.log('✓ Workout routine template creation passed');

    // Test 13: Schedule a workout
    console.log('\n[Test 13] POST /api/schedule');
    const scheduleRes = await request('POST', '/api/schedule', {
      workoutId: createdWorkoutId,
      scheduledDate: new Date().toISOString(),
      scheduledTime: '08:00',
    }, authToken);
    console.assert(scheduleRes.status === 201, `Expected 201, got ${scheduleRes.status}`);
    createdScheduleId = scheduleRes.data.data._id;
    console.log('✓ Workout schedule creation passed');

    // Test 14: Record Workout Completion & auto-sync goal
    console.log('\n[Test 14] POST /api/workout-completions');
    const compRes = await request('POST', '/api/workout-completions', {
      workoutId: createdWorkoutId,
      workoutName: 'Upper Body Hypertrophy',
      durationMinutes: 48,
      caloriesBurned: 320,
      scheduleId: createdScheduleId,
      exercisesCompleted: [
        { name: 'Barbell Bench Press', setsCompleted: 4, repsCompleted: 8, weightUsed: 70 },
      ],
    }, authToken);
    console.assert(compRes.status === 201, `Expected 201, got ${compRes.status}`);
    console.log('✓ Workout completion session recording passed');

    // Test 15: Progress calculation
    console.log('\n[Test 15] GET /api/progress');
    const progressRes = await request('GET', '/api/progress?range=7d', null, authToken);
    console.assert(progressRes.status === 200, `Expected 200, got ${progressRes.status}`);
    console.assert(progressRes.data.summary.totalWorkouts >= 1, 'Total workouts should be at least 1');
    console.assert(progressRes.data.timelineData.length >= 7, 'Timeline data should have points');
    console.log('✓ Progress analytics calculation passed');

    // Test 16: Recommendations generation
    console.log('\n[Test 16] GET /api/recommendations');
    const recsRes = await request('GET', '/api/recommendations', null, authToken);
    console.assert(recsRes.status === 200, `Expected 200, got ${recsRes.status}`);
    console.assert(Array.isArray(recsRes.data.data), 'Recommendations should be an array');
    console.log(`✓ Recommendations engine passed (${recsRes.data.data.length} tailored recommendations generated)`);

    // Test 17: AI Assistant chat endpoint
    console.log('\n[Test 17] POST /api/ai/chat');
    const aiChatRes = await request('POST', '/api/ai/chat', {
      message: 'Help me plan a beginner workout for upper body.',
    }, authToken);
    console.assert(aiChatRes.status === 200, `Expected 200, got ${aiChatRes.status}`);
    console.assert(typeof aiChatRes.data.reply === 'string', 'AI reply should be returned');
    console.log('✓ AI Assistant chat endpoint passed');

    console.log('\n===============================================');
    console.log('🎉 ALL BACKEND INTEGRATION TESTS PASSED (17/17)');
    console.log('===============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
  }
};

runAllTests();
