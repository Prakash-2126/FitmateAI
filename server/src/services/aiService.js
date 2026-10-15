import { ENV } from '../config/env.js';

const SYSTEM_INSTRUCTION = `You are FitMate AI, an intelligent, encouraging personal fitness and wellness assistant.
Your role is to help users understand exercise techniques, design balanced workout routines, suggest healthy nutrition and meal ideas, and build consistent wellness habits.

SAFETY & COMPLIANCE GUIDELINES:
1. Provide general fitness, nutrition, and wellness guidance only.
2. NEVER diagnose, treat, or claim to cure medical conditions or injuries.
3. If the user mentions pain, acute symptoms, injury, disordered eating, or medical conditions, clearly advise consulting a certified healthcare professional, physical therapist, or registered dietitian.
4. Do not promise extreme or guaranteed weight loss, muscle gain, or rapid physiological outcomes.
5. Emphasize sustainable lifestyle habits, proper lifting form, progressive overload, adequate hydration, and recovery.
6. Keep explanations structured, actionable, and friendly with bullet points and bold headers where appropriate.`;

/**
 * Intelligent contextual fallback engine used when network is offline or API provider is unreachable.
 * Analyzes specific keywords to deliver rich, contextual, non-repetitive fitness advice.
 */
const generateIntelligentFitnessGuidance = (prompt, userContext = {}) => {
  const p = prompt.toLowerCase();

  // Experience level context snippet
  const expLevel = userContext.fitnessExperience || 'intermediate';
  const actLevel = userContext.activityLevel || 'active';

  // 1. CHEST / UPPER BODY PUSH
  if (p.includes('chest') || p.includes('bench press') || p.includes('push up') || p.includes('pec')) {
    return `### 🏋️ Chest Development & Push Form Guide (${expLevel} level)

Here are the most effective principles and movements to stimulate chest hypertrophy and strength:

* **Primary Compound Movement**: Flat Barbell or Heavy Dumbbell Bench Press (3-4 sets of 6-10 reps). Focus on retracting and depressing your scapula, keeping a slight arch in your lower back, and lowering the weight with control (2-3 seconds).
* **Upper Chest (Clavicular Head)**: 30° Incline Dumbbell Press (3 sets of 8-12 reps). Avoid setting the incline too high (>45°) which shifts tension onto the anterior deltoids.
* **Isolation / Stretch**: Cable Pec Flyes or Incline Dumbbell Flyes (3 sets of 12-15 reps). Focus on squeezing at peak contraction and controlling the deep stretch.
* **Bodyweight Finisher**: Push-ups or Weighted Dips (2-3 sets to near failure, leaving 1 rep in reserve).

*Tip: For optimal growth, allow 48-72 hours between intense chest training sessions.*`;
  }

  // 2. BACK / PULL / LATS
  if (p.includes('back') || p.includes('pull') || p.includes('lat') || p.includes('row') || p.includes('pullup') || p.includes('chin up') || p.includes('deadlift')) {
    return `### 🧗 Back Width & Thickness Training Guide

A well-developed back provides upper-body posture, spine stability, and athletic shape:

* **Vertical Pull (Width)**: Wide-Grip Lat Pulldown or Weighted Pull-ups (3-4 sets of 8-10 reps). Drive with your elbows toward your hips rather than pulling with your forearms.
* **Horizontal Row (Thickness)**: Barbell Bent-Over Row or Chest-Supported Dumbbell Row (3-4 sets of 8-10 reps). Pause for 1 second at full contraction to recruit the rhomboids and mid-traps.
* **Lower Back & Posterior Chain**: Romanian Deadlifts or Conventional Deadlifts (3 sets of 6-8 reps with strict neutral spine mechanics).
* **Upper Back & Rear Delts**: Face Pulls (3 sets of 15-20 reps) with external shoulder rotation for posture and rotator cuff health.

*Form Note: Avoid excessive momentum or swinging. Mind-muscle connection on back exercises is vital.*`;
  }

  // 3. LEGS / LOWER BODY
  if (p.includes('leg') || p.includes('squat') || p.includes('quad') || p.includes('hamstring') || p.includes('glute') || p.includes('calf') || p.includes('lunges')) {
    return `### 🦵 Lower Body Strength & Hypertrophy Split

Building strong legs provides functional mobility, metabolism acceleration, and athletic power:

* **Quad Dominant Compound**: Barbell Back Squat or Front Squat (3-4 sets of 6-8 reps). Maintain foot tripod pressure (heel, big toe, pinky toe) and hit at least parallel depth if mobility permits.
* **Posterior Chain (Hamstrings & Glutes)**: Romanian Deadlifts (3 sets of 8-10 reps) focusing on hip hinge without bending your lower spine.
* **Unilateral Balance**: Bulgarian Split Squats or Walking Dumbbell Lunges (3 sets of 10-12 reps per leg) to fix strength imbalances.
* **Calves & Accessories**: Standing Calf Raises (4 sets of 12-15 reps with a 2-second stretch at the bottom).

*Recovery Reminder: Lower body workouts produce significant systemic fatigue. Prioritize post-session protein and quality sleep.*`;
  }

  // 4. SHOULDERS & ARMS
  if (p.includes('shoulder') || p.includes('arm') || p.includes('bicep') || p.includes('tricep') || p.includes('delt') || p.includes('press') || p.includes('curl') || p.includes('dip')) {
    return `### 💪 Shoulder & Arm Hypertrophy Protocol

For complete upper limb development, balance all three heads of the deltoid and both arm compartments:

* **Shoulder Overhead Press**: Standing Overhead Barbell Press or Seated Dumbbell Press (3 sets of 6-8 reps). Brace your core and avoid hyperextending your lower back.
* **Side Delts (Shoulder Width)**: Cable or Dumbbell Lateral Raises (4 sets of 12-15 reps). Keep a slight forward lean and lead with your elbows.
* **Triceps (Long & Lateral Heads)**: Close-Grip Bench Press or Cable Rope Tricep Pushdowns (3 sets of 10-12 reps) paired with Overhead Tricep Extensions.
* **Biceps**: Incline Dumbbell Bicep Curls (3 sets of 10-12 reps) for deep stretch, followed by Hammer Curls (3 sets of 10-12 reps) for brachialis and forearm thickness.

*Execution Tip: Keep your elbows pinned during curls to prevent front delts from taking over the lift.*`;
  }

  // 5. CORE / ABS
  if (p.includes('abs') || p.includes('core') || p.includes('six pack') || p.includes('plank') || p.includes('belly')) {
    return `### 🛡️ Functional Core Strength & Abdominal Definition

A strong core stabilizes your spine during heavy lifts and everyday movements:

* **Anti-Extension**: Hanging Knee or Leg Raises (3 sets of 12-15 reps) curling your pelvis up towards your ribs, plus 60-second RKC Planks.
* **Rotational & Anti-Rotation**: Pallof Press (3 sets of 12 reps per side) and Cable Woodchoppers to develop the obliques and transverse abdominis.
* **Flexion Under Tension**: Cable Crunches (3 sets of 12-15 reps) with controlled spinal flexion and eccentric pause.
* **Key Reality on "Six Packs"**: Abdominal definition is primarily a function of overall body fat percentage. Targeted exercises strengthen the muscle wall, while caloric balance reveals definition.`;
  }

  // 6. NUTRITION / PROTEIN / MEALS / CALORIES
  if (p.includes('diet') || p.includes('protein') || p.includes('meal') || p.includes('calorie') || p.includes('nutrition') || p.includes('food') || p.includes('eat') || p.includes('carb') || p.includes('macro')) {
    return `### 🥗 Nutrition & Macronutrient Strategy

Evidence-based guidelines for energy, muscle repair, and body composition:

* **Daily Protein Target**: Aim for **1.6 to 2.2 grams per kilogram of body weight** (approx. 0.8 to 1.0g per lb). Distribute protein across 3-4 meals (25-45g per meal) to maximize muscle protein synthesis.
* **Nutrient-Dense Protein Sources**:
  - *Poultry & Fish*: Chicken breast, turkey, wild salmon, tuna, white fish.
  - *Dairy & Eggs*: Whole eggs, egg whites, Greek yogurt, cottage cheese.
  - *Plant-Based*: Tofu, tempeh, lentils, edamame, chickpeas, seitan, high-protein plant milks.
* **Pre-Workout Fuel (1-2 hours prior)**: Easily digestible carbohydrates (oatmeal, bananas, rice cakes) with a moderate protein source.
* **Post-Workout Recovery (within 2 hours)**: Balanced meal with 30g+ protein and complex carbs (sweet potatoes, brown rice, quinoa) to replenish glycogen.
* **Daily Hydration**: Drink 35-40 ml of water per kg of body weight (approx. 2.5 - 3.5 liters daily).`;
  }

  // 7. FAT LOSS / CUTTING / DEFICIT
  if (p.includes('fat loss') || p.includes('lose weight') || p.includes('cut') || p.includes('deficit') || p.includes('burn fat') || p.includes('lean')) {
    return `### 📉 Sustainable Fat Loss Blueprint

To shed body fat while preserving lean muscle mass and metabolic rate:

* **Moderate Caloric Deficit**: Create a 300-500 kcal daily deficit beneath your Total Daily Energy Expenditure (TDEE). This produces safe, sustainable fat loss of 0.5 to 1.0 kg per week.
* **Keep Protein High**: Elevate protein to 2.0-2.4 g/kg body weight to spare lean muscle tissue in a deficit and boost satiety.
* **Prioritize Resistance Training**: Keep lifting heavy compound exercises (3-4 days/week). This signals your body to retain muscle and burn fat for energy.
* **Daily NEAT (Non-Exercise Activity)**: Aim for 8,000 to 10,000 daily steps. Walking is low-stress cardio that burns calories without causing excessive hunger or muscle breakdown.
* **Sleep & Stress**: Chronically elevated cortisol from <7 hours sleep makes fat loss significantly harder. Prioritize rest.`;
  }

  // 8. MUSCLE GAIN / BULKING / HYPERTROPHY
  if (p.includes('muscle') || p.includes('bulk') || p.includes('hypertrophy') || p.includes('mass') || p.includes('gain weight') || p.includes('size')) {
    return `### 🚀 Lean Hypertrophy & Muscle Building Guide

Building new muscle tissue requires mechanical tension, progressive overload, and energy surplus:

* **Slight Caloric Surplus**: Eat 250-400 calories above maintenance. This minimizes excess fat gain while providing necessary raw materials for muscle growth.
* **Progressive Overload Rule**: Track every workout in FitMate AI! Strive to add 1 repetition or 1-2.5 kg to your lifts each week while maintaining strict form.
* **Volume Guidelines**: Aim for 10-20 challenging sets per muscle group per week, split across 2 sessions (e.g. Upper/Lower or Push/Pull/Legs).
* **Train Close to Failure**: Most working sets should end 1-2 reps shy of muscular failure (RPE 8-9).
* **Sleep 8 Hours**: Peak human growth hormone and muscle tissue repair occur during deep slow-wave sleep.`;
  }

  // 9. PAIN / INJURY / FORM (Safety First)
  if (p.includes('pain') || p.includes('hurt') || p.includes('injury') || p.includes('knee') || p.includes('joint') || p.includes('shoulder pain') || p.includes('back pain')) {
    return `### ⚠️ Form Check & Joint Health Advisory

*Medical Notice: As an AI fitness assistant, I cannot diagnose or treat injuries. If you experience acute, sharp, radiating pain or joint swelling, please see a qualified physician or physical therapist.*

**General preventative cues for joint discomfort:**
* **Never lift through sharp joint pain**: Substitute movements that irritate the joint (e.g., replace barbell bench with neutral-grip dumbbell press; replace barbell back squats with box squats or leg press).
* **Warm-up Thoroughly**: Spend 5-8 minutes on dynamic mobility (arm circles, hip 90/90s, bodyweight lunges) and do 2-3 warm-up sets with light weight.
* **Examine Biomechanics**: Knee pain during squats often stems from ankles caving or knees collapsing inward (valgus collapse). Keep knees tracking in line with your 2nd and 3rd toes.
* **Deload & Recovery**: Joint discomfort is often an early sign of systemic tendon fatigue. Consider a 1-week deload with 50% normal volume.`;
  }

  // 10. SUPPLEMENTS / CREATINE / PRE-WORKOUT
  if (p.includes('supplement') || p.includes('creatine') || p.includes('whey') || p.includes('pre workout') || p.includes('caffeine') || p.includes('bcaa')) {
    return `### 💊 Fitness Supplement Evidence Breakdown

Most training results come from real food, hard training, and sleep. Here is what science supports:

* **Creatine Monohydrate (Tier 1)**: 3-5 grams daily consistently. Increases intramuscular phosphocreatine stores, boosting strength, power output, and intracellular hydration. No loading phase necessary.
* **Whey / Plant Protein Powder (Convenience)**: Useful for meeting your daily 1.6-2.2g/kg protein target when whole food meals are impractical.
* **Caffeine / Pre-Workout (Performance)**: 150-300mg taken 30-45 minutes before training increases alertness, power, and reduces perceived exertion. Avoid consuming within 6-8 hours of bedtime.
* **Vitamin D3 & Omega-3 Fish Oil**: Supports bone density, immune response, and joint inflammation management.
* **Skip BCAA Supplements**: If you already eat adequate whole-food protein, BCAAs provide zero added benefit.`;
  }

  // 11. WORKOUT SPLIT / ROUTINE
  if (p.includes('routine') || p.includes('split') || p.includes('schedule') || p.includes('program') || p.includes('plan')) {
    return `### 📅 Recommended Training Splits by Frequency

Choose the routine that best matches your weekly availability:

* **3 Days / Week (Full Body)**:
  - Monday: Full Body A (Squat, Bench Press, Barbell Row, Overhead Press, Biceps)
  - Wednesday: Full Body B (Deadlift, Incline Dumbbell Press, Lat Pulldown, Lunges, Triceps)
  - Friday: Full Body C (Leg Press, Dips, Cable Row, Lateral Raises, Core)
* **4 Days / Week (Upper / Lower)**:
  - Mon & Thu: Upper Body (Chest, Back, Shoulders, Arms)
  - Tue & Fri: Lower Body & Core (Quads, Hamstrings, Glutes, Calves, Abs)
* **5-6 Days / Week (Push / Pull / Legs)**:
  - Push: Chest, Anterior/Lateral Delts, Triceps
  - Pull: Back, Rear Delts, Biceps, Traps
  - Legs: Quads, Hamstrings, Glutes, Calves

*Consistency Rule: The best training split is the one you can stick to week after week without missing sessions.*`;
  }

  // 12. DEFAULT CONTEXTUAL ADVISOR
  return `### 💡 FitMate AI Personalized Training Guidance

Thank you for your question! Here are targeted recommendations tailored to your fitness journey:

* **Actionable Step**: Keep your training structured by recording every set, rep, and weight inside FitMate AI's workout tracker.
* **The 80/20 Rule**: 80% of your progress comes from mastering foundational compound lifts (Squat, Press, Pull, Hinge) combined with hitting daily protein targets and sleeping 7-9 hours.
* **Progressive Adaptation**: Aim to advance one metric each week—whether that is 1 more repetition, a 2% weight increase, or tighter form and controlled tempo.
* **Nutrition Alignment**: Match your daily calorie intake to your primary objective (a slight surplus for muscle growth, or a moderate deficit for fat loss).

*Feel free to ask for specific exercise modifications, calorie/macro breakdowns, or customized workout routines!*`;
};

