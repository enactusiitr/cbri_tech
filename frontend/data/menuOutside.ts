// Tazanya Menu — CBRI Outside Campus (100% Veg)

import type { MenuItemData } from "./menuInside"

export const menuOutsideCategories = [
  "Fresh N Lime", "Treats", "Lassi N Shakes", "Desserts",
  "Sandwiches", "Pizza", "Pasta", "Maggi", "Patties"
]

export const menuOutside: MenuItemData[] = [
  // --- FRESH N LIME ---
  {
    id: "out-shikanji", name: "Shikanji", description: "Zesty lemon refresher",
    price: 40, image: "/images/menu/food-items/shikanji.webp", category: "Fresh N Lime", tags: ["Popular"], popular: true,
  },
  {
    id: "out-lemon-ice-tea", name: "Lemon Ice Tea", description: "Chilled lemon iced tea",
    price: 50, image: "/images/menu/food-items/lemon-ice-tea.webp", category: "Fresh N Lime", tags: [],
  },
  {
    id: "out-fresh-mint-lime-soda", name: "Fresh Mint Lime Soda", description: "Mint infused sparkling limeade",
    price: 50, image: "/images/menu/food-items/lime-soda.webp", category: "Fresh N Lime", tags: [],
  },
  {
    id: "out-mojito", name: "Mojito", description: "Classic mint lime cooler",
    price: 60, image: "/images/menu/food-items/apple-mojito.webp", category: "Fresh N Lime", tags: [],
  },
  {
    id: "out-apple-mojito", name: "Apple Mojito", description: "Refreshing apple-infused mint cooler",
    price: 70, image: "/images/menu/food-items/apple-mojito.webp", category: "Fresh N Lime", tags: [],
  },
  {
    id: "out-pineapple-mojito", name: "Pineapple Mojito", description: "Tropical pineapple mint cooler",
    price: 70, image: "/images/menu/food-items/pineapple-mojito.webp", category: "Fresh N Lime", tags: [],
  },
  {
    id: "out-watermelon-mojito", name: "Watermelon Mojito", description: "Fresh watermelon mint cooler",
    price: 70, image: "/images/menu/food-items/watermelon-mojito.webp", category: "Fresh N Lime", tags: [],
  },
  {
    id: "out-butterfly-purple-mojito", name: "Butterfly Purple Mojito", description: "Vibrant butterfly pea flower cooler",
    price: 70, image: "/images/menu/food-items/apple-mojito.webp", category: "Fresh N Lime", tags: ["Popular"], popular: true,
  },

  // --- TREATS ---
  {
    id: "out-spring-roll", name: "Spring Roll", description: "Vegetable Stuffing",
    price: 50, prices: [{ label: "Half", price: 50 }, { label: "Full", price: 90 }],
    image: "/images/menu/food-items/cigar-roll.webp", category: "Treats", tags: ["Popular"], popular: true,
  },
  {
    id: "out-cigar-roll", name: "Cigar Roll", description: "5 pcs crispy rolled treats",
    price: 90, image: "/images/menu/food-items/cigar-roll.webp", category: "Treats", tags: [],
  },
  {
    id: "out-french-fries", name: "French Fries", description: "Crispy salted fries",
    price: 70, image: "/images/menu/french-fries.webp", category: "Treats", tags: [],
  },
  {
    id: "out-veggie-fingers", name: "Veggie Fingers", description: "6 pcs crunchy fingers",
    price: 80, image: "/images/menu/food-items/veggie-finger.webp", category: "Treats", tags: [],
  },
  {
    id: "out-peanut-chat", name: "Peanut Chat", description: "Spiced peanut street snack",
    price: 60, image: "/images/menu/food-items/peanut-chat.webp", category: "Treats", tags: [],
  },
  {
    id: "out-dahi-ke-shole", name: "Dahi ke Shole", description: "Spiced chickpeas with yogurt",
    price: 60, prices: [{ label: "Half", price: 60 }, { label: "Full", price: 100 }],
    image: "/images/menu/food-items/brownie-shake.webp", category: "Treats", tags: [],
  },
  {
    id: "out-steamed-momos", name: "Steamed Momos", description: "Vegetable stuffing steamed momos",
    price: 40, prices: [{ label: "6 pcs", price: 40 }, { label: "12 pcs", price: 70 }],
    image: "/images/menu/food-items/kurkure-momos.webp", category: "Treats", tags: ["Spicy", "Popular"], popular: true,
  },
  {
    id: "out-kurkure-momos", name: "Kurkure Momos", description: "6 pcs crispy outer layer momos",
    price: 90, image: "/images/menu/food-items/kurkure-momos.webp", category: "Treats", tags: ["Spicy"],
  },

  // --- LASSI N SHAKES ---
  {
    id: "out-lassi", name: "Lassi", description: "Sweet cultured buttermilk",
    price: 45, image: "/images/menu/food-items/lassi.webp", category: "Lassi N Shakes", tags: [],
  },
  {
    id: "out-mango-lassi", name: "Mango Lassi (Seasonal)", description: "Rich mango infused lassi",
    price: 55, image: "/images/menu/food-items/mangolassi.webp", category: "Lassi N Shakes", tags: ["Popular"], popular: true,
  },
  {
    id: "out-cold-coffee", name: "Cold Coffee", description: "Creamy iced coffee",
    price: 70, prices: [{ label: "Regular", price: 70 }, { label: "With Ice Cream", price: 95 }],
    image: "/images/menu/food-items/cold-coffee-1.jpg.webp", category: "Lassi N Shakes", tags: [],
  },
  {
    id: "out-oreo-shake", name: "Oreo Shake", description: "Thick Oreo cookie milkshake",
    price: 90, image: "/images/menu/food-items/oreo-shake.webp", category: "Lassi N Shakes", tags: ["Popular"], popular: true,
  },
  {
    id: "out-pan-shake", name: "Pan Shake", description: "Unique pan-flavoured shake",
    price: 100, image: "/images/menu/food-items/pan-shake.webp", category: "Lassi N Shakes", tags: [],
  },
  {
    id: "out-brownie-shake", name: "Brownie Shake", description: "Rich brownie blended milkshake",
    price: 120, image: "/images/menu/food-items/brownie-shake.webp", category: "Lassi N Shakes", tags: [],
  },
  {
    id: "out-protein-rich-shake", name: "Protein Rich Shake", description: "Power-packed protein milkshake",
    price: 120, image: "/images/menu/food-items/protein-rich-shake.webp", category: "Lassi N Shakes", tags: [],
  },

  // --- DESSERTS ---
  {
    id: "out-hot-coffee", name: "Hot Coffee", description: "Hot brewed coffee",
    price: 20, image: "/images/menu/food-items/hot-coffee.webp", category: "Desserts", tags: [],
  },
  {
    id: "out-brownie-shot", name: "Brownie Shot", description: "Mini brownie indulgence",
    price: 50, image: "/images/menu/food-items/brownie-shot.webp", category: "Desserts", tags: [],
  },
  {
    id: "out-walnut-brownie", name: "Walnut Brownie", description: "Rich chocolate walnut brownie",
    price: 70, image: "/images/menu/food-items/walnut-brownie.webp", category: "Desserts", tags: ["Popular"], popular: true,
  },
  {
    id: "out-brownie-ice-cream", name: "Brownie with Ice Cream", description: "Warm brownie topped with ice cream",
    price: 120, image: "/images/menu/food-items/brownie-with-ice-cream.webp", category: "Desserts", tags: [],
  },

  // --- SANDWICHES ---
  {
    id: "out-cheese-corn-sandwich", name: "Cheese Corn Sandwich", description: "Grilled with AMUL butter, cheese and corn",
    price: 120, image: "/images/menu/food-items/cheese-corn-sandwich.webp", category: "Sandwiches", tags: ["Popular"], popular: true,
  },
  {
    id: "out-paneer-sandwich", name: "Paneer Sandwich", description: "Spiced paneer filling in AMUL butter",
    price: 120, image: "/images/menu/food-items/paneer-makhani-sandwich.webp", category: "Sandwiches", tags: [],
  },
  {
    id: "out-aloo-sandwich", name: "Aloo Sandwich", description: "Classic spiced potato mash",
    price: 100, image: "/images/menu/food-items/aloo-sandwich.webp", category: "Sandwiches", tags: [],
  },
  {
    id: "out-paneer-makhani-sandwich", name: "Paneer Makhani Sandwich", description: "Rich paneer makhani stuffed and grilled",
    price: 190, image: "/images/menu/food-items/paneer-makhani-sandwich.webp", category: "Sandwiches", tags: [],
  },
  {
    id: "out-pizza-pasta-sandwich", name: "Pizza Pasta Sandwich", description: "Fusion pizza-pasta stuffed sandwich",
    price: 210, image: "/images/menu/food-items/pizza-pasta-sandwich.webp", category: "Sandwiches", tags: [],
  },
  {
    id: "out-mumbaiya-sandwich", name: "Mumbaiya Sandwich", description: "Mumbai-style loaded sandwich",
    price: 180, image: "/images/menu/food-items/mumbaiya-sandwich.webp", category: "Sandwiches", tags: ["Spicy"],
  },

  // --- PIZZA ---
  {
    id: "out-veg-pizza", name: "Veg Pizza", description: "Classic vegetable loaded pizza",
    price: 100, image: "/images/menu/food-items/veg-pizza.webp", category: "Pizza", tags: [],
  },
  {
    id: "out-margherita-pizza", name: "Margherita Pizza", description: "Fresh mozzarella and tomato basil",
    price: 140, image: "/images/menu/food-items/cheese-pizza.webp", category: "Pizza", tags: ["Popular"], popular: true,
  },
  {
    id: "out-veg-cheese-pizza", name: "Veg Cheese Pizza", description: "Cheese loaded veggie pizza",
    price: 160, image: "/images/menu/food-items/cheese-pizza.webp", category: "Pizza", tags: [],
  },
  {
    id: "out-farm-house-pizza", name: "Farm House Pizza", description: "Farm-fresh veggies with cheese",
    price: 180, image: "/images/menu/food-items/farm-house-pizza.webp", category: "Pizza", tags: [],
  },

  // --- PASTA ---
  {
    id: "out-pink-sauce-pasta", name: "Pink Sauce Pasta", description: "Creamy pink Italian comfort pasta",
    price: 120, image: "/images/menu/food-items/pink-sauce-pasta.webp", category: "Pasta", tags: ["Popular"], popular: true,
  },
  {
    id: "out-white-sauce-pasta", name: "White Sauce Pasta", description: "Classic white béchamel pasta",
    price: 120, image: "/images/menu/food-items/white-sauce-pasta.webp", category: "Pasta", tags: [],
  },
  {
    id: "out-red-sauce-pasta", name: "Red Sauce Pasta", description: "Tangy tomato-based pasta",
    price: 120, image: "/images/menu/food-items/red-sauce-pasta.webp", category: "Pasta", tags: [],
  },

  // --- MAGGI ---
  {
    id: "out-plain-maggi", name: "Plain Maggi", description: "Classic butter-tossed noodles",
    price: 40, image: "/images/menu/food-items/butter-maggi.webp", category: "Maggi", tags: ["Popular"], popular: true,
  },
  {
    id: "out-vegetable-maggi", name: "Vegetable Maggi", description: "Maggi loaded with veggies",
    price: 50, image: "/images/menu/food-items/butter-maggi.webp", category: "Maggi", tags: [],
  },
  {
    id: "out-cheese-maggi", name: "Cheese Maggi", description: "Maggi loaded with melted cheese",
    price: 60, image: "/images/menu/food-items/cheese-maggi.webp", category: "Maggi", tags: [],
  },

  // --- PATTIES ---
  {
    id: "out-aloo-patties", name: "Aloo Patties", description: "Crispy golden puff filled with potatoes",
    price: 20, image: "/images/menu/food-items/aloo-patties-with-cheese.webp", category: "Patties", tags: ["Popular"], popular: true,
  },
  {
    id: "out-aloo-cheese-patties", name: "Aloo Patties with Cheese", description: "Potato puff topped with cheese",
    price: 40, image: "/images/menu/food-items/aloo-patties-with-cheese.webp", category: "Patties", tags: [],
  },
  {
    id: "out-cheese-corn-patties", name: "Cheese Corn Patties", description: "Puff loaded with cheese and corn",
    price: 40, image: "/images/menu/food-items/cheese-corn-patties.webp", category: "Patties", tags: [],
  },
  {
    id: "out-paneer-patties", name: "Paneer Patties", description: "Flaky puff filled with spiced paneer",
    price: 40, image: "/images/menu/food-items/paneer-patties.webp", category: "Patties", tags: [],
  },
  {
    id: "out-pizza-patties", name: "Pizza Patties", description: "Pizza-flavoured stuffed puff",
    price: 50, image: "/images/menu/food-items/pizza-patties.webp", category: "Patties", tags: [],
  },
]
