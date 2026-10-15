# FitMate AI - Database Schema Documentation

FitMate AI uses **MongoDB** as its persistent document database and **Mongoose** as its Object Data Modeling (ODM) layer.

---

## 1. Entity Relationship Overview

```
User (1) ── (1) Profile
User (1) ── (N) Goal
User (1) ── (N) Meal
User (1) ── (N) Workout (Routine Templates)
User (1) ── (N) WorkoutSchedule (Calendar Events)
User (1) ── (N) WorkoutCompletion (Logged Sessions)
User (1) ── (N) Conversation (AI Chat Sessions)
Exercise (Library - seeded system items + user-created custom items)
```

---

## 2. Collections & Models

### A. User (`users`)
Stores core account identity and credentials.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Unique user identifier |
| `name` | String | Required, Trim, Max: 60 | User's full name |
| `email` | String | Required, Unique, Lowercase, Indexed | Verified email address |
| `password` | String | Required, Select: false | Salted bcrypt password hash |
| `termsAccepted` | Boolean | Required: true | User agreement to terms & privacy |
| `resetPasswordToken`| String | Select: false | SHA-256 hashed password reset token |
| `resetPasswordExpire`| Date | Select: false | Expiration timestamp for reset token |
| `createdAt` / `updatedAt` | Date | Timestamps | Auto-managed timestamps |

---

### B. Profile (`profiles`)
Maintains physical attributes, biometric preferences, and fitness experience.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `user` | ObjectId | Ref: `User`, Required, Unique, Indexed | 1-to-1 association with User |
| `age` | Number | Min: 10, Max: 120 | User age |
| `gender` | String | Enum: `['male', 'female', 'other', 'prefer_not_to_say']` | Gender identity |
| `height` | Number | Min: 50, Max: 280 (cm) | Height in centimeters |
| `currentWeight`| Number | Min: 20, Max: 400 (kg) | Current weight in kilograms |
| `targetWeight` | Number | Optional (kg) | Target weight goal |
| `activityLevel`| String | Enum: `['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']` | Daily activity multiplier |
| `fitnessExperience`| String | Enum: `['beginner', 'intermediate', 'advanced']` | Experience tier |
| `preferredWorkoutTypes`| [String]| Default: `['Strength Training', 'Cardio']` | Preferred exercise categories |
| `dietaryPreferences` | [String]| Array of tags | Dietary restrictions / habits |
| `measurementUnit` | String | Enum: `['metric', 'imperial']` | Units for UI rendering |

---

### C. Goal (`goals`)
Fitness targets with progress calculation.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `user` | ObjectId | Ref: `User`, Required, Indexed | Ownership identifier |
| `title` | String | Required, Max: 100 | Goal headline |
| `category` | String | Enum: `['workout_frequency', 'exercise_consistency', 'weight_loss', 'weight_gain', 'strength', 'general_fitness', 'other']` | Target classification |
| `targetValue`| Number | Optional | Numeric benchmark |
| `currentProgress`| Number| Default: 0 | Calculated or updated progress |
| `unit` | String | e.g. `'workouts/week'`, `'kg'` | Measurement unit |
| `startDate` | Date | Default: `Date.now` | Initiation date |
| `targetDate` | Date | Optional | Deadline date |
| `status` | String | Enum: `['active', 'paused', 'completed']`, Indexed | Current status |

**Indexes**: Compound index `{ user: 1, status: 1 }`.

---

### D. Meal (`meals`)
Logged nutritional items and meals.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `user` | ObjectId | Ref: `User`, Required, Indexed | Ownership identifier |
| `name` | String | Required, Max: 100 | Meal / food item title |
| `category` | String | Enum: `['Breakfast', 'Lunch', 'Dinner', 'Snack']`, Indexed | Meal category |
| `date` | Date | Required, Indexed | Consumption date |
| `time` | String | e.g. `'08:30'` | Time of consumption |
| `foodDescription` | String | Optional | Description / ingredients |
| `quantity` | String | e.g. `'2 slices'` | Portion size |
| `calories` | Number | Min: 0, Optional | Energy in kcal |
| `protein` | Number | Min: 0, Optional | Protein in grams |
| `carbohydrates` | Number | Min: 0, Optional | Carbs in grams |
| `fat` | Number | Min: 0, Optional | Fat in grams |
| `notes` | String | Optional | Digestive or energy notes |

