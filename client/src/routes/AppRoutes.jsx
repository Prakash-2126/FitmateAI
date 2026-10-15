import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// Public Pages
import { Home } from '../pages/public/Home';
import { About } from '../pages/public/About';
import { Features } from '../pages/public/Features';
import { Privacy } from '../pages/public/Privacy';
import { Terms } from '../pages/public/Terms';
import { NotFound } from '../pages/public/NotFound';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

// Dashboard & Feature Pages
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Profile } from '../pages/profile/Profile';
import { Goals } from '../pages/goals/Goals';
import { DietOverview } from '../pages/diet/DietOverview';
import { DietHistory } from '../pages/diet/DietHistory';
import { CookYourMeal } from '../pages/recipes/CookYourMeal';
import { Exercises } from '../pages/exercises/Exercises';
import { WorkoutsList } from '../pages/workouts/WorkoutsList';
import { WorkoutCreateEdit } from '../pages/workouts/WorkoutCreateEdit';
import { WorkoutDetail } from '../pages/workouts/WorkoutDetail';
import { Schedule } from '../pages/schedule/Schedule';
import { Progress } from '../pages/progress/Progress';
import { AIAssistant } from '../pages/assistant/AIAssistant';
import { Recommendations } from '../pages/recommendations/Recommendations';
import { Settings } from '../pages/settings/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with Standard Header/Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Auth Pages (Forbidden to logged-in users, redirected to /dashboard) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Protected App Routes (Wrapped in ProtectedRoute and DashboardLayout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/diet" element={<DietOverview />} />
          <Route path="/diet/history" element={<DietHistory />} />
          <Route path="/cook-your-meal" element={<CookYourMeal />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/workouts" element={<WorkoutsList />} />
          <Route path="/workouts/create" element={<WorkoutCreateEdit />} />
          <Route path="/workouts/edit/:id" element={<WorkoutCreateEdit />} />
          <Route path="/workouts/:id" element={<WorkoutDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
