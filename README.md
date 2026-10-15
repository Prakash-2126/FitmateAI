# FitMate AI 🏋️‍♂️🤖
### Personal AI Fitness & Wellness Management Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-10b981.svg)](https://react.dev/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Local%20%7C%20Atlas-47A248.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203-38B2AC.svg)](https://tailwindcss.com/)
[![AI Integration](https://img.shields.io/badge/AI-Google%20Gemini-emerald.svg)](https://ai.google.dev/)

**FitMate AI** is a production-grade, full-stack personal fitness and wellness management web application designed for students, athletes, and fitness enthusiasts. It combines custom workout routine building, diet and macronutrient tracking, calendar scheduling, interactive progress charts, and an AI-powered conversational fitness coach.

---

## 🌟 Key Features

1. **Secure Authentication & Session Management**:
   - Salted `bcryptjs` password hashing and secure JSON Web Tokens (JWT).
   - HTTP-only cookie support with `Authorization: Bearer` fallback.
   - Protected route guards and session restoration on page reload.

2. **Fitness Profile Management**:
   - Manage biometric attributes: Height, Weight, Age, Gender, Target Weight, and Measurement Units (`Metric` / `Imperial`).
   - Define daily activity levels, fitness experience tiers (`Beginner`, `Intermediate`, `Advanced`), and dietary preferences.

3. **Dynamic Centralized Dashboard**:
   - Personalized greeting, real-time date indicators, and quick-action shortcuts.
   - Metric overview cards: Today's logged meals, calories recorded, upcoming workouts, active goals.
   - 7-Day workout frequency visualization using Recharts.
   - Today's meals widget and smart recommendations preview.

4. **Diet & Macronutrient Tracking**:
   - Log Breakfast, Lunch, Dinner, and Snacks.
   - Track portions, food items, calories, protein, carbohydrates, and fat.
   - Accurate daily totals computed solely from stored records.
   - Multi-parameter history search with pagination and date filters.

5. **Workout Routine Planner & Exercise Library**:
   - Pre-seeded exercise catalog across Chest, Back, Legs, Shoulders, Arms, Core, and Cardio with step-by-step form instructions.
   - Create custom exercises or assemble multi-movement routines with customizable sets, reps, load, and rest intervals.
   - Reorder movements with sequence controls.

6. **Workout Calendar & Schedule**:
   - Schedule routines on upcoming days with custom time slots.
   - Direct "Mark Complete" action that records session completion and updates calendar entries.

7. **Verified Workout Completion Records**:
   - Dedicated completion logging model (`WorkoutCompletion`) separate from template routines.
   - Preserves actual duration, load, reps, and workout notes.
   - Automatically synchronizes with active frequency and consistency goals.

8. **Progress Visualizations & Analytics**:
   - Visualized using Recharts (duration timelines, workout frequency, calorie balance).
   - Filter over 7-Day, 30-Day, 90-Day, and custom date spans.

9. **AI Fitness Coach (Google Gemini)**:
   - Protected conversational chat interface with suggested prompt chips.
   - Modular backend integration reading `AI_API_KEY` strictly on the server.
   - Built-in medical guardrails and educational health disclaimers.
   - Graceful fallback guidance if an API key is not configured.

10. **Rule-Based Personalized Recommendations**:
    - Transparent recommendations derived from user profile completeness, workout schedules, goal targets, and nutrition habits.

11. **Settings & Account Governance**:
    - Password updates requiring current credential verification.
    - Permanent account deletion workflow with cascading data cleanup.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, JavaScript (ESM), React Router 6, Tailwind CSS 3, Axios, Recharts 2, Lucide React |
| **Backend** | Node.js (v18+), Express.js 4, JavaScript (ESM), Mongoose 8, JSON Web Token (JWT), Bcryptjs, Helmet, Morgan, Express Rate Limit |
| **Database** | MongoDB (Local service or MongoDB Atlas) |
| **AI Integration** | Modular Google Gemini API (`gemini-1.5-flash`) or OpenAI-compatible provider |

---

## 📁 Project Directory Layout

```
fitmate-ai/
├── client/
│   ├── src/
│   │   ├── api/             # Axios instances and API service functions
│   │   ├── components/
│   │   │   ├── common/      # Navbar, Footer, Modal, StatCard, EmptyState, Alert
│   │   │   └── layout/      # PublicLayout, DashboardLayout, Sidebar, TopHeader
│   │   ├── context/         # AuthContext & NotificationContext
│   │   ├── pages/
│   │   │   ├── public/      # Home, About, Features, Privacy, Terms, NotFound
│   │   │   ├── auth/        # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── dashboard/   # Dashboard overview
│   │   │   ├── profile/     # Profile settings
│   │   │   ├── goals/       # Fitness goals CRUD & sync
│   │   │   ├── diet/        # Daily tracker & history
│   │   │   ├── exercises/   # Exercise library & custom builder
│   │   │   ├── workouts/    # Routine planner & workout details
│   │   │   ├── schedule/    # Calendar schedule
│   │   │   ├── progress/    # Recharts analytics
│   │   │   ├── assistant/   # AI chat coach
│   │   │   ├── recommendations/ # Smart rule-based recommendations
│   │   │   └── settings/    # Account security & deletion
│   │   ├── routes/          # AppRoutes, ProtectedRoute, PublicRoute
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/
│   ├── src/
│   │   ├── config/          # Database connection & env variables
│   │   ├── controllers/     # REST API route controllers
│   │   ├── middleware/      # JWT auth, error handler, rate limiters
│   │   ├── models/          # Mongoose database models
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # AI service & recommendation engine
│   │   ├── tests/           # Automated integration test suite
│   │   ├── utils/           # Exercise library seeder & token utils
│   │   ├── app.js           # Express app configuration
│   │   └── server.js        # Server listener
│   └── package.json
├── docs/
│   ├── API.md               # Complete REST API specification
│   ├── DATABASE.md          # Database schema & indexing documentation
│   └── SETUP.md             # Detailed installation and setup guide
├── README.md
└── .gitignore
```

---

## 🚀 Quickstart Installation Guide

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher
- Running MongoDB instance (`mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Setup Backend
```bash
cd server
npm install
cp .env.example .env
```
Ensure your `server/.env` is configured:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/fitmate_ai
CLIENT_URL=http://localhost:5173
JWT_SECRET=fitmate_ai_jwt_super_secret_dev_key_2026
JWT_EXPIRES_IN=7d
COOKIE_SECRET=fitmate_ai_cookie_dev_secret_2026

# Optional: Set your Google Gemini API key to activate the live AI Coach
AI_PROVIDER=gemini
AI_API_KEY=
AI_MODEL=gemini-1.5-flash
```

Run tests and start backend:
```bash
npm test        # Runs full 17-point integration test suite
npm run dev     # Starts backend with live reload on http://localhost:5000
```

### 2. Setup Frontend
```bash
cd ../client
npm install
cp .env.example .env
npm run dev     # Starts Vite development server on http://localhost:5173
```

Open **`http://localhost:5173`** in your browser to start using FitMate AI!

---

## 🧪 Testing the APIs

FitMate AI includes an automated end-to-end integration test runner in `server/src/tests/runTests.js`.

To execute the test suite:
```bash
cd server
npm test
```
The test runner validates:
- System health checks (`GET /api/health`)
- Protected route unauthenticated rejection (401)
- User registration & duplicate rejection (400)
- Credential authentication & bad password handling (401)
- User identity verification (`GET /api/auth/me`)
- Profile update and biometric synchronization
- Fitness goal creation, retrieval, and status toggles
- Meal logging with nutritional sum computation
- Exercise catalog browsing
- Workout routine template creation
- Workout scheduling on the calendar
- Workout completion recording and automatic goal incrementing
- Progress metric aggregation across custom date ranges
- Dynamic rule-based recommendations generation
- AI assistant chat interaction and prompt handling

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Passwords salted and hashed with `bcryptjs` before persisting to MongoDB.
- **Authorization Scoping**: Every private query verifies `user: req.user._id` to prevent cross-account data leakage.
- **Security Headers**: Secured with `helmet` and custom CORS policies allowing client credentials.
- **Rate Limiting**: `express-rate-limit` prevents brute-forcing on authentication (`/api/auth/*`) and chat abuse (`/api/ai/*`).
- **Secret Isolation**: Frontend never receives private database strings or AI API keys.

---

## ⚕️ Important Medical & Clinical Disclaimer
FitMate AI provides educational and personal wellness guidance only. It is **not** a licensed medical provider and does not diagnose, treat, or cure medical conditions. Consult a qualified physician or healthcare professional before beginning any new training program or making substantial dietary modifications.

---

## 📄 License
ISC License © FitMate AI Team.