/**
 * Main entry point for AI responses.
 * Tries configured provider (Gemini / OpenAI), with multi-model fallback and intelligent guidance.
 */
export const getAIResponse = async (userMessage, conversationHistory = [], userContext = {}) => {
  const apiKey = ENV.AI_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    return {
      isConfigured: false,
      message:
        'AI Assistant integration is currently unconfigured. To enable live AI intelligence, please set a valid AI_API_KEY in the server .env configuration file. In the meantime, you can explore the exercise library, log meals, and schedule your workout routines!',
    };
  }

  // Attempt live API provider with graceful fallback
  try {
    if (ENV.AI_PROVIDER === 'openai') {
      return await callOpenAI(apiKey, userMessage, conversationHistory, userContext);
    } else {
      // Default to Google Gemini with multi-model resilience
      return await callGeminiAPI(apiKey, userMessage, conversationHistory, userContext);
    }
  } catch (apiErr) {
    console.warn('[AI Service] Provider request failed, using intelligent guidance engine:', apiErr.message);
    return {
      isConfigured: true,
      message: generateIntelligentFitnessGuidance(userMessage, userContext),
    };
  }
};

/**
 * Formats message history specifically to satisfy Google Gemini's strict multi-turn requirements:
 * 1. Must alternate strictly: 'user' <-> 'model'
 * 2. First turn MUST be 'user'
 * 3. Last turn before the new user message MUST be 'model' (or empty)
 */
