# 🚀 FitMate AI — Vercel & GitHub Deployment Guide

FitMate AI is structured as a full-stack **MERN (MongoDB, Express, React, Node.js)** application designed for single-repository deployment on **Vercel** with GitHub integration.

---

## 🏗️ Deployment Architecture

* **Frontend**: React + Vite + Tailwind CSS deployed as optimized static assets on Vercel Edge CDN.
* **Backend API**: Node.js + Express deployed as a Vercel Serverless Function via [`/api/index.js`](file:///c:/Users/ADMIN/Desktop/Prakash/Project/fitmate%20ai/api/index.js) and [`vercel.json`](file:///c:/Users/ADMIN/Desktop/Prakash/Project/fitmate%20ai/vercel.json).
* **Database**: MongoDB Atlas cloud cluster (accessible globally by serverless functions).
* **AI Coach**: Google Gemini integration via backend environment variable.

Both the client and backend share the **same domain** (e.g. `https://fitmate-ai.vercel.app`), eliminating CORS problems, cross-origin cookie restrictions, and separate hosting costs.

---

## 📋 Prerequisites

1. **GitHub Account**: [github.com](https://github.com)
2. **Vercel Account**: [vercel.com](https://vercel.com) (free Hobby tier)
3. **MongoDB Atlas Account**: [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) (free M0 shared cluster)
4. **Google AI Studio Key** *(Optional)*: [aistudio.google.com](https://aistudio.google.com) for Gemini API

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Cloud Database)

Since Vercel runs in the cloud, your local `localhost:27017` won't be reachable. You need a free cloud MongoDB:

1. Log into [MongoDB Atlas](https://cloud.mongodb.com).
2. Click **Create Deployment** > select **M0 (Free)** > choose any cloud region (e.g., AWS / Mumbai / us-east-1).
3. Under **Security Quickstart**:
   - Create a database user (e.g. `fitmate_admin` + a strong password).
   - Under **IP Access List**, add `0.0.0.0/0` (Allow access from anywhere — required for serverless platforms like Vercel).
4. Click **Database** > **Connect** > **Drivers** (Node.js).
5. Copy your connection URI. It looks like:
   ```env
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/fitmate_ai?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your database user credentials)*.

---

## 🐙 Step 2: Push Your Project to GitHub

Open PowerShell in the project directory (`c:\Users\ADMIN\Desktop\Prakash\Project\fitmate ai`):

```powershell
# 1. Initialize local Git repository (if not already done)
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "feat: complete FitMate AI project ready for Vercel deployment"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/fitmate-ai.git

# 6. Push to GitHub
git push -u origin main
```

---

## ⚡ Step 3: Deploy to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New…** > **Project**.
3. Under **Import Git Repository**, select your `fitmate-ai` repository.
4. In the project configuration screen:
   * **Framework Preset**: Select **Vite** (or leave as Other — `vercel.json` will auto-configure).
   * **Root Directory**: `./` (leave blank / root).
   * **Build and Output Settings**: Defaults are already managed by [`vercel.json`](file:///c:/Users/ADMIN/Desktop/Prakash/Project/fitmate%20ai/vercel.json):
     * *Build Command*: `cd client && npm install && npm run build`
     * *Output Directory*: `client/dist`
5. Expand **Environment Variables** and add the following:

| Variable Name | Example / Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas cloud connection URI |
| `JWT_SECRET` | `fitmate_production_jwt_secret_key_2026` | Any secure random string for JWT auth |
| `COOKIE_SECRET` | `fitmate_production_cookie_secret_2026` | Any secure random string for cookies |
| `NODE_ENV` | `production` | Production environment flag |
| `AI_PROVIDER` | `gemini` | AI provider for coach chat |
| `AI_API_KEY` | `AIzaSy...` | *(Optional)* Google Gemini API key |
| `AI_MODEL` | `gemini-3.5-flash-lite` | Recommended fast AI model |

6. Click **Deploy**.
7. Vercel will install dependencies, build the Vite frontend, bundle the serverless functions, and give you a live production URL (e.g. `https://fitmate-ai.vercel.app`)!

---

## 🛠️ Project Structure for Vercel

```text
fitmate-ai/
├── api/
│   └── index.js              # Vercel Serverless Function entry point (Express + MongoDB)
├── client/                   # React + Vite Frontend
│   ├── src/
│   │   ├── api/              # Axios API service (points to /api)
│   │   ├── components/       # Common, layout, dashboard components
│   │   ├── pages/            # Dashboard, CookYourMeal, Exercises, Auth, AI Coach
│   │   └── index.css         # Tailwind animations & keyframes
│   ├── dist/                 # Generated on build
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json           # Client routing fallback
├── server/                   # Express Backend Modules
│   ├── src/
│   │   ├── config/           # DB connection cache & environment loader
│   │   ├── controllers/      # REST API route handlers
│   │   ├── models/           # Mongoose schemas (User, Meal, Exercise, Recipe, etc.)
│   │   ├── routes/           # Express router files
│   │   ├── services/         # Gemini AI multi-model integration
│   │   └── utils/            # 38 exercises & 14 recipes seed data
│   ├── package.json
│   └── server.js             # Local standalone development server
├── .env.example              # Documentation of environment variables
├── .gitignore                # Proper ignore rules for dist, node_modules, and .env
├── package.json              # Monorepo root manifest
├── vercel.json               # Main Vercel routing & build configuration
└── DEPLOYMENT.md             # This deployment guide
```

---

## 🔄 Automatic Database Seeding on First Launch

When the serverless function executes for the first time on Vercel:
* It connects to your MongoDB Atlas cluster.
* It automatically triggers the initial seed for:
  * **38 gym exercises** with embedded HD YouTube workout videos.
  * **14 diet-friendly recipes** (vegetarian & non-vegetarian) with YouTube cooking guides.

---

## ❓ Frequently Asked Questions & Troubleshooting

### 1. `MongooseServerSelectionError: connect ECONNREFUSED`
* **Cause**: Your Vercel app is trying to connect to `127.0.0.1` or MongoDB Atlas blocked the connection.
* **Fix**: Ensure `MONGODB_URI` is set in Vercel environment variables with your Atlas URI, and your Atlas IP whitelist includes `0.0.0.0/0`.

### 2. `API 404 Not Found on /api/...`
* **Cause**: Missing root `vercel.json` or misconfigured rewrite.
* **Fix**: The provided `vercel.json` in the root folder routes all `/api/(.*)` requests to `/api/index.js`. Ensure you deploy with Root Directory set to `./`.

### 3. `Page Refresh Returns 404 on /dashboard or /workouts`
* **Cause**: Single-page application (SPA) routing requires falling back to `index.html`.
* **Fix**: The rewrite rule `{ "source": "/(.*)", "destination": "/index.html" }` in `vercel.json` resolves this automatically.
