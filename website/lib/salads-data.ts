export interface Salad {
  id: string
  name: string
  description: string
  ingredients: string[]
  image: string
  nutrition: {
    half: {
      calories: number
      protein: number
      fiber: number
      carbs: number
      fat: number
    }
    full: {
      calories: number
      protein: number
      fiber: number
      carbs: number
      fat: number
    }
  }
  tags: string[]
}

export const salads: Salad[] = [
  {
    id: "classic-caesar",
    name: "Classic Caesar",
    description:
      "Crisp romaine lettuce tossed with homemade caesar dressing, crunchy croutons, and shaved parmesan cheese.",
    ingredients: ["Romaine lettuce", "Croutons", "Parmesan cheese", "Caesar dressing", "Black pepper"],
    image: "/images/classic-caesar.jpg",
    nutrition: {
      half: { calories: 180, protein: 8, fiber: 4, carbs: 15, fat: 10 },
      full: { calories: 270, protein: 12, fiber: 6, carbs: 22, fat: 15 },
    },
    tags: ["Popular", "Classic"],
  },
  {
    id: "mediterranean-quinoa",
    name: "Mediterranean Quinoa",
    description:
      "Fluffy quinoa mixed with cucumber, cherry tomatoes, kalamata olives, and crumbled feta cheese with lemon herb dressing.",
    ingredients: [
      "Quinoa",
      "Cucumber",
      "Cherry tomatoes",
      "Kalamata olives",
      "Feta cheese",
      "Red onion",
      "Lemon herb dressing",
    ],
    image: "/images/mediterranean-quinoa.jpg",
    nutrition: {
      half: { calories: 220, protein: 10, fiber: 6, carbs: 28, fat: 8 },
      full: { calories: 330, protein: 15, fiber: 9, carbs: 42, fat: 12 },
    },
    tags: ["High Protein", "Filling"],
  },
  {
    id: "thai-peanut-crunch",
    name: "Thai Peanut Crunch",
    description:
      "Shredded cabbage and carrots with edamame, topped with crushed peanuts and a creamy Thai peanut dressing.",
    ingredients: [
      "Napa cabbage",
      "Red cabbage",
      "Carrots",
      "Edamame",
      "Crushed peanuts",
      "Cilantro",
      "Thai peanut dressing",
    ],
    image: "/images/thai-peanut-crunch.jpg",
    nutrition: {
      half: { calories: 240, protein: 9, fiber: 5, carbs: 20, fat: 14 },
      full: { calories: 360, protein: 14, fiber: 8, carbs: 30, fat: 21 },
    },
    tags: ["Crunchy", "Asian"],
  },
  {
    id: "garden-fresh",
    name: "Garden Fresh",
    description:
      "A light and refreshing mix of seasonal greens, cherry tomatoes, cucumber, and carrots with a light vinaigrette.",
    ingredients: ["Mixed greens", "Cherry tomatoes", "Cucumber", "Carrots", "Bell peppers", "Light vinaigrette"],
    image: "/images/garden-fresh.jpg",
    nutrition: {
      half: { calories: 120, protein: 4, fiber: 5, carbs: 14, fat: 5 },
      full: { calories: 180, protein: 6, fiber: 8, carbs: 21, fat: 8 },
    },
    tags: ["Low Calorie", "Light"],
  },
  {
    id: "spinach-berry",
    name: "Spinach & Berry",
    description:
      "Baby spinach topped with fresh strawberries, blueberries, candied walnuts, and a raspberry balsamic dressing.",
    ingredients: [
      "Baby spinach",
      "Strawberries",
      "Blueberries",
      "Candied walnuts",
      "Goat cheese",
      "Raspberry balsamic",
    ],
    image: "/images/spinach-berry.jpg",
    nutrition: {
      half: { calories: 160, protein: 6, fiber: 4, carbs: 18, fat: 8 },
      full: { calories: 240, protein: 9, fiber: 6, carbs: 27, fat: 12 },
    },
    tags: ["Sweet", "Antioxidant"],
  },
  {
    id: "mexican-fiesta",
    name: "Mexican Fiesta",
    description:
      "Hearty black beans, sweet corn, creamy avocado, and jalapeños on a bed of romaine with chipotle lime dressing.",
    ingredients: [
      "Romaine lettuce",
      "Black beans",
      "Sweet corn",
      "Avocado",
      "Jalapeños",
      "Red onion",
      "Chipotle lime dressing",
    ],
    image: "/images/mexican-fiesta.jpg",
    nutrition: {
      half: { calories: 230, protein: 11, fiber: 7, carbs: 26, fat: 10 },
      full: { calories: 345, protein: 17, fiber: 11, carbs: 39, fat: 15 },
    },
    tags: ["Spicy", "High Fiber"],
  },
  {
    id: "asian-sesame",
    name: "Asian Sesame",
    description:
      "Crisp napa cabbage with mandarin oranges, toasted almonds, and crispy wonton strips in a sesame ginger dressing.",
    ingredients: [
      "Napa cabbage",
      "Mandarin oranges",
      "Toasted almonds",
      "Wonton strips",
      "Green onions",
      "Sesame ginger dressing",
    ],
    image: "/images/asian-sesame.jpg",
    nutrition: {
      half: { calories: 200, protein: 8, fiber: 4, carbs: 22, fat: 10 },
      full: { calories: 300, protein: 12, fiber: 6, carbs: 33, fat: 15 },
    },
    tags: ["Crunchy", "Citrus"],
  },
  {
    id: "greek-delight",
    name: "Greek Delight",
    description:
      "Classic Greek flavors with cucumber, tomatoes, red onion, kalamata olives, and feta cheese with oregano dressing.",
    ingredients: [
      "Romaine lettuce",
      "Cucumber",
      "Tomatoes",
      "Red onion",
      "Kalamata olives",
      "Feta cheese",
      "Oregano dressing",
    ],
    image: "/images/greek-delight.jpg",
    nutrition: {
      half: { calories: 190, protein: 9, fiber: 3, carbs: 12, fat: 13 },
      full: { calories: 285, protein: 14, fiber: 5, carbs: 18, fat: 20 },
    },
    tags: ["Classic", "Mediterranean"],
  },
  {
    id: "roasted-beetroot",
    name: "Roasted Beetroot",
    description: "Sweet roasted beetroot on a bed of peppery arugula with creamy goat cheese and candied walnuts.",
    ingredients: ["Roasted beetroot", "Arugula", "Goat cheese", "Candied walnuts", "Balsamic glaze"],
    image: "/images/roasted-beetroot.jpg",
    nutrition: {
      half: { calories: 170, protein: 7, fiber: 5, carbs: 16, fat: 9 },
      full: { calories: 255, protein: 11, fiber: 8, carbs: 24, fat: 14 },
    },
    tags: ["Earthy", "Gourmet"],
  },
  {
    id: "protein-power",
    name: "Protein Power",
    description:
      "A protein-packed bowl with chickpeas, quinoa, edamame, and marinated tofu on mixed greens with tahini dressing.",
    ingredients: [
      "Mixed greens",
      "Chickpeas",
      "Quinoa",
      "Edamame",
      "Marinated tofu",
      "Sunflower seeds",
      "Tahini dressing",
    ],
    image: "/images/protein-power.jpg",
    nutrition: {
      half: { calories: 260, protein: 15, fiber: 6, carbs: 24, fat: 12 },
      full: { calories: 390, protein: 23, fiber: 9, carbs: 36, fat: 18 },
    },
    tags: ["High Protein", "Fitness"],
  },
]

export const pricing = {
  half: { weight: "200g", price: 80 },
  full: { weight: "300g", price: 120 },
}