**Indexes**: Compound index `{ user: 1, date: -1 }`.

---

### E. Exercise (`exercises`)
Exercise library and movement database.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `name` | String | Required, Trim, Max: 100 | Exercise title |
| `category` | String | Enum: `['Strength', 'Cardio', 'Flexibility', 'Bodyweight', 'HIIT', 'Core']` | Exercise modality |
| `description` | String | Text | Overview of movement |
| `instructions` | [String] | Array | Step-by-step form cues |
| `muscleGroup` | String | Enum: `['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body', 'Cardio']` | Primary anatomy targeted |
| `equipment` | String | Enum: `['Barbell', 'Dumbbell', 'Bodyweight', 'Machine', 'Cable', 'Kettlebell', 'Bands', 'None']` | Required apparatus |
| `difficulty` | String | Enum: `['Beginner', 'Intermediate', 'Advanced']` | Technical difficulty |
| `isCustom` | Boolean | Default: false | True if created by an end user |
| `createdBy` | ObjectId | Ref: `User`, Default: null | Null for seed items |

**Indexes**: Text index on `{ name: 'text', description: 'text' }`.

---

### F. Workout (`workouts`)
Reusable workout templates and training splits.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `user` | ObjectId | Ref: `User`, Required, Indexed | Ownership identifier |
| `name` | String | Required, Max: 100 | Routine name |
| `description` | String | Optional | Training split guidance |
| `workoutType` | String | Enum: `['Strength', 'Cardio', 'HIIT', 'Full Body', 'Split', 'Yoga/Mobility', 'Other']` | Type of workout |
| `estimatedDuration` | Number | Min: 5, Max: 300 (mins) | Estimated time |
| `exercises` | Array of subdocs | Embedded exercise specifications: `{ exercise, name, sets, reps, weight, duration, restInterval, order }` | Structured sequence |

---

### G. WorkoutSchedule (`workoutschedules`)
Calendar entries scheduling workouts on future dates.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `user` | ObjectId | Ref: `User`, Required, Indexed | Ownership identifier |
| `workout` | ObjectId | Ref: `Workout`, Required | Referenced routine |
| `scheduledDate` | Date | Required, Indexed | Target session date |
| `scheduledTime` | String | e.g. `'07:00 AM'` | Preferred time |
| `notes` | String | Optional | Planning notes |
| `status` | String | Enum: `['scheduled', 'completed', 'cancelled']` | Status |
| `completion` | ObjectId | Ref: `WorkoutCompletion`, Optional | Linked session record |

**Indexes**: Compound index `{ user: 1, scheduledDate: 1 }`.

---

### H. WorkoutCompletion (`workoutcompletions`)
Verified historical records of performed workouts.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `user` | ObjectId | Ref: `User`, Required, Indexed | Ownership identifier |
| `workout` | ObjectId | Ref: `Workout`, Optional | Optional template reference |
| `workoutName` | String | Required | Snapshot of workout title |
| `completionDate` | Date | Required, Default: `Date.now`, Indexed | Date performed |
| `durationMinutes` | Number | Required, Min: 1 | Actual duration in minutes |
| `caloriesBurned` | Number | Optional | Estimated burn in kcal |
| `exercisesCompleted` | Array | `{ name, setsCompleted, repsCompleted, weightUsed }` | Performance records |
| `notes` | String | Optional | Performance reflection |
| `scheduleId` | ObjectId | Ref: `WorkoutSchedule`, Optional | Associated schedule |

**Indexes**: Compound index `{ user: 1, completionDate: -1 }`.

---

### I. Conversation (`conversations`)
AI assistant persistent conversational sessions.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `user` | ObjectId | Ref: `User`, Required, Indexed | Ownership identifier |
| `title` | String | Default: `'Fitness Chat'` | Conversation headline |
| `messages` | Array | Subdocs: `{ role: 'user'\|'assistant'\|'system', content, timestamp }` | Message history |
