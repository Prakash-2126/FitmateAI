import mongoose from 'mongoose';
import { Exercise } from '../models/Exercise.js';
import { ENV } from '../config/env.js';

export const initialExercises = [
  // ==================== CHEST ====================
  {
    name: 'Barbell Bench Press',
    category: 'Strength',
    description: 'The premier compound barbell lift for developing upper body pushing strength, pectoralis mass, and anterior deltoids.',
    muscleGroup: 'Chest',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    youtubeId: 'rT7DgCr-3pg',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    thumbnailUrl: 'https://img.youtube.com/vi/rT7DgCr-3pg/hqdefault.jpg',
    videoTitle: 'How To: Barbell Bench Press (Proper Form)',
    instructions: [
      'Lie flat on the bench with eyes directly under the racked bar. Retract shoulder blades firmly into the bench pad.',
      'Grip the bar slightly wider than shoulder-width with a secure, full grip.',
      'Unrack the bar, stabilize over sternum, and slowly lower to the mid-chest with elbows tucked at roughly 45 degrees.',
      'Touch chest lightly without bouncing, then press explosively upward to the starting position without unlocking shoulder blades.'
    ]
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'Strength',
    description: 'Emphasizes the upper clavicular head of the pectoralis major and anterior deltoids with free range of motion.',
    muscleGroup: 'Chest',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    youtubeId: '8iPEnn-ltC8',
    videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    thumbnailUrl: 'https://img.youtube.com/vi/8iPEnn-ltC8/hqdefault.jpg',
    videoTitle: 'How To: Dumbbell Incline Chest Press',
    instructions: [
      'Set an adjustable bench to an incline between 30 and 45 degrees.',
      'Kick dumbbells up to shoulder height using your knees as you lean back onto the pad.',
      'Press the dumbbells upward in a converging arc until arms are extended overhead.',
      'Lower the dumbbells under strict control for 2-3 seconds until you feel a deep stretch in the upper chest.'
    ]
  },
  {
    name: 'High Cable Chest Fly',
    category: 'Strength',
    description: 'Provides constant mechanical tension throughout both the stretched and fully contracted phases of the pec fibers.',
    muscleGroup: 'Chest',
    equipment: 'Cable',
    difficulty: 'Beginner',
    youtubeId: 'Iwe6AmxVf7o',
    videoUrl: 'https://www.youtube.com/watch?v=Iwe6AmxVf7o',
    thumbnailUrl: 'https://img.youtube.com/vi/Iwe6AmxVf7o/hqdefault.jpg',
    videoTitle: 'How To: High Cable Chest Fly (Pec Fly)',
    instructions: [
      'Attach D-handles to the high pulleys of a dual-cable station.',
      'Grasp handles, step forward into a staggered stance, and lean torso slightly forward with core braced.',
      'With elbows slightly bent and fixed, bring your hands together in a downward hugging arc until knuckles meet.',
      'Squeeze chest hard for 1 second, then allow cables to pull hands back into a deep, controlled stretch.'
    ]
  },
  {
    name: 'Parallel Bar Chest Dips',
    category: 'Bodyweight',
    description: 'Advanced compound bodyweight movement delivering intense lower pec stimulation and tricep recruitment.',
    muscleGroup: 'Chest',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    youtubeId: '2z8JmcrW-As',
    videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    thumbnailUrl: 'https://img.youtube.com/vi/2z8JmcrW-As/hqdefault.jpg',
    videoTitle: 'The Perfect Dip - Form & Chest Activation',
    instructions: [
      'Mount the parallel dip bars and support your body with straight arms.',
      'Lean your torso forward at roughly 30 degrees and flare elbows slightly to bias the chest over triceps.',
      'Lower your body until your shoulders are slightly below your elbows or you feel a comfortable chest stretch.',
      'Drive powerfully through your palms back to the top position, maintaining the forward torso lean.'
    ]
  },
  {
    name: 'Push-Up',
    category: 'Bodyweight',
    description: 'Fundamental horizontal pressing movement building chest, anterior shoulder, and core endurance.',
    muscleGroup: 'Chest',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    youtubeId: 'IODxDxX7oi4',
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    thumbnailUrl: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg',
    videoTitle: 'The Perfect Push Up - Complete Form Breakdown',
    instructions: [
      'Place hands slightly wider than shoulder-width on the floor in a rigid high plank posture.',
      'Squeeze glutes and brace your abs to prevent sagging of the lower back.',
      'Lower chest towards the floor until elbows reach 90 degrees or chest is an inch from the ground.',
      'Press the floor away firmly to return to the starting position.'
    ]
  },

  // ==================== BACK ====================
  {
    name: 'Barbell Deadlift',
    category: 'Strength',
    description: 'The king of posterior chain movements strengthening lats, erector spinae, traps, glutes, and hamstrings.',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    difficulty: 'Advanced',
    youtubeId: 'op9kVnSso6Q',
    videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    thumbnailUrl: 'https://img.youtube.com/vi/op9kVnSso6Q/hqdefault.jpg',
    videoTitle: 'How To Deadlift - Proper Technique & Safety',
    instructions: [
      'Stand with feet hip-width apart with the barbell positioned over mid-foot (1 inch from shins).',
      'Hinge at hips, bend knees slightly, and grip the bar just outside of your legs.',
      'Engage lats by pulling shoulder blades down ("protect your armpits") and flatten your entire spine.',
      'Push the floor away through your heels, extending knees and hips simultaneously to stand tall.'
    ]
  },
  {
    name: 'Lat Pulldown',
    category: 'Strength',
    description: 'Essential vertical pulling movement for developing latissimus dorsi width and upper back V-taper.',
    muscleGroup: 'Back',
    equipment: 'Cable',
    difficulty: 'Beginner',
    youtubeId: 'CAwf7n6Luuc',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    thumbnailUrl: 'https://img.youtube.com/vi/CAwf7n6Luuc/hqdefault.jpg',
    videoTitle: 'How To: Lat Pulldown (3 Golden Rules)',
    instructions: [
      'Adjust thigh pads firmly against your upper legs and sit facing the cable station.',
      'Grip the bar slightly wider than shoulder-width with an overhand grip.',
      'Lean back approximately 10-15 degrees and pull the bar smoothly toward your clavicle.',
      'Focus on driving elbows straight down toward your back pockets, pause for 1 second, then control the release.'
    ]
  },
  {
    name: 'Seated Cable Row',
    category: 'Strength',
    description: 'Horizontal pull targeting mid-back thickness, rhomboids, latissimus dorsi, and rear deltoids.',
    muscleGroup: 'Back',
    equipment: 'Cable',
    difficulty: 'Beginner',
    youtubeId: 'GZbfZ033f74',
    videoUrl: 'https://www.youtube.com/watch?v=GZbfZ033f74',
    thumbnailUrl: 'https://img.youtube.com/vi/GZbfZ033f74/hqdefault.jpg',
    videoTitle: 'How To: Seated Low Cable Row',
    instructions: [
      'Sit on the bench with feet braced on footrests and knees slightly bent.',
      'Grasp the close-grip V-bar attachment with arms extended and back upright.',
      'Retract your shoulder blades and pull the handle smoothly toward your belly button.',
      'Squeeze shoulder blades together at peak contraction, then slowly extend arms forward without rounding your lower back.'
    ]
  },
  {
    name: 'Barbell Bent-Over Row',
    category: 'Strength',
    description: 'Heavy compound free-weight horizontal row building dense mid-back musculature and spinal erectors.',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    youtubeId: 'kBWAon7ItDw',
    videoUrl: 'https://www.youtube.com/watch?v=kBWAon7ItDw',
    thumbnailUrl: 'https://img.youtube.com/vi/kBWAon7ItDw/hqdefault.jpg',
    videoTitle: 'How To Properly Barbell Row For A Bigger Back',
    instructions: [
      'Stand holding a barbell with overhand grip just outside knee width.',
      'Hinge at your hips until torso is roughly 45 degrees to the floor, maintaining a neutral spine.',
      'Pull the bar upward toward your lower ribcage, driving with your elbows.',
      'Pause briefly as shoulder blades pinch together, then lower under steady control.'
    ]
  },
  {
    name: 'Single-Arm Dumbbell Row',
    category: 'Strength',
    description: 'Unilateral back exercise correcting muscular imbalances and allowing a full stretch and peak lat contraction.',
    muscleGroup: 'Back',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    youtubeId: 'pYcpY20QaE8',
    videoUrl: 'https://www.youtube.com/watch?v=pYcpY20QaE8',
    thumbnailUrl: 'https://img.youtube.com/vi/pYcpY20QaE8/hqdefault.jpg',
    videoTitle: 'How To: Dumbbell Single-Arm Bent-Over Row',
    instructions: [
      'Place one knee and one hand on a flat bench, keeping back flat and parallel to the ground.',
      'Hold a dumbbell in the opposite hand with arm hanging straight down.',
      'Pull the dumbbell upward toward your hip crease, keeping elbow tucked close to your torso.',
      'Lower the dumbbell slowly to a full stretch without twisting your torso.'
    ]
  },
  {
    name: 'Pull-Up',
    category: 'Bodyweight',
    description: 'The ultimate bodyweight upper back test for lat width, upper back thickness, and grip strength.',
    muscleGroup: 'Back',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    youtubeId: 'eGo4IYlbE5g',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    thumbnailUrl: 'https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg',
    videoTitle: 'The Perfect Pull Up - Form & Progression',
    instructions: [
      'Grip the pull-up bar with an overhand grip slightly wider than shoulder-width.',
      'Start from a dead hang with lats engaged (scapular depression).',
      'Pull your chest upward toward the bar by driving your elbows down toward the floor.',
      'Clear the bar with your chin, hold for a split second, then lower under complete control to full extension.'
    ]
  },

  // ==================== LEGS ====================
  {
    name: 'Barbell Back Squat',
    category: 'Strength',
    description: 'Foundational lower body compound lift targeting quadriceps, adductors, glutes, hamstrings, and core.',
    muscleGroup: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    youtubeId: 'bEv6CCg2BC8',
    videoUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
    thumbnailUrl: 'https://img.youtube.com/vi/bEv6CCg2BC8/hqdefault.jpg',
    videoTitle: 'How To Squat With Perfect Form (Alan Thrall)',
    instructions: [
      'Position barbell across upper traps (high bar) or rear delts (low bar), step back into shoulder-width stance with toes flared 15-30 degrees.',
      'Take a deep breath into your diaphragm, brace your core, and initiate the descent by breaking at hips and knees simultaneously.',
      'Squat down until hip crease descends slightly below the top of knees (parallel or below).',
      'Drive aggressively through mid-foot to stand back up, keeping knees tracking in line with toes.'
    ]
  },
  {
    name: 'Leg Press',
    category: 'Strength',
    description: 'Heavy quad and glute builder that isolates leg drive without placing axial load on the spine.',
    muscleGroup: 'Legs',
    equipment: 'Machine',
    difficulty: 'Beginner',
    youtubeId: 'IZxyjW7MPJQ',
    videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    thumbnailUrl: 'https://img.youtube.com/vi/IZxyjW7MPJQ/hqdefault.jpg',
    videoTitle: 'How To: Seated Incline Leg Press',
    instructions: [
      'Sit comfortably on the 45-degree sled with lower back and hips firmly pressed against the back pad.',
      'Place feet shoulder-width apart in the center of the sled platform.',
      'Release safety handles and lower the sled under control until knees reach a 90-degree angle without letting your tailbone lift.',
      'Press through heels and mid-foot back to the starting point without locking knees aggressively.'
    ]
  },
  {
    name: 'Romanian Deadlift (RDL)',
    category: 'Strength',
    description: 'Premier hip hinge exercise delivering maximum hypertrophy to hamstrings, gluteus maximus, and spinal erectors.',
    muscleGroup: 'Legs',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    youtubeId: 'JCXUYuzwNrM',
    videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
    thumbnailUrl: 'https://img.youtube.com/vi/JCXUYuzwNrM/hqdefault.jpg',
    videoTitle: 'How To: Romanian Deadlift (Hamstrings & Glutes)',
    instructions: [
      'Stand tall holding dumbbells or barbell with feet hip-width apart and knees soft with a slight 10-degree unlock.',
      'Push your hips straight backward as if trying to touch the wall behind you with your glutes.',
      'Slide weights down your shins while maintaining a rigid flat spine and chest proud.',
      'Feel the deep stretch in your hamstrings, then thrust hips forward and contract glutes to return to standing.'
    ]
  },
  {
    name: 'Leg Extension Machine',
    category: 'Strength',
    description: 'Direct quad isolation exercise delivering maximum tension at peak knee extension.',
    muscleGroup: 'Legs',
    equipment: 'Machine',
    difficulty: 'Beginner',
    youtubeId: 'm0FOpMEgero',
    videoUrl: 'https://www.youtube.com/watch?v=m0FOpMEgero',
    thumbnailUrl: 'https://img.youtube.com/vi/m0FOpMEgero/hqdefault.jpg',
    videoTitle: 'How To: Leg Extension Machine Form',
    instructions: [
      'Align knee joints directly with the machine axis pivot point.',
      'Adjust the shin pad so it rests snugly right above your ankles.',
      'Extend knees smoothly against the resistance until legs are fully straight, squeezing quads hard at the top.',
      'Lower weights slowly for 2-3 seconds to maximize eccentric quad stimulation.'
    ]
  },
  {
    name: 'Lying Hamstring Leg Curl',
    category: 'Strength',
    description: 'Isolates all three hamstring heads via knee flexion through a complete range of motion.',
    muscleGroup: 'Legs',
    equipment: 'Machine',
    difficulty: 'Beginner',
    youtubeId: '1Tq3QdYUuHs',
    videoUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
    thumbnailUrl: 'https://img.youtube.com/vi/1Tq3QdYUuHs/hqdefault.jpg',
    videoTitle: 'How To: Prone Lying Leg Curl (Hamstring Isolation)',
    instructions: [
      'Lie face down on the bench with the roller pad positioned just below your calf muscles.',
      'Grasp handles and plant hips firmly into the bench pad to avoid hyperextending your lower back.',
      'Curl the roller pad up toward your glutes by flexing your knees.',
      'Hold peak contraction for 1 second, then lower under steady control.'
    ]
  },
  {
    name: 'Bulgarian Split Squat',
    category: 'Strength',
    description: 'Unilateral leg builder addressing strength imbalances while loading quads, glutes, and hip stabilizers.',
    muscleGroup: 'Legs',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    youtubeId: '2C-uNgKwPLE',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    thumbnailUrl: 'https://img.youtube.com/vi/2C-uNgKwPLE/hqdefault.jpg',
    videoTitle: 'How To: Bulgarian Split Squat (Quad & Glute Focus)',
    instructions: [
      'Stand roughly 2 feet in front of a flat bench. Place the top of your rear foot onto the bench.',
      'Hold dumbbells at sides with tall posture and shoulders back.',
      'Descend by bending front knee until front thigh is parallel to the ground and rear knee is inches above the floor.',
      'Drive through the front heel to return to the starting position.'
    ]
  },
  {
    name: 'Standing Calf Raise',
    category: 'Strength',
    description: 'Builds gastrocnemius mass and ankle plantarflexion strength with deep eccentric stretch.',
    muscleGroup: 'Legs',
    equipment: 'Machine',
    difficulty: 'Beginner',
    youtubeId: '-M4-G8p8fmc',
    videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
    thumbnailUrl: 'https://img.youtube.com/vi/-M4-G8p8fmc/hqdefault.jpg',
    videoTitle: 'How To: Standing Calf Raise With Full Range',
    instructions: [
      'Place the balls of your feet on the step with heels hanging off the edge.',
      'Lower your heels as far as comfortably possible into a deep calf stretch and hold for 2 seconds.',
      'Press up forcefully onto the balls of your feet to maximum height, squeezing calves hard.',
      'Lower smoothly without bouncing at the bottom.'
    ]
  },

  // ==================== SHOULDERS ====================
  {
    name: 'Overhead Barbell Military Press',
    category: 'Strength',
    description: 'Gold standard vertical overhead press developing powerful anterior deltoids, triceps, and upper chest.',
    muscleGroup: 'Shoulders',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    youtubeId: '2yjwXTZQDDI',
    videoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
    thumbnailUrl: 'https://img.youtube.com/vi/2yjwXTZQDDI/hqdefault.jpg',
    videoTitle: 'How To Overhead Press (Military Press Guide)',
    instructions: [
      'Rack bar at collarbone height. Grip just outside shoulders with wrists stacked directly over forearms.',
      'Unrack, step back, squeeze glutes, brace abs, and tighten quads for a solid foundation.',
      'Press bar vertically in a straight path, pulling head slightly back as bar passes nose, then push head forward through the window at lockout.',
      'Lower with control back to clavicle.'
    ]
  },
  {
    name: 'Seated Dumbbell Shoulder Press',
    category: 'Strength',
    description: 'Direct overhead pressing without spine fatigue, allowing deep deltoid stretch and independent arm drive.',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    youtubeId: 'qEwKCR5JCog',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    thumbnailUrl: 'https://img.youtube.com/vi/qEwKCR5JCog/hqdefault.jpg',
    videoTitle: 'How To: Seated Dumbbell Shoulder Press',
    instructions: [
      'Set bench to 80-90 degrees. Sit with back supported and dumbbells rested on knees.',
      'Kick weights up to ear level with palms facing forward or semi-neutral.',
      'Press dumbbells overhead smoothly until arms are extended overhead.',
      'Lower weights under control back to ear level for maximum deltoid stretch.'
    ]
  },
  {
    name: 'Dumbbell Lateral Raise',
    category: 'Strength',
    description: 'The premier isolation exercise for developing lateral deltoids and creating shoulder width.',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    youtubeId: '3VcKaXpzqRo',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    thumbnailUrl: 'https://img.youtube.com/vi/3VcKaXpzqRo/hqdefault.jpg',
    videoTitle: 'How To: Dumbbell Lateral Raise (Side Delts)',
    instructions: [
      'Stand tall holding light dumbbells at sides with a slight forward lean in the torso.',
      'With elbows softly unlocked, raise arms out to sides in the scapular plane (slightly in front of body).',
      'Lead with elbows until arms are parallel to the floor, pouring out imaginary pitchers at the top.',
      'Lower weights slowly over 2 seconds.'
    ]
  },
  {
    name: 'Cable Face Pull',
    category: 'Strength',
    description: 'Crucial postural movement for rear deltoids, external rotator cuff tendons, and rhomboid balance.',
    muscleGroup: 'Shoulders',
    equipment: 'Cable',
    difficulty: 'Beginner',
    youtubeId: 'rep-qVOkqgk',
    videoUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    thumbnailUrl: 'https://img.youtube.com/vi/rep-qVOkqgk/hqdefault.jpg',
    videoTitle: 'How To Face Pull (Athlean-X Proper Form)',
    instructions: [
      'Set cable pulley at upper chest/face level with a rope attachment.',
      'Grip ends of the rope with thumbs pointing backward.',
      'Pull the center of the rope directly toward your eyes/forehead while pulling hands apart.',
      'Externally rotate shoulders at the end of the pull, holding peak contraction for 1 second before extending arms.'
    ]
  },
  {
    name: 'Dumbbell Shrugs',
    category: 'Strength',
    description: 'Targeted upper trapezius builder for upper neck thickness and heavy carry stability.',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    youtubeId: 'cJRVVxmytaM',
    videoUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM',
    thumbnailUrl: 'https://img.youtube.com/vi/cJRVVxmytaM/hqdefault.jpg',
    videoTitle: 'How To: Dumbbell Shrugs (Trapezius Hypertrophy)',
    instructions: [
      'Stand holding heavy dumbbells at sides with neutral palms and spine aligned.',
      'Elevate shoulders straight up toward your ears as high as possible without rolling shoulders forward or back.',
      'Pause and squeeze traps hard for 1 full second at the top.',
      'Lower weights under control into a full stretch.'
    ]
  },

  // ==================== ARMS ====================
  {
    name: 'Dumbbell Bicep Curl',
    category: 'Strength',
    description: 'Fundamental arm isolation movement developing bicep peak and forearm supination.',
    muscleGroup: 'Arms',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    youtubeId: 'ykJmrZ5v0Oo',
    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    thumbnailUrl: 'https://img.youtube.com/vi/ykJmrZ5v0Oo/hqdefault.jpg',
    videoTitle: 'How To Do A Dumbbell Biceps Curl (Proper Form)',
    instructions: [
      'Stand holding dumbbells with palms facing thighs, elbows pinned to your sides.',
      'Curl weights upward while supinating (rotating) wrists so palms face shoulders at the top.',
      'Squeeze biceps hard at the peak for 1 second without swinging hips or elbows forward.',
      'Lower the dumbbells slowly over 2-3 seconds to full extension.'
    ]
  },
  {
    name: 'EZ-Bar Bicep Curl',
    category: 'Strength',
    description: 'Bilateral bicep mass builder using an angled bar that relieves wrist torque.',
    muscleGroup: 'Arms',
    equipment: 'Barbell',
    difficulty: 'Beginner',
    youtubeId: 'kwG2ipFRgfo',
    videoUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    thumbnailUrl: 'https://img.youtube.com/vi/kwG2ipFRgfo/hqdefault.jpg',
    videoTitle: 'How To Do EZ Bar Bicep Curls (Arm Workout)',
    instructions: [
      'Hold the angled inner grips of the EZ-bar with an underhand grip.',
      'Pin elbows beside ribs, brace abs, and curl the bar toward upper chest in a smooth arc.',
      'Contract biceps forcefully at the top without allowing elbows to drift forward.',
      'Lower the bar under strict tension until arms are fully straightened.'
    ]
  },
  {
    name: 'Incline Dumbbell Bicep Curl',
    category: 'Strength',
    description: 'Positions elbows behind torso to place maximum stretch on the long head of the biceps brachii.',
    muscleGroup: 'Arms',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    youtubeId: 'soxrZlIl35U',
    videoUrl: 'https://www.youtube.com/watch?v=soxrZlIl35U',
    thumbnailUrl: 'https://img.youtube.com/vi/soxrZlIl35U/hqdefault.jpg',
    videoTitle: 'How To: Seated Incline Dumbbell Bicep Curl',
    instructions: [
      'Set an adjustable bench to a 45-60 degree incline and lean back with arms hanging straight down.',
      'Keep upper arms stationary pointing toward the floor as you curl dumbbells upward.',
      'Supinate wrists at the top for peak bicep contraction.',
      'Lower weights with control back into the deep bottom stretch.'
    ]
  },
  {
    name: 'Triceps Rope Pushdown',
    category: 'Strength',
    description: 'Cable movement isolating the lateral and long heads of the triceps with full lockout.',
    muscleGroup: 'Arms',
    equipment: 'Cable',
    difficulty: 'Beginner',
    youtubeId: 'vB5OHsJ3EME',
    videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    thumbnailUrl: 'https://img.youtube.com/vi/vB5OHsJ3EME/hqdefault.jpg',
    videoTitle: 'How To: Triceps Rope Pushdown',
    instructions: [
      'Attach a rope to the top cable pulley and grip ends with palms facing each other.',
      'Pin elbows snugly beside your torso with a slight forward hip hinge.',
      'Push the rope straight down by extending elbows, spreading ends outward at full extension.',
      'Hold the lockout for 1 second, then allow forearms to return upward to 90 degrees under control.'
    ]
  },
  {
    name: 'Skull Crushers (Lying Triceps Extension)',
    category: 'Strength',
    description: 'Direct triceps mass builder targeting the long head through an overhead elbow angle.',
    muscleGroup: 'Arms',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    youtubeId: 'RavQHfFxbdA',
    videoUrl: 'https://www.youtube.com/watch?v=RavQHfFxbdA',
    thumbnailUrl: 'https://img.youtube.com/vi/RavQHfFxbdA/hqdefault.jpg',
    videoTitle: 'How To: Skull Crusher (Build Bigger Triceps!)',
    instructions: [
      'Lie on a flat bench holding an EZ-bar over your chest with arms tilted slightly backward toward your head.',
      'Keep upper arms stationary and bend elbows to lower the bar toward the top of your forehead or bench edge.',
      'Pause as triceps reach full stretch, then extend elbows back to the starting tilted angle.'
    ]
  },
  {
    name: 'Seated Dumbbell Overhead Tricep Extension',
    category: 'Strength',
    description: 'Deep stretch isolation exercise targeting the long head of the triceps for upper arm thickness.',
    muscleGroup: 'Arms',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    youtubeId: 'YbX7Wd8jQ-Q',
    videoUrl: 'https://www.youtube.com/watch?v=YbX7Wd8jQ-Q',
    thumbnailUrl: 'https://img.youtube.com/vi/YbX7Wd8jQ-Q/hqdefault.jpg',
    videoTitle: 'How To: Seated Overhead Dumbbell Tricep Extension',
    instructions: [
      'Sit upright on a short-backed bench holding one heavy dumbbell vertically overhead with both hands cupped under the top weight plate.',
      'Lower the dumbbell behind your head by bending elbows while keeping upper arms close to ears.',
      'Lower until you feel a deep stretch in the triceps, then press back overhead to full arm lockout.'
    ]
  },
  {
    name: 'Dumbbell Hammer Curl',
    category: 'Strength',
    description: 'Neutral-grip arm exercise building the brachialis muscle (arm thickness) and brachioradialis forearm mass.',
    muscleGroup: 'Arms',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    youtubeId: 'zC3nLlEvin4',
    videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
    thumbnailUrl: 'https://img.youtube.com/vi/zC3nLlEvin4/hqdefault.jpg',
    videoTitle: 'How To: Dumbbell Hammer Curl (Brachialis & Forearms)',
    instructions: [
      'Stand holding dumbbells with palms facing each other (neutral grip).',
      'Keep elbows pinned to your ribs and curl weights upward toward shoulders.',
      'Pause for 1 second at the top, squeezing forearms and arms.',
      'Lower the weights under steady control.'
    ]
  },

  // ==================== CORE ====================
  {
    name: 'Hanging Leg Raise',
    category: 'Core',
    description: 'Advanced abdominal exercise targeting lower rectus abdominis, hip flexors, and grip strength.',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    youtubeId: 'hdng3Nm1x_E',
    videoUrl: 'https://www.youtube.com/watch?v=hdng3Nm1x_E',
    thumbnailUrl: 'https://img.youtube.com/vi/hdng3Nm1x_E/hqdefault.jpg',
    videoTitle: 'How To: Hanging Leg-Lift (Core Mastery)',
    instructions: [
      'Hang from a pull-up bar with an overhand grip, shoulders active and body completely still.',
      'Posteriorly tilt your pelvis and raise your legs (straight or bent knees for beginners) until thighs are at or above horizontal.',
      'Curl your hips up toward your chest at the top for maximum lower abdominal recruitment.',
      'Lower legs slowly without swinging or using momentum.'
    ]
  },
  {
    name: 'Kneeling Cable Crunch',
    category: 'Core',
    description: 'Loaded spinal flexion movement allowing progressive overload for the rectus abdominis.',
    muscleGroup: 'Core',
    equipment: 'Cable',
    difficulty: 'Intermediate',
    youtubeId: 'aBd6T01PBqw',
    videoUrl: 'https://www.youtube.com/watch?v=aBd6T01PBqw',
    thumbnailUrl: 'https://img.youtube.com/vi/aBd6T01PBqw/hqdefault.jpg',
    videoTitle: 'How to Properly Perform A Cable Crunch (Abs)',
    instructions: [
      'Attach a rope to a high pulley. Kneel 2-3 feet back and hold rope handles beside your head/ears.',
      'Lock hips stationary (do not sit back onto heels).',
      'Contract abs and curl your ribcage down toward your pelvis, rounding your spine.',
      'Squeeze abs hard at the bottom for 1 second, then control the eccentric return to a stretch.'
    ]
  },
  {
    name: 'Cable Woodchop',
    category: 'Core',
    description: 'Rotational core powerhouse training internal and external obliques and transverse abdominis.',
    muscleGroup: 'Core',
    equipment: 'Cable',
    difficulty: 'Intermediate',
    youtubeId: 'PCQCwP1Xy0g',
    videoUrl: 'https://www.youtube.com/watch?v=PCQCwP1Xy0g',
    thumbnailUrl: 'https://img.youtube.com/vi/PCQCwP1Xy0g/hqdefault.jpg',
    videoTitle: 'How to Perform a Cable Wood Chop (Obliques)',
    instructions: [
      'Set pulley to highest position. Stand sideways with feet shoulder-width and grip handle with both hands.',
      'Keep arms extended with a soft elbow bend. Rotate torso diagonally downward across body toward opposite hip.',
      'Pivot your back foot to protect knee and drive the movement from core obliques.',
      'Slowly return to starting position resisting the cable.'
    ]
  },
  {
    name: 'Ab Wheel Rollout',
    category: 'Core',
    description: 'Supreme anti-extension core exercise building intense abdominal wall strength and spinal stability.',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    youtubeId: 'nCh8VfWY5_g',
    videoUrl: 'https://www.youtube.com/watch?v=nCh8VfWY5_g',
    thumbnailUrl: 'https://img.youtube.com/vi/nCh8VfWY5_g/hqdefault.jpg',
    videoTitle: 'How to do Ab Wheel Rollouts the Right Way',
    instructions: [
      'Kneel on a soft mat holding the ab wheel handles directly under shoulders.',
      'Posteriorly tilt pelvis ("tuck tailbone") and round upper back slightly into a hollow body posture.',
      'Slowly roll wheel forward, extending arms and hips without letting lower back sag.',
      'Pull back by contracting abdominals to return to the starting position.'
    ]
  },
  {
    name: 'Forearm Plank',
    category: 'Core',
    description: 'Foundational isometric core hold building endurance across the entire abdominal belt and lower back.',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    youtubeId: 'pSHjTRCQxIw',
    videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    thumbnailUrl: 'https://img.youtube.com/vi/pSHjTRCQxIw/hqdefault.jpg',
    videoTitle: 'How To: Plank (Perfect Form & Technique)',
    instructions: [
      'Rest forearms on the floor with elbows directly under shoulders.',
      'Extend legs straight back onto toes, creating a rigid straight line from heels to head.',
      'Squeeze glutes and pull navel up toward spine to engage deep transverse abdominis.',
      'Hold position steadily while maintaining calm, regular diaphragmatic breathing.'
    ]
  },

  // ==================== CARDIO & CONDITIONING ====================
  {
    name: 'Rowing Machine (Ergometer)',
    category: 'Cardio',
    description: 'Total-body low-impact cardiovascular conditioning engaging 86% of body musculature with high calorie burn.',
    muscleGroup: 'Cardio',
    equipment: 'Machine',
    difficulty: 'Beginner',
    youtubeId: 'zQ82RYIFLN8',
    videoUrl: 'https://www.youtube.com/watch?v=zQ82RYIFLN8',
    thumbnailUrl: 'https://img.youtube.com/vi/zQ82RYIFLN8/hqdefault.jpg',
    videoTitle: 'Correct Rowing Technique (Concept 2 Erg)',
    instructions: [
      'Strap feet securely into footplates and set damper resistance to 4-5.',
      'Sequence the drive: Push with legs first, lean torso back to 1 o’clock, then pull handle to lower ribs.',
      'Sequence the recovery in reverse: Extend arms, hinge torso forward to 11 o’clock, then bend knees back to the catch.',
      'Maintain a smooth 20-28 strokes-per-minute rhythm.'
    ]
  },
  {
    name: 'HIIT Burpees',
    category: 'HIIT',
    description: 'Explosive full-body cardiovascular and metabolic conditioning exercise.',
    muscleGroup: 'Cardio',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    youtubeId: 'dZgVxmf6jkA',
    videoUrl: 'https://www.youtube.com/watch?v=dZgVxmf6jkA',
    thumbnailUrl: 'https://img.youtube.com/vi/dZgVxmf6jkA/hqdefault.jpg',
    videoTitle: 'How-To: Burpees for Beginners to Advanced',
    instructions: [
      'From standing, drop into a squat and place hands flat on the floor.',
      'Kick feet back into a full plank and lower chest to the floor.',
      'Push up explosively, jump feet back under hips into a low squat.',
      'Jump vertically upward reaching arms overhead with energy.'
    ]
  },
  {
    name: 'Jump Rope',
    category: 'Cardio',
    description: 'High-efficiency aerobic conditioning, calf agility, wrist rhythm, and coordination drill.',
    muscleGroup: 'Cardio',
    equipment: 'None',
    difficulty: 'Beginner',
    youtubeId: 'u3zgHI8QnqE',
    videoUrl: 'https://www.youtube.com/watch?v=u3zgHI8QnqE',
    thumbnailUrl: 'https://img.youtube.com/vi/u3zgHI8QnqE/hqdefault.jpg',
    videoTitle: 'How To Jump Rope The Right Way',
    instructions: [
      'Hold handles with elbows bent near ribs and wrists doing the rotational work.',
      'Jump lightly on the balls of your feet just 1-2 inches off the ground as rope passes.',
      'Keep knees soft and maintain relaxed rhythm.'
    ]
  }
];

/**
 * Seed or update exercises in MongoDB with full YouTube video metadata.
 * Uses upsert by name to ensure existing databases are immediately enriched with video data.
 */
export const seedExercises = async () => {
  try {
    let upsertCount = 0;
    for (const ex of initialExercises) {
      await Exercise.findOneAndUpdate(
        { name: ex.name, isCustom: false },
        { $set: ex },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upsertCount++;
    }
    console.log(`[Seed] Seeded/Updated ${upsertCount} gym exercises with embedded YouTube workout videos.`);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed exercises: ${error.message}`);
  }
};

// Allow running directly via "node src/utils/seedExercises.js"
if (process.argv[1]?.endsWith('seedExercises.js')) {
  mongoose
    .connect(ENV.MONGODB_URI)
    .then(async () => {
      console.log('[Seed Runner] Connected to MongoDB');
      await seedExercises();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Runner] Error:', err);
      process.exit(1);
    });
}