const buildGeminiContents = (history, userMessage, userContext) => {
  let contextSnippet = '';
  if (userContext.fitnessExperience || userContext.activityLevel) {
    contextSnippet = `\n[User Profile Context: Experience: ${userContext.fitnessExperience || 'Beginner'}, Activity Level: ${userContext.activityLevel || 'Moderate'}]`;
  }

  const sanitizedTurns = [];
  const recentHistory = (history || []).slice(-8);

  for (const msg of recentHistory) {
    if (!msg.content || !msg.content.trim()) continue;
    const role = msg.role === 'assistant' ? 'model' : 'user';

    if (sanitizedTurns.length === 0) {
      // First turn MUST be 'user'
      if (role === 'user') {
        sanitizedTurns.push({ role: 'user', parts: [{ text: msg.content.trim() }] });
      }
    } else {
      const lastTurn = sanitizedTurns[sanitizedTurns.length - 1];
      if (lastTurn.role !== role) {
        sanitizedTurns.push({ role, parts: [{ text: msg.content.trim() }] });
      } else {
        // If same role, merge text to maintain alternating turns
        lastTurn.parts[0].text += `\n\n${msg.content.trim()}`;
      }
    }
  }

  // If the last sanitized turn was 'user', drop it so the new userMessage can be the final 'user' turn
  if (sanitizedTurns.length > 0 && sanitizedTurns[sanitizedTurns.length - 1].role === 'user') {
    sanitizedTurns.pop();
  }

  // Append the current user message with context
  sanitizedTurns.push({
    role: 'user',
    parts: [{ text: `${userMessage.trim()}${contextSnippet}` }],
  });

  return sanitizedTurns;
};

