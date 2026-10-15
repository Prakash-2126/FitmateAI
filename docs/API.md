# FitMate AI - REST API Documentation

All API endpoints are prefixed with `/api`.
All protected endpoints require either:
1. `Authorization: Bearer <jwt_token>` header, or
2. Valid `token` HTTP-Only cookie.

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Register a new user account and initialize a blank profile.
- **Access**: Public
- **Rate Limit**: 30 requests / 15 mins
- **Request Body**:
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123",
    "termsAccepted": true
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful! Welcome to FitMate AI.",
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": "64f1...",
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "termsAccepted": true
    }
  }
  ```

---

### `POST /api/auth/login`
Authenticate existing user and return token + cookie.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "alex@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1...",
    "user": { ... }
  }
  ```

---

### `GET /api/auth/me`
Retrieve currently logged-in user profile info.
- **Access**: Protected
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "64f1...",
      "name": "Alex Johnson",
      "email": "alex@example.com"
    }
  }
  ```

---

### `POST /api/auth/logout`
Clear HTTP-only cookie and end session.
- **Access**: Protected
- **Response (200 OK)**:
  ```json
  { "success": true, "message": "User logged out successfully." }
  ```

---

### `POST /api/auth/forgot-password`
Initiate password recovery token generation.
- **Access**: Public
- **Request Body**: `{ "email": "alex@example.com" }`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "If an account exists with that email, a password reset token has been issued.",
    "devResetToken": "a3b9f4..."
  }
  ```

---

### `POST /api/auth/reset-password/:token`
Reset user password using token.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "password": "newSecurePassword123",
    "confirmPassword": "newSecurePassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  { "success": true, "message": "Password reset successful. You are now logged in.", "token": "..." }
  ```

---

## 2. Profile Endpoints (`/api/profile`)

### `GET /api/profile`
Retrieve authenticated user's physical profile.
- **Access**: Protected
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "64f2...",
      "user": { "name": "Alex Johnson", "email": "alex@example.com" },
      "height": 178,
      "currentWeight": 75,
      "targetWeight": 72,
      "activityLevel": "moderately_active",
      "fitnessExperience": "intermediate",
      "preferredWorkoutTypes": ["Strength Training", "Cardio"],
      "dietaryPreferences": ["High-Protein"],
      "measurementUnit": "metric"
    }
  }
  ```

### `PUT /api/profile`
Update user's physical attributes and preferences.
- **Access**: Protected
- **Request Body**:
  ```json
  {
    "height": 180,
    "currentWeight": 74.5,
    "targetWeight": 72,
    "activityLevel": "very_active"
  }
  ```

---

## 3. Fitness Goals Endpoints (`/api/goals`)

### `GET /api/goals`
Fetch user's fitness goals with optional `?status=active|completed|paused` filter.
- **Access**: Protected

### `POST /api/goals`
Create a new fitness goal.
- **Request Body**:
  ```json
  {
    "title": "Workout 4 Times Per Week",
    "category": "workout_frequency",
    "targetValue": 4,
    "unit": "workouts",
    "startDate": "2026-10-09",
    "targetDate": "2026-11-09"
  }
  ```

### `PUT /api/goals/:id`
Update an existing goal. Automatically marks completed if `currentProgress >= targetValue`.

### `DELETE /api/goals/:id`
Permanently delete user goal.

### `POST /api/goals/:id/sync`
Recalculate goal progress by querying actual `WorkoutCompletion` records since `startDate`.

---

## 4. Diet Tracking Endpoints (`/api/meals`)

### `GET /api/meals`
List meals with query parameters:
- `?date=YYYY-MM-DD` (Exact date match)
- `?startDate=&endDate=` (Date range)
- `?category=Breakfast|Lunch|Dinner|Snack`
- `?search=oatmeal` (Search name)
- `?page=1&limit=20` (Pagination)
- **Response (200 OK)**: Returns meals list plus exact computed nutritional sums `{ calories, protein, carbohydrates, fat }`.

### `POST /api/meals`
Log a meal entry.
- **Request Body**:
  ```json
  {
    "name": "Grilled Chicken & Rice Bowl",
    "category": "Lunch",
    "date": "2026-10-09",
    "time": "12:30",
    "foodDescription": "200g chicken breast, 1 cup jasmine rice, broccoli",
    "quantity": "1 bowl",
    "calories": 550,
    "protein": 48,
    "carbohydrates": 65,
    "fat": 9,
    "notes": "Post-workout lunch"
  }
  ```

