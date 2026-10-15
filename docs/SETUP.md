# FitMate AI - Setup and Installation Guide

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended, tested on Node v22.21.0)
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance running on port 27017, or a MongoDB Atlas connection string URI.

---

## 2. Project Directory Structure
```
fitmate-ai/
├── client/          # React + Vite + Tailwind CSS frontend
├── server/          # Node.js + Express + Mongoose REST API backend
├── docs/            # Architecture & API documentation
│   ├── API.md
│   ├── DATABASE.md
│   └── SETUP.md
├── README.md        # Comprehensive project overview
└── .gitignore
```

---

## 3. Backend Setup

1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Inspect and adjust the values in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/fitmate_ai
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key_fitmate_2026
   JWT_EXPIRES_IN=7d
   COOKIE_SECRET=your_cookie_secret_fitmate_2026

   # AI Integration (Optional: Google Gemini or OpenAI)
   AI_PROVIDER=gemini
   AI_API_KEY=your_gemini_api_key_here
   AI_MODEL=gemini-1.5-flash
   ```

4. Seed the Exercise Library (runs automatically on start if library is empty, or manually):
   ```bash
   npm run seed
   ```

5. Run Automated Backend Tests:
   ```bash
   npm test
   ```

6. Start the Backend Development Server:
   ```bash
   npm run dev
   # Or for standard execution:
   npm start
   ```
   The backend server will run on: `http://localhost:5000/api`

---

## 4. Frontend Setup

1. Open a separate terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `client/.env` contains:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the Frontend Development Server:
   ```bash
   npm run dev
   ```
   The web application will open on `http://localhost:5173`

5. Verify Production Build:
   ```bash
   npm run build
   ```

---

## 5. AI Assistant Configuration Notes
- If `AI_API_KEY` is not provided in `server/.env`, the AI coach endpoint safely communicates that the API key is pending configuration, keeping the entire fitness tracker, routines, schedule, and dashboard 100% operational.
- When an API key (e.g., from [Google AI Studio](https://aistudio.google.com/)) is added to `AI_API_KEY` in `server/.env`, the chat assistant immediately provides live, intelligent responses with built-in fitness guardrails.
