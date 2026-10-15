import React from 'react';
import { Shield, Lock, Database, Cpu, EyeOff } from 'lucide-react';

export const Privacy = () => {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Security & Governance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy & Data Practice
          </h1>
          <p className="mt-3 text-base text-slate-600">
            A transparent overview of how FitMate AI stores, processes, and protects your information.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs space-y-8 text-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              1. Information We Collect and Store
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              FitMate AI stores only the data you explicitly supply to provide personalized fitness tracking:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1.5 pl-2 text-slate-600">
              <li><strong>Account Credentials:</strong> Full name and email address. Passwords are never stored in plaintext; they are hashed using bcrypt with salted rounds.</li>
              <li><strong>Fitness Profile:</strong> Height, bodyweight, age, activity level, workout preferences, and measurement units.</li>
              <li><strong>Activity Records:</strong> Workout routines created, scheduled events, recorded session completions, and meal entries with optional macronutrients.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              2. How AI Interactions Are Processed
            </h2>
            <p className="text-sm leading-relaxed mb-2">
              When querying the AI Coach, your message is processed through our Express backend server.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Your API keys and credentials are strictly stored in server-side environment variables and are never transmitted to frontend browsers. To maintain conversational context, only high-level experience tiers (e.g., &quot;Beginner&quot;) and recent chat messages are forwarded to the configured AI API provider (e.g. Google Gemini). Sensitive passwords or payment data are never shared with AI models.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              3. Data Ownership & Deletion
            </h2>
            <p className="text-sm leading-relaxed">
              Every database document is strictly scoped to your authenticated account ID using JSON Web Tokens (JWT) or secure HTTP-only cookies. Cross-user access is blocked at the REST controller level. You can permanently delete your account and all associated logs, routines, and meals at any time via the Settings page.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-emerald-600" />
              4. Third-Party Sharing
            </h2>
            <p className="text-sm leading-relaxed">
              FitMate AI does not sell, license, or monetize your personal health data to advertising networks or data brokers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
