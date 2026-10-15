import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Bot,
  Utensils,
  Dumbbell,
  LineChart,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Heart,
  TrendingUp,
  Target,
  ChevronRight,
  Clock,
  Play,
  Star,
} from 'lucide-react';

/* ─── Floating Particle ───────────────────────────────── */
const Particle = ({ style }) => (
  <div
    className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/60 pointer-events-none"
    style={style}
  />
);

/* ─── Decorative Orb ──────────────────────────────────── */
const Orb = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
);

/* ─── Section Title ───────────────────────────────────── */
const SectionBadge = ({ children }) => (
  <span className="inline-block text-xs font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 mb-4 reveal">
    {children}
  </span>
);

/* ─── Feature Card ────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, link, linkLabel, delay }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal card-shine group p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-2xl transition-all duration-500 flex flex-col"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-400">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">{desc}</p>
      <Link to={link} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline-grow w-fit">
        <span>{linkLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
      </Link>
    </div>
  );
};

/* ─── Step Card ───────────────────────────────────────── */
const StepCard = ({ num, title, desc, delay }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal card-shine group bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300/70 transition-all duration-500 relative overflow-hidden"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Big background number */}
      <div className="absolute -right-3 -top-3 text-[90px] font-black text-slate-100 select-none leading-none group-hover:text-emerald-50 transition-colors">
        {num}
      </div>
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg mb-6 shadow-md shadow-emerald-600/30 group-hover:scale-110 group-hover:shadow-emerald-600/50 transition-all duration-300">
          {num}
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{title}</h4>
        <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

/* ─── Benefit Item ────────────────────────────────────── */
const BenefitItem = ({ icon: Icon, text, delay }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal flex items-center gap-3 group" style={{ transitionDelay: `${delay}ms` }}>
      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{text}</span>
    </div>
  );
};

