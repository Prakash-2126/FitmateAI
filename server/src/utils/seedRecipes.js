import mongoose from 'mongoose';
import { Recipe } from '../models/Recipe.js';
import { ENV } from '../config/env.js';

export const initialRecipes = [
  // ==================== VEGETARIAN RECIPES ====================
  {
    title: 'High-Protein Paneer & Veggie Rice Bowl',
    dietaryType: 'Vegetarian',
    mealType: 'Dinner',
    description: 'Crispy pan-seared spiced paneer tossed with bell peppers and onions, served over fragrant basmati rice with cucumber yogurt raita.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 1,
    calories: 480,
    protein: 32,
    carbs: 46,
    fats: 18,
    fiber: 6,
    youtubeId: 'EJL8byL5aCc',
    videoUrl: 'https://www.youtube.com/watch?v=EJL8byL5aCc',
    thumbnailUrl: 'https://img.youtube.com/vi/EJL8byL5aCc/hqdefault.jpg',
    videoTitle: 'High Protein Paneer Rice Bowl | Easy Healthy Dinner Recipe',
    tags: ['High-Protein', 'Vegetarian', 'Gluten-Free', 'Muscle-Gain', 'Indian Gym Diet'],
    isFeatured: true,
    ingredients: [
      { item: 'Low-fat Paneer (cubed)', amount: '150g' },
      { item: 'Cooked Basmati or Brown Rice', amount: '1 cup (150g)' },
      { item: 'Bell Peppers (sliced)', amount: '1 cup' },
      { item: 'Red Onion (diced)', amount: '1/2 medium' },
      { item: 'Olive Oil', amount: '1 tsp (5ml)' },
      { item: 'Turmeric, Garam Masala, Chili Powder', amount: '1/2 tsp each' },
      { item: 'Greek Yogurt (for raita)', amount: '3 tbsp' }
    ],
    instructions: [
      'Heat 1 tsp olive oil in a non-stick pan over medium heat.',
      'Add cubed paneer along with turmeric, garam masala, chili powder, and a pinch of salt. Pan sear until edges turn golden (3-4 mins).',
      'Toss in sliced bell peppers and onions; sauté for 3 minutes so veggies stay crisp.',
      'Layer warm rice in a bowl, top with seasoned paneer and veggies, and serve with cold Greek yogurt raita.'
    ]
  },
  {
    title: 'Macro-Friendly High-Protein Overnight Oats',
    dietaryType: 'Vegetarian',
    mealType: 'Breakfast',
    description: 'Creamy, grab-and-go overnight oats packed with 32g protein, chia seeds, Greek yogurt, and fresh mixed berries.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    calories: 380,
    protein: 32,
    carbs: 44,
    fats: 8,
    fiber: 9,
    youtubeId: 'kwsAA6__Yvs',
    videoUrl: 'https://www.youtube.com/watch?v=kwsAA6__Yvs',
    thumbnailUrl: 'https://img.youtube.com/vi/kwsAA6__Yvs/hqdefault.jpg',
    videoTitle: 'Overnight Oats for Weight Loss | How to Make Them High-Protein',
    tags: ['High-Protein', 'Vegetarian', 'Breakfast', 'Meal Prep', 'High-Fiber'],
    isFeatured: true,
    ingredients: [
      { item: 'Rolled Oats', amount: '1/2 cup (45g)' },
      { item: 'Vanilla Whey or Plant Protein Powder', amount: '1 scoop (25g)' },
      { item: 'Plain Non-Fat Greek Yogurt', amount: '1/3 cup (80g)' },
      { item: 'Unsweetened Almond Milk', amount: '1/2 cup (120ml)' },
      { item: 'Chia Seeds', amount: '1 tbsp (12g)' },
      { item: 'Fresh Blueberries or Strawberries', amount: '1/3 cup' }
    ],
    instructions: [
      'In a mason jar or meal-prep container, combine rolled oats, protein powder, and chia seeds.',
      'Pour in Greek yogurt and unsweetened almond milk. Whisk thoroughly until smooth with no powder clumps.',
      'Gently fold in fresh berries on top.',
      'Seal tightly and refrigerate for at least 4 hours (or overnight). Enjoy chilled directly from the jar!'
    ]
  },
  {
    title: 'Rainbow Fluffy Tofu Scramble',
    dietaryType: 'Vegan',
    mealType: 'Breakfast',
    description: 'High-protein, dairy-free, scrambled eggs alternative infused with turmeric, nutritional yeast, garlic, and baby spinach.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    servings: 1,
    calories: 260,
    protein: 22,
    carbs: 9,
    fats: 14,
    fiber: 5,
    youtubeId: 'Vc5pZ-PY-H8',
    videoUrl: 'https://www.youtube.com/watch?v=Vc5pZ-PY-H8',
    thumbnailUrl: 'https://img.youtube.com/vi/Vc5pZ-PY-H8/hqdefault.jpg',
    videoTitle: 'How to Make Perfect Tofu Scramble (Rainbow Plant Life)',
    tags: ['High-Protein', 'Vegan', 'Vegetarian', 'Low-Carb', 'Dairy-Free', 'Keto'],
    ingredients: [
      { item: 'Firm Tofu (crumbled)', amount: '200g' },
      { item: 'Nutritional Yeast', amount: '1.5 tbsp' },
      { item: 'Ground Turmeric (for color)', amount: '1/4 tsp' },
      { item: 'Garlic Powder & Black Pepper', amount: '1/2 tsp each' },
      { item: 'Kala Namak (Black Salt for eggy flavor)', amount: '1/4 tsp' },
      { item: 'Baby Spinach', amount: '1 cup' },
      { item: 'Olive Oil', amount: '1 tsp' }
    ],
    instructions: [
      'Heat olive oil in a skillet over medium heat.',
      'Crumble firm tofu directly into the skillet using your hands into bite-sized curd pieces.',
      'Sprinkle nutritional yeast, turmeric, garlic powder, and black pepper. Stir gently for 4-5 minutes.',
      'Add baby spinach and cook until just wilted. Remove from heat and stir in kala namak right before serving.'
    ]
  },
  {
    title: 'One-Pot High-Protein Chana Masala (Chickpea Curry)',
    dietaryType: 'Vegan',
    mealType: 'Lunch',
    description: 'Hearty traditional spiced chickpea curry simmered in an aromatic tomato-onion gravy loaded with plant protein and fiber.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 2,
    calories: 390,
    protein: 19,
    carbs: 58,
    fats: 9,
    fiber: 14,
    youtubeId: 'x0GD4AdFO-s',
    videoUrl: 'https://www.youtube.com/watch?v=x0GD4AdFO-s',
    thumbnailUrl: 'https://img.youtube.com/vi/x0GD4AdFO-s/hqdefault.jpg',
    videoTitle: 'CHICKPEA CURRY Recipe | Easy Vegetarian and Vegan Meals',
    tags: ['Vegetarian', 'Vegan', 'High-Fiber', 'Meal Prep', 'Plant-Protein'],
    ingredients: [
      { item: 'Cooked Chickpeas (garbanzo beans)', amount: '2 cups (320g)' },
      { item: 'Crushed Tomatoes', amount: '1 cup (240ml)' },
      { item: 'Onion (finely chopped)', amount: '1 medium' },
      { item: 'Ginger-Garlic Paste', amount: '1 tbsp' },
      { item: 'Cumin, Coriander, Garam Masala', amount: '1 tsp each' },
      { item: 'Olive Oil', amount: '1 tbsp' },
      { item: 'Fresh Cilantro & Lemon Juice', amount: 'for garnish' }
    ],
    instructions: [
      'Heat oil in a pot; sauté onions until translucent and golden.',
      'Stir in ginger-garlic paste and ground spices, toasting for 30 seconds until fragrant.',
      'Pour in crushed tomatoes and simmer for 5 minutes until oil starts separating.',
      'Add chickpeas and 1/2 cup water. Simmer covered for 10 minutes, lightly mashing a few chickpeas to thicken gravy.',
      'Finish with fresh lemon juice and chopped cilantro.'
    ]
  },
  {
    title: 'Mediterranean Power Lentil & Veggie Salad',
    dietaryType: 'Vegan',
    mealType: 'Lunch',
    description: 'Refreshing high-protein salad with brown lentils, crisp cucumbers, cherry tomatoes, and zesty lemon-herb vinaigrette.',
    prepTimeMinutes: 12,
    cookTimeMinutes: 0,
    servings: 1,
    calories: 360,
    protein: 22,
    carbs: 48,
    fats: 10,
    fiber: 16,
    youtubeId: '-ifPa57Y9_Y',
    videoUrl: 'https://www.youtube.com/watch?v=-ifPa57Y9_Y',
    thumbnailUrl: 'https://img.youtube.com/vi/-ifPa57Y9_Y/hqdefault.jpg',
    videoTitle: 'High-Protein Lentil Salad That Keeps You Full',
    tags: ['Vegetarian', 'Vegan', 'High-Protein', 'Meal Prep', 'Low-Calorie'],
    ingredients: [
      { item: 'Cooked Green or Brown Lentils', amount: '1.5 cups (250g)' },
      { item: 'English Cucumber (diced)', amount: '1 cup' },
      { item: 'Cherry Tomatoes (halved)', amount: '1 cup' },
      { item: 'Fresh Parsley & Mint (chopped)', amount: '1/4 cup' },
      { item: 'Extra Virgin Olive Oil', amount: '1 tsp' },
      { item: 'Lemon Juice', amount: '2 tbsp' }
    ],
    instructions: [
      'In a large salad bowl, combine cooked and cooled lentils with diced cucumber and halved tomatoes.',
      'Toss in fresh parsley, mint, and thinly sliced red onion.',
      'Whisk lemon juice, olive oil, salt, and pepper in a small cup, then pour over salad.',
      'Toss thoroughly. Tastes even better after marinating in the fridge for 30 minutes!'
    ]
  },
  {
    title: 'Flourless Blender Cottage Cheese Protein Pancakes',
    dietaryType: 'Vegetarian',
    mealType: 'Breakfast',
    description: 'Fluffy, high-protein pancakes made in a blender with whole oats, low-fat cottage cheese, and eggs—no protein powder required.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    servings: 1,
    calories: 340,
    protein: 28,
    carbs: 32,
    fats: 8,
    fiber: 4,
    youtubeId: 'yIx39oKoDsU',
    videoUrl: 'https://www.youtube.com/watch?v=yIx39oKoDsU',
    thumbnailUrl: 'https://img.youtube.com/vi/yIx39oKoDsU/hqdefault.jpg',
    videoTitle: 'COTTAGE CHEESE PANCAKES | High Protein Breakfast Recipe',
    tags: ['Vegetarian', 'High-Protein', 'Breakfast', 'Low-Sugar', 'Flourless'],
    ingredients: [
      { item: 'Rolled Oats', amount: '1/2 cup (45g)' },
      { item: 'Low-Fat Cottage Cheese', amount: '1/2 cup (115g)' },
      { item: 'Whole Egg', amount: '1 large' },
      { item: 'Egg Whites', amount: '1/4 cup (60ml)' },
      { item: 'Baking Powder', amount: '1 tsp' },
      { item: 'Cinnamon & Vanilla Extract', amount: '1/2 tsp each' }
    ],
    instructions: [
      'Add oats, cottage cheese, egg, egg whites, baking powder, vanilla, and cinnamon into a blender.',
      'Blend on high for 30-45 seconds until batter is completely smooth and creamy.',
      'Heat a non-stick griddle over medium-low heat; spray lightly with olive oil.',
      'Pour 1/4 cup batter circles and cook 2-3 minutes until bubbles form, then flip and cook 1-2 minutes until golden.'
    ]
  },

  // ==================== NON-VEGETARIAN RECIPES ====================
  {
    title: 'Golden Juicy Stovetop Chicken Breast',
    dietaryType: 'Non-Vegetarian',
    mealType: 'Lunch',
    description: 'The foolproof chef technique to cooking ultra-juicy, golden pan-seared chicken breast packed with 52g of pure lean protein.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    servings: 1,
    calories: 320,
    protein: 52,
    carbs: 2,
    fats: 11,
    fiber: 0,
    youtubeId: 'ajwZ5l9og3Y',
    videoUrl: 'https://www.youtube.com/watch?v=ajwZ5l9og3Y',
    thumbnailUrl: 'https://img.youtube.com/vi/ajwZ5l9og3Y/hqdefault.jpg',
    videoTitle: 'How I Cook Chicken Breast So It’s Juicy and Golden Every Time',
    tags: ['Non-Vegetarian', 'High-Protein', 'Low-Carb', 'Keto', 'Lean-Muscle'],
    isFeatured: true,
    ingredients: [
      { item: 'Boneless Skinless Chicken Breast', amount: '220g' },
      { item: 'Olive Oil', amount: '1 tsp (5ml)' },
      { item: 'Smoked Paprika, Garlic Powder, Onion Powder', amount: '1/2 tsp each' },
      { item: 'Dried Oregano & Black Pepper', amount: '1/4 tsp each' },
      { item: 'Sea Salt', amount: '1/2 tsp' }
    ],
    instructions: [
      'Pat chicken breast dry with a paper towel. Even out thickness by lightly pounding the thicker end.',
      'Coat with 1 tsp olive oil and rub spice mix evenly over both sides.',
      'Heat a heavy skillet over medium-high heat. Place chicken in hot pan and sear undisturbed for 5-6 minutes until a deep golden crust forms.',
      'Flip chicken, turn heat down to medium, cover with a lid, and cook for another 5-6 minutes until internal temperature hits 165°F (74°C).',
      'Transfer to a plate and rest for 5 minutes before slicing to lock in all juices.'
    ]
  },
  {
    title: 'Meal-Prep Baked Juicy Chicken Breasts',
    dietaryType: 'Non-Vegetarian',
    mealType: 'Meal Prep',
    description: 'Hands-off, ultra-consistent oven baked chicken breast for weekly gym meal prep with zero dry texture.',
    prepTimeMinutes: 8,
    cookTimeMinutes: 22,
    servings: 1,
    calories: 310,
    protein: 54,
    carbs: 1,
    fats: 9,
    fiber: 0,
    youtubeId: 'EDN7mCiKfwc',
    videoUrl: 'https://www.youtube.com/watch?v=EDN7mCiKfwc',
    thumbnailUrl: 'https://img.youtube.com/vi/EDN7mCiKfwc/hqdefault.jpg',
    videoTitle: 'EASIEST Baked Chicken Breasts | JUICY LOW EFFORT Meal Prep',
    tags: ['Non-Vegetarian', 'High-Protein', 'Meal Prep', 'Low-Fat', 'Gym-Staple'],
    ingredients: [
      { item: 'Chicken Breast', amount: '230g' },
      { item: 'Olive Oil', amount: '1 tsp' },
      { item: 'Paprika, Italian Seasoning, Garlic Salt', amount: '1/2 tsp each' }
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Line a baking dish with parchment paper.',
      'Season chicken generously with olive oil and spices on both sides.',
      'Bake for 20-22 minutes until cooked through (165°F / 74°C).',
      'Rest for 8 minutes before slicing into meal-prep containers with your choice of rice or greens.'
    ]
  },
  {
    title: 'Healthy Teriyaki Salmon & Steamed Broccoli Bowl',
    dietaryType: 'Non-Vegetarian',
    mealType: 'Dinner',
    description: 'Pan-seared crispy skin wild salmon glazed with low-sodium teriyaki, served over jasmine rice with sesame broccoli.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    servings: 1,
    calories: 510,
    protein: 42,
    carbs: 48,
    fats: 16,
    fiber: 4,
    youtubeId: 'Z9mYGRh_p44',
    videoUrl: 'https://www.youtube.com/watch?v=Z9mYGRh_p44',
    thumbnailUrl: 'https://img.youtube.com/vi/Z9mYGRh_p44/hqdefault.jpg',
    videoTitle: 'Teriyaki Salmon Bowl | Healthy Meal Prep Recipe',
    tags: ['Non-Vegetarian', 'High-Protein', 'Omega-3', 'Heart-Healthy', 'Pescatarian'],
    isFeatured: true,
    ingredients: [
      { item: 'Fresh Salmon Fillet (skin-on)', amount: '180g' },
      { item: 'Cooked Jasmine or Brown Rice', amount: '1 cup (150g)' },
      { item: 'Broccoli Florets', amount: '1.5 cups' },
      { item: 'Low-Sodium Soy Sauce', amount: '1.5 tbsp' },
      { item: 'Honey or Maple Syrup', amount: '1 tsp' },
      { item: 'Sesame Seeds', amount: '1/2 tsp' }
    ],
    instructions: [
      'Whisk soy sauce, honey, minced garlic, and 1 tbsp water to make light teriyaki glaze.',
      'Heat a non-stick pan over medium-high heat. Place salmon skin-side down and sear for 4 minutes until crispy.',
      'Flip salmon and cook 3 minutes. Pour teriyaki sauce into pan, letting it bubble and coat salmon for 1 minute.',
      'Steam broccoli florets for 3 minutes.',
      'Assemble bowl with rice, steamed broccoli, and glazed salmon; garnish with sesame seeds.'
    ]
  },
  {
    title: 'High-Protein Turkey Burrito Power Bowls',
    dietaryType: 'Non-Vegetarian',
    mealType: 'Lunch',
    description: 'Seasoned 93% lean ground turkey, black beans, sweet corn, and cilantro-lime rice topped with fresh pico de gallo.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 1,
    calories: 460,
    protein: 38,
    carbs: 45,
    fats: 14,
    fiber: 8,
    youtubeId: 'IxrD3CRSo5c',
    videoUrl: 'https://www.youtube.com/watch?v=IxrD3CRSo5c',
    thumbnailUrl: 'https://img.youtube.com/vi/IxrD3CRSo5c/hqdefault.jpg',
    videoTitle: 'Healthy Meal Prep - High-Protein Turkey Burrito Bowl',
    tags: ['Non-Vegetarian', 'High-Protein', 'Meal Prep', 'Balanced-Macros'],
    ingredients: [
      { item: 'Lean Ground Turkey (93% lean)', amount: '170g' },
      { item: 'Taco Seasoning', amount: '1 tbsp' },
      { item: 'Cooked Brown Rice', amount: '3/4 cup' },
      { item: 'Black Beans (rinsed & drained)', amount: '1/3 cup' },
      { item: 'Corn Kernels', amount: '1/4 cup' },
      { item: 'Fresh Pico de Gallo / Salsa', amount: '3 tbsp' },
      { item: 'Lime Juice & Cilantro', amount: 'to taste' }
    ],
    instructions: [
      'Brown ground turkey in a non-stick skillet over medium-high heat, breaking into crumbles (6-7 mins).',
      'Add taco seasoning and 3 tbsp water; simmer until sauce thickens and coats meat.',
      'Toss warm brown rice with fresh lime juice and chopped cilantro.',
      'Assemble bowl with cilantro-lime rice base, seasoned turkey, black beans, corn, and fresh salsa.'
    ]
  },
  {
    title: 'Anabolic Air-Fryer Crispy Chicken Tenders',
    dietaryType: 'Non-Vegetarian',
    mealType: 'Lunch',
    description: 'Crunchy golden chicken tenders with 52g protein and only 6g fat, air-fried without heavy oil.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    servings: 1,
    calories: 360,
    protein: 52,
    carbs: 18,
    fats: 6,
    fiber: 1,
    youtubeId: 'uTgePDa5zdM',
    videoUrl: 'https://www.youtube.com/watch?v=uTgePDa5zdM',
    thumbnailUrl: 'https://img.youtube.com/vi/uTgePDa5zdM/hqdefault.jpg',
    videoTitle: 'Anabolic Air Fryer Chicken Tender Recipe / KFC But Better!',
    tags: ['Non-Vegetarian', 'High-Protein', 'Low-Calorie', 'Air-Fryer', 'Fat-Loss'],
    ingredients: [
      { item: 'Chicken Tenderloins / Breast strips', amount: '220g' },
      { item: 'Liquid Egg Whites', amount: '3 tbsp' },
      { item: 'Panko Breadcrumbs or Crushed Cornflakes', amount: '25g' },
      { item: 'Garlic Powder, Onion Powder, Paprika', amount: '1/2 tsp each' },
      { item: 'Salt & Pepper', amount: '1/4 tsp each' }
    ],
    instructions: [
      'Set up two shallow bowls: one with egg whites, and one with panko mixed with spices.',
      'Preheat air fryer to 390°F (200°C).',
      'Dip chicken tenders into egg whites, then coat thoroughly in seasoned panko crumbs.',
      'Place in air fryer basket in a single layer. Spray lightly with cooking spray.',
      'Air fry for 10-12 minutes, flipping halfway through, until crispy golden brown and 165°F inside.'
    ]
  },
  {
    title: 'Under 350-Cal Honey Garlic Shrimp Meal Prep',
    dietaryType: 'Non-Vegetarian',
    mealType: 'Dinner',
    description: 'Plump succulent shrimp glazed with sweet garlic sauce served alongside tender sugar snap peas and brown rice.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 8,
    servings: 1,
    calories: 330,
    protein: 44,
    carbs: 28,
    fats: 5,
    fiber: 4,
    youtubeId: '5vz-bLMIQds',
    videoUrl: 'https://www.youtube.com/watch?v=5vz-bLMIQds',
    thumbnailUrl: 'https://img.youtube.com/vi/5vz-bLMIQds/hqdefault.jpg',
    videoTitle: 'How To Meal Prep | Honey Garlic Shrimp Meal Prep (Under 350 Cals)',
    tags: ['Non-Vegetarian', 'Pescatarian', 'Low-Calorie', 'High-Protein', 'Meal Prep'],
    ingredients: [
      { item: 'Jumbo Shrimp (peeled & deveined)', amount: '200g' },
      { item: 'Minced Garlic', amount: '1 tbsp' },
      { item: 'Honey', amount: '1 tsp' },
      { item: 'Low-Sodium Soy Sauce', amount: '1 tbsp' },
      { item: 'Snap Peas or Asparagus', amount: '1 cup' },
      { item: 'Olive Oil', amount: '1 tsp' }
    ],
    instructions: [
      'In a small bowl, whisk honey, minced garlic, soy sauce, and 1 tsp water.',
      'Heat olive oil in a skillet over high heat. Add shrimp and snap peas; sear for 2 minutes on each side.',
      'Pour garlic sauce over shrimp; toss for 1-2 minutes until sauce bubbles into a sticky glaze and shrimp turn pink and opaque.',
      'Remove immediately from heat to prevent overcooking. Serve with brown rice or cauliflower rice.'
    ]
  },
  {
    title: 'Egg White & Spinach Protein-Packed Frittata',
    dietaryType: 'Non-Vegetarian',
    mealType: 'Breakfast',
    description: 'Clean, macro-optimized breakfast bake with egg whites, baby spinach, cherry tomatoes, and reduced-fat feta.',
    prepTimeMinutes: 8,
    cookTimeMinutes: 20,
    servings: 2,
    calories: 220,
    protein: 32,
    carbs: 6,
    fats: 7,
    fiber: 2,
    youtubeId: 'CBuJHRHP6ic',
    videoUrl: 'https://www.youtube.com/watch?v=CBuJHRHP6ic',
    thumbnailUrl: 'https://img.youtube.com/vi/CBuJHRHP6ic/hqdefault.jpg',
    videoTitle: 'EGG WHITE FRITTATA with SPINACH | Protein Packed Meal Prep!',
    tags: ['Non-Vegetarian', 'Breakfast', 'High-Protein', 'Low-Carb', 'Keto', 'Meal Prep'],
    ingredients: [
      { item: 'Liquid Egg Whites', amount: '1.5 cups (360ml)' },
      { item: 'Whole Eggs', amount: '2 large' },
      { item: 'Baby Spinach', amount: '2 cups' },
      { item: 'Cherry Tomatoes (halved)', amount: '1/2 cup' },
      { item: 'Crumbled Feta or Goat Cheese', amount: '30g' },
      { item: 'Salt, Pepper, Italian Herbs', amount: '1/2 tsp each' }
    ],
    instructions: [
      'Preheat oven to 350°F (175°C).',
      'In an oven-safe skillet or pie dish, sauté spinach and tomatoes for 2 minutes until wilted.',
      'Whisk whole eggs and egg whites with salt, pepper, and Italian herbs.',
      'Pour egg mixture over veggies, sprinkle crumbled feta on top.',
      'Bake for 18-20 minutes until center is completely set and edges are golden. Slice into portions!'
    ]
  },
  {
    title: 'Garlic Butter Sautéed Shrimp & Zucchini Noodles',
    dietaryType: 'Non-Vegetarian',
    mealType: 'Dinner',
    description: 'Quick 10-minute high-protein dinner with seared garlic butter shrimp served over spiralized zucchini noodles.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 7,
    servings: 1,
    calories: 290,
    protein: 42,
    carbs: 4,
    fats: 12,
    fiber: 2,
    youtubeId: 'BqV4EtBSxYY',
    videoUrl: 'https://www.youtube.com/watch?v=BqV4EtBSxYY',
    thumbnailUrl: 'https://img.youtube.com/vi/BqV4EtBSxYY/hqdefault.jpg',
    videoTitle: 'Garlic Butter Shrimp Recipe | Shrimp in Garlic Butter Sauce',
    tags: ['Non-Vegetarian', 'Keto', 'Low-Carb', 'High-Protein', 'Fast-Dinner'],
    ingredients: [
      { item: 'Shrimp (peeled & deveined)', amount: '200g' },
      { item: 'Butter / Ghee', amount: '1 tbsp (14g)' },
      { item: 'Fresh Minced Garlic', amount: '4 cloves' },
      { item: 'Lemon Juice & Zest', amount: '1 tbsp' },
      { item: 'Fresh Parsley & Red Pepper Flakes', amount: 'to taste' },
      { item: 'Zucchini Noodles (zoodles)', amount: '2 cups' }
    ],
    instructions: [
      'Melt butter in a large skillet over medium-high heat. Add minced garlic and red pepper flakes; sauté for 30 seconds until aromatic.',
      'Add shrimp in a single layer and cook for 2 minutes per side until pink.',
      'Add zucchini noodles and lemon juice; toss for 1-2 minutes until noodles are tender-crisp.',
      'Garnish with fresh parsley and serve hot.'
    ]
  }
];

export const seedRecipes = async () => {
  try {
    let count = 0;
    for (const r of initialRecipes) {
      await Recipe.findOneAndUpdate(
        { title: r.title },
        { $set: r },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      count++;
    }
    console.log(`[Seed] Seeded/Updated ${count} diet-friendly cooking recipes with embedded YouTube videos.`);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed recipes: ${error.message}`);
  }
};

if (process.argv[1]?.endsWith('seedRecipes.js')) {
  mongoose
    .connect(ENV.MONGODB_URI)
    .then(async () => {
      console.log('[Seed Runner] Connected to MongoDB');
      await seedRecipes();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Runner] Error:', err);
      process.exit(1);
    });
}
