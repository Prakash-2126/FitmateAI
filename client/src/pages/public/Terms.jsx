import React from 'react';
import { FileText, AlertTriangle, UserCheck } from 'lucide-react';

export const Terms = () => {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Legal Terms
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Terms governing your use of the FitMate AI personal fitness platform.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs space-y-8 text-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              By registering an account and utilizing FitMate AI, you agree to comply with and be bound by these terms. If you disagree with any part of these terms, please refrain from using the platform.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              2. Account Responsibilities & Security
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Users are responsible for safeguarding their login credentials and account access. You agree to provide accurate information upon registration and update your metrics to maintain relevant insights.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <h2 className="text-base font-bold mb-2 flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              3. Limitations of Fitness Guidance & Health Disclaimer
            </h2>
            <p className="text-sm leading-relaxed text-amber-800/90 mb-2">
              FitMate AI, including its automated algorithms and conversational AI features, provides general exercise, lifestyle, and dietary informational content only.
            </p>
            <p className="text-sm leading-relaxed text-amber-800/90">
              The platform is not a licensed medical provider and does not give clinical health advice. Exercise entails inherent risks of physical injury. You must independently evaluate your physical condition and seek physician consultation before commencing any rigorous physical training.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              4. Prohibited Uses
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              You agree not to misuse the platform, attempt automated brute-forcing or unauthorized access, bypass route protection middlewares, or transmit malicious code through any input fields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