/**
 * Call Google Gemini API with multi-model fallback.
 * Tries candidate models in sequence (e.g. gemini-3.5-flash-lite, gemini-3-flash-preview, gemini-3.8-flash, gemini-2.5-flash-lite).
 */
const callGeminiAPI = async (apiKey, userMessage, history, userContext) => {
  const candidateModels = [
    ENV.AI_MODEL,
    'gemini-3.5-flash-lite',
    'gemini-3-flash-preview',
    'gemini-3.8-flash',
    'gemini-2.5-flash-lite',
  ].filter(Boolean);

  // De-duplicate
  const uniqueModels = [...new Set(candidateModels)];
  const contents = buildGeminiContents(history, userMessage, userContext);

  const body = {
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 900,
    },
  };

  let lastError = null;

  for (const model of uniqueModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
        console.warn(`[Gemini API] Model ${model} returned error: ${errorMsg}. Trying next model...`);
        lastError = new Error(errorMsg);
        continue; // Try next model
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text || !text.trim()) {
        console.warn(`[Gemini API] Model ${model} returned empty content. Trying next model...`);
        lastError = new Error('Empty response from model');
        continue;
      }

      return {
        isConfigured: true,
        message: text.trim(),
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.warn(`[Gemini API] Model ${model} timed out. Trying next candidate...`);
        lastError = new Error('Request timed out');
      } else {
        console.warn(`[Gemini API] Request failed for model ${model}:`, err.message);
        lastError = err;
      }
    }
  }

  // If all models failed, throw the last error so fallback guidance engine handles it
  throw lastError || new Error('All candidate Gemini models failed to respond.');
};

/**
 * Call OpenAI API if configured as provider
 */
const callOpenAI = async (apiKey, userMessage, history, userContext) => {
  const model = ENV.AI_MODEL || 'gpt-3.5-turbo';
  const url = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    { role: 'system', content: SYSTEM_INSTRUCTION },
    ...(history || []).slice(-6).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 900,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error('Received empty response from OpenAI');
    }

    return {
      isConfigured: true,
      message: text.trim(),
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};