/* ─── Main Home Component ─────────────────────────────── */
export const Home = () => {
  // Particles for hero
  const particles = Array.from({ length: 18 }, (_, i) => ({
    style: {
      top: `${Math.random() * 85}%`,
      left: `${Math.random() * 100}%`,
      width: `${4 + Math.random() * 6}px`,
      height: `${4 + Math.random() * 6}px`,
      animation: `particleFloat ${3 + Math.random() * 4}s ${Math.random() * 3}s ease-in infinite`,
      opacity: 0.4 + Math.random() * 0.4,
    },
  }));

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/* ═══════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative pt-14 pb-24 sm:pt-24 sm:pb-36 bg-slate-900 text-white overflow-hidden">
        {/* Ambient orbs */}
        <Orb className="w-[600px] h-[600px] -top-48 left-1/2 -translate-x-1/4 bg-emerald-500/15 animate-float-slow" />
        <Orb className="w-[400px] h-[400px] top-1/3 -right-20 bg-teal-500/12 animate-float-y-delay" />
        <Orb className="w-[300px] h-[300px] -bottom-20 left-1/4 bg-emerald-600/10 animate-float-y" />

        {/* Floating particles */}
        {particles.map((p, i) => <Particle key={i} style={p.style} />)}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">

            {/* Announcement pill */}
            <div className="animate-fade-down inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md hover:bg-emerald-500/20 transition-colors cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Next-Gen MERN Fitness Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 font-normal">v2.0 Active</span>
            </div>

            {/* Hero Title */}
            <h1 className="animate-fade-up text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6">
              Your Personal{' '}
              <span className="hero-gradient-text">
                AI Fitness
              </span>{' '}
              Companion
            </h1>

            <p className="animate-fade-up-d1 text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
              Take the guesswork out of progress. Build custom workout splits, track nutrition macros, and consult your dedicated AI fitness coach — all in one platform.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-d2 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/register"
                className="btn-magnetic w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-emerald-500/35 hover:shadow-emerald-500/55 transition-all duration-300 text-sm sm:text-base glow-pulse"
              >
                <span>Start Training Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold rounded-2xl border border-slate-700/80 backdrop-blur-md transition-all text-sm sm:text-base hover:border-emerald-500/40 hover:scale-[1.02]"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Explore Features</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Trust stats */}
            <div className="animate-fade-up-d3 grid grid-cols-3 gap-6 pt-10 border-t border-slate-800/80 max-w-xl mx-auto text-center">
              {[
                { val: '100%', label: 'Real Data Tracking' },
                { val: 'Gemini AI', label: 'Contextual Coach', color: 'text-emerald-400' },
                { val: 'Full-Stack', label: 'MERN Architecture' },
              ].map((s, i) => (
                <div key={i} className="group cursor-default">
                  <div className={`text-2xl sm:text-3xl font-extrabold ${s.color || 'text-white'} group-hover:scale-110 transition-transform inline-block`}>{s.val}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating mockup dashboard card */}
          <div className="mt-20 max-w-4xl mx-auto relative animate-float">
            {/* Decorative rings */}
            <div className="absolute -inset-4 rounded-[2.5rem] border border-emerald-500/10 animate-pulse" />
            <div className="absolute -inset-8 rounded-[3rem] border border-emerald-500/05" />

            <div className="rounded-3xl p-1 bg-gradient-to-b from-emerald-500/30 via-slate-700/40 to-slate-900 shadow-2xl">
              <div className="bg-slate-900/92 rounded-[22px] p-6 sm:p-8 backdrop-blur-xl border border-slate-800 text-left">
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 transition-colors cursor-default" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 transition-colors cursor-default" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors cursor-default" />
                    <span className="text-xs font-semibold text-slate-400 ml-2 hidden sm:inline">
                      FitMate AI • Live Interactive Dashboard
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Session
                  </span>
                </div>

                {/* Mockup Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Card: Workout */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400 text-[10px]">
                        <Dumbbell className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> Scheduled Session
                      </span>
                      <span>45 mins</span>
                    </div>
                    <div className="text-base font-bold text-white mb-1">Upper Body Hypertrophy</div>
                    <p className="text-xs text-slate-400 mb-3">4 Exercises • Bench, Rows, Press</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                      In Progress
                    </span>
                  </div>

                  {/* Card: Diet */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 cursor-default">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400 text-[10px]">
                        <Flame className="w-3.5 h-3.5 animate-pulse" /> Daily Nutrition
                      </span>
                      <span>1,850 kcal</span>
                    </div>
                    <div className="text-base font-bold text-white mb-2">Target: 2,200 kcal</div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                      <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full w-[84%] progress-animated rounded-full" />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Protein: 142g</span>
                      <span>Carbs: 185g</span>
                    </div>
                  </div>

                  {/* Card: AI Coach */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-default">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400 text-[10px] mb-2">
                        <Bot className="w-3.5 h-3.5 animate-bounce-subtle" /> AI Coach Voice
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "Great consistency! You've completed 4 workouts this week. Consider prioritizing rest and hydration tomorrow."
                      </p>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-pulse" /> Ready to assist 24/7
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES SECTION ═══════════════════ */}
      <section className="py-28 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
        <Orb className="w-[500px] h-[500px] -top-40 -right-40 bg-emerald-50 opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <SectionBadge>Complete Capabilities</SectionBadge>
            <h2 className="reveal text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
              Designed For Real<br />Athletic Progression
            </h2>
            <p className="reveal reveal-delay-1 text-slate-600 text-base sm:text-lg leading-relaxed">
              Everything you need to plan, track, and optimize your fitness journey in one seamless system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Utensils}
              title="Diet & Nutrition"
              desc="Log meals by category with authentic calorie and macronutrient tracking. No fabricated nutrition entries."
              link="/diet"
              linkLabel="Explore Meals"
              delay={0}
            />
            <FeatureCard
              icon={Dumbbell}
              title="Workout Planner"
              desc="Assemble routines from 30+ exercises. Customize sets, target loads, rest intervals, and sequence order."
              link="/workouts"
              linkLabel="View Routines"
              delay={80}
            />
            <FeatureCard
              icon={LineChart}
              title="Analytics & Progress"
              desc="Interactive charts tracking training volume, session duration, and calorie trends over 7, 30, and 90 days."
              link="/progress"
              linkLabel="See Analytics"
              delay={160}
            />
            <FeatureCard
              icon={Bot}
              title="FitMate AI Coach"
              desc="Google Gemini integration with safety guardrails. Ask about workout splits, recovery, and nutrition recipes."
              link="/ai-assistant"
              linkLabel="Chat with Coach"
              delay={240}
            />
          </div>

          {/* Extra feature row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <FeatureCard
              icon={Calendar}
              title="Smart Scheduling"
              desc="Plan your training calendar with visual scheduling, set recurring sessions, and get reminder alerts."
              link="/schedule"
              linkLabel="Open Calendar"
              delay={0}
            />
            <FeatureCard
              icon={Target}
              title="Fitness Goals"
              desc="Set measurable targets — workout frequency, weight milestones, or consistency streaks — and watch progress auto-calculate."
              link="/goals"
              linkLabel="Set Goals"
              delay={80}
            />
            <FeatureCard
              icon={Sparkles}
              title="Smart Recommendations"
              desc="Personalized, rule-based insights that adapt to your logged data, helping you optimize your next training block."
              link="/recommendations"
              linkLabel="View Insights"
              delay={160}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS BANNER ════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/30 via-transparent to-teal-600/30 animate-gradient-pan bg-[length:200%_200%]" />
        {/* Mesh lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {[
              { val: '30+', label: 'Gym Exercises', icon: Dumbbell },
              { val: '14+', label: 'Healthy Recipes', icon: Utensils },
              { val: 'Gemini', label: 'AI Powered', icon: Bot },
              { val: 'MERN', label: 'Full Stack App', icon: Zap },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="reveal group cursor-default" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black counter-animate">{s.val}</div>
                  <div className="text-sm text-emerald-100 font-medium mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ════════════════════════ */}
      <section className="py-28 bg-slate-50 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] -bottom-40 -left-20 bg-emerald-100/60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge>Seamless 3-Step Journey</SectionBadge>
            <h2 className="reveal text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How FitMate AI Transforms<br />Your Habits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              num={1}
              title="Set Your Profile & Targets"
              desc="Add height, weight, activity tiers, and custom targets like completing 4 workouts weekly."
              delay={0}
            />
            <StepCard
              num={2}
              title="Execute & Record Activities"
              desc="Schedule routines on the calendar, log meals, and record completed reps, sets, and active minutes."
              delay={120}
            />
            <StepCard
              num={3}
              title="Leverage Smart AI Insights"
              desc="Receive rule-based recommendations and chat with the AI Coach anytime for guidance tailored to your experience."
              delay={240}
            />
          </div>

          {/* Connector arrows (desktop) */}
          <div className="hidden md:flex items-center justify-center gap-0 mt-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══════════════ BENEFITS ════════════════════════════ */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: content */}
            <div>
              <SectionBadge>Why FitMate AI</SectionBadge>
              <h2 className="reveal text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight">
                Everything You Need,<br />Nothing You Don't
              </h2>
              <p className="reveal reveal-delay-1 text-slate-600 leading-relaxed mb-8">
                Built with the MERN stack — real data, real APIs, real results. No fabricated metrics, no fake exercise entries. Just a solid full-stack fitness platform backed by Gemini AI.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: CheckCircle2, text: 'Real MongoDB data persistence' },
                  { icon: ShieldCheck, text: 'Secure JWT authentication' },
                  { icon: Bot, text: 'Live Gemini AI coaching' },
                  { icon: TrendingUp, text: 'Interactive Recharts analytics' },
                  { icon: Calendar, text: 'Full workout scheduling' },
                  { icon: Utensils, text: 'Complete nutrition tracking' },
                  { icon: Target, text: 'Goal setting & tracking' },
                  { icon: Award, text: 'Progress streak badges' },
                ].map((b, i) => (
                  <BenefitItem key={i} icon={b.icon} text={b.text} delay={i * 60} />
                ))}
              </div>
            </div>

            {/* Right: animated visual */}
            <div className="reveal-right relative">
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-8 border border-slate-800 shadow-2xl">
                {/* Glows */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-teal-500/15 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Weekly Progress</div>
                      <div className="text-xs text-emerald-400">↑ 23% from last week</div>
                    </div>
                  </div>

                  {/* Mini bar chart */}
                  <div className="flex items-end gap-2 h-24 mb-6">
                    {[35, 60, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 flex items-end">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-emerald-700 to-emerald-400 transition-all duration-700 hover:from-emerald-600 hover:to-teal-300"
                          style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 mb-6">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  {/* Macro pills */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Protein', val: '142g', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                      { label: 'Carbs', val: '185g', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
                      { label: 'Fat', val: '58g', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
                    ].map(m => (
                      <div key={m.label} className={`p-2 rounded-xl border text-center ${m.color}`}>
                        <div className="text-xs font-bold">{m.val}</div>
                        <div className="text-[10px] opacity-70">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-6 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-200/80 animate-float-y flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Star className="w-4 h-4 fill-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">AI-Powered</div>
                  <div className="text-[10px] text-slate-500">Gemini Coach Active</div>
                </div>
              </div>

              {/* Floating workout badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-200/80 animate-float-y-delay flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">4 Workouts</div>
                  <div className="text-[10px] text-slate-500">Completed this week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═════════════════════════ */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-teal-600/15 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="reveal w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 animate-heartbeat">
            <Activity className="w-8 h-8" />
          </div>

          <h2 className="reveal reveal-delay-1 text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
            Ready to Take Control of<br />
            <span className="hero-gradient-text">Your Fitness?</span>
          </h2>

          <p className="reveal reveal-delay-2 text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Create your account today. Log meals, schedule workouts, and experience personalized AI fitness guidance built with precision.
          </p>

          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-magnetic w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/30 transition-all text-sm sm:text-base"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-sm sm:text-base"
            >
              Sign In
            </Link>
          </div>

          {/* Wave rings on the CTA button area */}
          <div className="mt-12 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full border border-emerald-500/20 wave-ring" />
              <div className="absolute w-20 h-20 rounded-full border border-emerald-500/15 wave-ring-delay" />
              <div className="absolute w-20 h-20 rounded-full border border-emerald-500/10 wave-ring-delay2" />
              <Heart className="w-6 h-6 text-emerald-500 relative z-10 animate-heartbeat" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