### `PUT /api/meals/:id` & `DELETE /api/meals/:id`
Update or remove a logged meal.

---

## 5. Exercise Library Endpoints (`/api/exercises`)

### `GET /api/exercises`
Browse exercise library.
- **Query Params**: `?category=&muscleGroup=&difficulty=&equipment=&search=`
- **Access**: Public / Authenticated

### `GET /api/exercises/:id`
Inspect exercise detail and step-by-step instructions.

### `POST /api/exercises`
Create a custom exercise scoped to the user account.
- **Access**: Protected

---

## 6. Workout Routine Endpoints (`/api/workouts`)

### `GET /api/workouts`
List all workout routines created by the user.

### `POST /api/workouts`
Create a workout routine template.
- **Request Body**:
  ```json
  {
    "name": "Push Day Hypertrophy",
    "workoutType": "Strength",
    "estimatedDuration": 50,
    "exercises": [
      {
        "name": "Barbell Bench Press",
        "sets": 4,
        "reps": 8,
        "weight": 75,
        "restInterval": 90
      },
      {
        "name": "Incline Dumbbell Press",
        "sets": 3,
        "reps": 10,
        "weight": 24,
        "restInterval": 60
      }
    ]
  }
  ```

### `GET /api/workouts/:id`, `PUT /api/workouts/:id`, `DELETE /api/workouts/:id`
Retrieve, update, or remove workout routine.

---

## 7. Workout Schedule Endpoints (`/api/schedule`)

### `GET /api/schedule`
Get scheduled workouts for user. Supports `?startDate=&endDate=&status=scheduled|completed`.

### `POST /api/schedule`
Schedule routine on the calendar.
- **Request Body**:
  ```json
  {
    "workoutId": "64f3...",
    "scheduledDate": "2026-10-10",
    "scheduledTime": "08:00 AM",
    "notes": "Morning session"
  }
  ```

### `PUT /api/schedule/:id` & `DELETE /api/schedule/:id`
Reschedule, update, or remove scheduled session.

---

## 8. Workout Completion Endpoints (`/api/workout-completions`)

### `GET /api/workout-completions`
Fetch recorded historical workout completions.

### `POST /api/workout-completions`
Record a completed workout session.
- **Request Body**:
  ```json
  {
    "workoutId": "64f3...",
    "workoutName": "Push Day Hypertrophy",
    "completionDate": "2026-10-09T18:00:00.000Z",
    "durationMinutes": 48,
    "caloriesBurned": 330,
    "scheduleId": "optional_schedule_id",
    "notes": "Felt strong on bench press"
  }
  ```
- **Side Effects**: Automatically updates linked schedule to `completed` and auto-increments active frequency goals.

---

## 9. Progress Analytics Endpoints (`/api/progress`)

### `GET /api/progress`
Aggregate metrics for analytics and Recharts visualizations.
- **Query Params**: `?range=7d|30d|90d|custom&startDate=&endDate=`
- **Response (200 OK)**:
  - `summary`: total workouts, active duration, hours, calories burned, average session length, active goals.
  - `timelineData`: daily breakdown array with `{ date, workouts, duration, caloriesBurned, caloriesConsumed }`.
  - `goals`: goal achievements.
  - `profileWeight`: current and target bodyweight.

---

## 10. Personalized Recommendations (`/api/recommendations`)

### `GET /api/recommendations`
Inspect rule-based actionable insights generated from user's actual profile, active goals, workouts count, upcoming calendar events, and meal logging habits.

---

## 11. AI Assistant Endpoints (`/api/ai`)

### `POST /api/ai/chat`
Conversational chat with AI fitness coach.
- **Access**: Protected
- **Rate Limit**: 20 requests / 1 min
- **Request Body**:
  ```json
  {
    "message": "Can you explain progressive overload for a beginner?",
    "conversationId": "optional_conversation_id"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "isConfigured": true,
    "reply": "Progressive overload is the gradual increase of stress placed upon the body during exercise training...",
    "conversationId": "64f4..."
  }
  ```

### `GET /api/ai/conversations` & `DELETE /api/ai/conversations/:id`
List and delete stored conversational sessions.

---

## 12. Settings Endpoints (`/api/settings`)

### `PUT /api/settings/change-password`
Change user password requiring current password verification.

### `DELETE /api/settings/delete-account`
Irrevocably deletes user account and executes cascading removal of all profile entries, routines, schedules, completion records, meals, and AI conversations. Requires current password confirmation.
