// Campus Bites - Data Layer

export interface Vendor {
  id: string
  name: string
  tagline: string
  image: string
  coverImage: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  cuisine: string[]
  featured: boolean
  isOpen: boolean
}

export interface MenuItem {
  id: string
  vendorId: string
  name: string
  description: string
  price: number
  prices?: { label: string; price: number }[]
  image: string
  category: string
  tags: string[]
  popular?: boolean
  customizations?: Customization[]
}

export interface Customization {
  id: string
  name: string
  type: "single" | "multiple"
  required: boolean
  options: CustomizationOption[]
}

export interface CustomizationOption {
  id: string
  name: string
  price: number
}

export interface CartItem {
  id: string
  menuItem: MenuItem
  variant?: string
  quantity: number
  selectedCustomizations: SelectedCustomization[]
  specialInstructions?: string
}

export interface SelectedCustomization {
  customizationId: string
  optionIds: string[]
}

export interface Order {
  id: string
  items: CartItem[]
  vendor: Vendor
  status: "preparing" | "ready" | "picked-up" | "on-the-way" | "delivered"
  subtotal: number
  deliveryFee: number
  total: number
  estimatedDelivery: string
  placedAt: string
  deliveryAddress: string
  customer_name?: string
  customer_phone?: string
  customer_address?: string
}

export interface Category {
  id: string
  name: string
  icon: string
}

export const STORES = ["inside", "outside"] as const
export type StoreId = (typeof STORES)[number]
export type StoreSlug = "cbri-inside" | "cbri-outside"

export const storeSlugMap: Record<StoreId, StoreSlug> = {
  inside: "cbri-inside",
  outside: "cbri-outside",
}

export const slugStoreMap: Record<StoreSlug, StoreId> = {
  "cbri-inside": "inside",
  "cbri-outside": "outside",
}

export function getStoreLabel(store: StoreId): string {
  return store === "inside" ? "CBRI Inside Campus" : "CBRI Outside Campus"
}

export const storeVendorMap: Record<StoreId, string[]> = {
  inside: ["cbri"],
  outside: ["cbri"],
}

export function isValidStore(value: string | null): value is StoreId {
  return value !== null && STORES.includes(value as StoreId)
}

export function isValidStoreSlug(value: string): value is StoreSlug {
  return value in slugStoreMap
}

// Categories
export const categories: Category[] = [
  { id: "drinks", name: "Drinks", icon: "coffee" },
  { id: "burger", name: "Burger", icon: "beef" },
  { id: "snacks-pizza", name: "Snacks & Pizza", icon: "pizza" },
  { id: "maggi", name: "Maggi", icon: "soup" },
  { id: "sandwich", name: "Sandwich", icon: "sandwich" },
  { id: "patties", name: "Patties", icon: "wrap" },
  { id: "paratha", name: "Paratha", icon: "grid" },
]

// Vendors
export const vendors: Vendor[] = [
  {
    id: "cbri",
    name: "CBRI Canteen",
    tagline: "Always fresh, always fast.",
    image: "/images/vendors/dosa-express.jpg",
    coverImage: "/images/vendors/dosa-express-cover.jpg",
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: "10-15 min",
    deliveryFee: 20,
    cuisine: ["Indian", "Snacks", "Drinks"],
    featured: true,
    isOpen: true,
  }
]

// Menu Items
export const menuItems: MenuItem[] = [
  // --- DRINKS ---
  {
    id: "tea", vendorId: "cbri", name: "Tea", description: "Hot freshly brewed tea",
    price: 12, prices: [{label: "Half", price: 12}, {label: "Full", price: 20}],
    image: "/images/menu/filter-coffee.jpg", category: "Drinks", tags: ["Popular"], popular: true,
  },
  {
    id: "coffee", vendorId: "cbri", name: "Coffee", description: "Hot brewed coffee",
    price: 20, image: "/images/menu/filter-coffee.jpg", category: "Drinks", tags: [],
  },
  {
    id: "cold-coffee", vendorId: "cbri", name: "Cold Coffee", description: "Creamy iced coffee",
    price: 50, image: "/images/menu/chocolate-shake.jpg", category: "Drinks", tags: [],
  },
  {
    id: "lassi", vendorId: "cbri", name: "Lassi", description: "Sweet active cultured buttermilk",
    price: 45, image: "/images/menu/chocolate-shake.jpg", category: "Drinks", tags: ["Healthy"],
  },
  {
    id: "mango-lassi", vendorId: "cbri", name: "Mango Lassi (Seasonal)", description: "Rich mango infused lassi",
    price: 55, image: "/images/menu/chocolate-shake.jpg", category: "Drinks", tags: ["Popular"], popular: true,
  },
  {
    id: "chach", vendorId: "cbri", name: "Chach", description: "Spiced Indian buttermilk",
    price: 15, image: "/images/menu/chocolate-shake.jpg", category: "Drinks", tags: ["Vegan"],
  },
  {
    id: "fresh-mint-lime-soda", vendorId: "cbri", name: "Fresh Mint Lime Soda", description: "Mint infused sparkling limeade",
    price: 50, image: "/images/menu/chocolate-shake.jpg", category: "Drinks", tags: [],
  },
  {
    id: "apple-mojito", vendorId: "cbri", name: "Apple Mojito", description: "Refreshing apple-infused mint cooler",
    price: 70, image: "/images/menu/chocolate-shake.jpg", category: "Drinks", tags: [],
  },

  // --- BURGER ---
  {
    id: "cheeseburger", vendorId: "cbri", name: "Cheeseburger", description: "Classic burger stuffed with cheese",
    price: 60, image: "/images/menu/classic-smash.jpg", category: "Burger", tags: ["Popular"], popular: true,
  },
  {
    id: "veg-burger", vendorId: "cbri", name: "Veg Burger", description: "Crispy vegetable patty in a sesame bun",
    price: 45, image: "/images/menu/bacon-bbq.jpg", category: "Burger", tags: ["Vegan"],
  },

  // --- SNACKS & PIZZA ---
  {
    id: "spring-roll", vendorId: "cbri", name: "Spring Roll", description: "Vegetable Stuffing",
    price: 30, prices: [{label: "Half", price: 30}, {label: "Full", price: 60}],
    image: "/images/menu/spring-rolls.jpg", category: "Snacks & Pizza", tags: ["Vegan", "Popular"], popular: true,
  },
  {
    id: "french-fries", vendorId: "cbri", name: "French Fries", description: "Crispy salted fries",
    price: 70, image: "/images/menu/loaded-fries.jpg", category: "Snacks & Pizza", tags: ["Vegan"],
  },
  {
    id: "veggie-fingers", vendorId: "cbri", name: "Veggie Fingers", description: "6 pcs crunchy fingers",
    price: 80, image: "/images/menu/loaded-fries.jpg", category: "Snacks & Pizza", tags: [],
  },
  {
    id: "bun-maska", vendorId: "cbri", name: "Bun Maska", description: "Classic soft bun with butter",
    price: 30, image: "/images/menu/garlic-bread.jpg", category: "Snacks & Pizza", tags: [],
  },
  {
    id: "momos", vendorId: "cbri", name: "Momos", description: "Vegetable Stuffing steamed momos",
    price: 30, prices: [{label: "5 pcs", price: 30}, {label: "10 pcs", price: 60}],
    image: "/images/menu/dim-sum.jpg", category: "Snacks & Pizza", tags: ["Spicy", "Popular"], popular: true,
  },
  {
    id: "kurkure-momos", vendorId: "cbri", name: "Kurkure Momos", description: "Crispy outer layer momos",
    price: 50, prices: [{label: "5 pcs", price: 50}, {label: "10 pcs", price: 90}],
    image: "/images/menu/dim-sum.jpg", category: "Snacks & Pizza", tags: ["Spicy"],
  },
  {
    id: "veg-pizza", vendorId: "cbri", name: "Veg Pizza", description: "Classic vegetable loaded pizza",
    price: 90, image: "/images/menu/margherita.jpg", category: "Snacks & Pizza", tags: [],
  },
  {
    id: "cheese-pizza", vendorId: "cbri", name: "Cheese Pizza", description: "Oozing melted cheese pizza",
    price: 150, image: "/images/menu/pepperoni.jpg", category: "Snacks & Pizza", tags: ["Popular"], popular: true,
  },

  // --- MAGGI ---
  {
    id: "dry-maggi", vendorId: "cbri", name: "Dry Maggi", description: "Classic spiced dry noodles",
    price: 35, image: "/images/menu/pad-thai.jpg", category: "Maggi", tags: ["Popular"], popular: true,
  },
  {
    id: "soup-maggi", vendorId: "cbri", name: "Soup Maggi", description: "Noodles served in hot spiced broth",
    price: 35, image: "/images/menu/kung-pao-chicken.jpg", category: "Maggi", tags: [],
  },
  {
    id: "cheese-maggi", vendorId: "cbri", name: "Cheese Maggi", description: "Maggi loaded with melted cheese",
    price: 55, image: "/images/menu/pad-thai.jpg", category: "Maggi", tags: [],
  },
  {
    id: "butter-maggi", vendorId: "cbri", name: "Butter Maggi", description: "Maggi tossed in rich butter",
    price: 45, image: "/images/menu/pad-thai.jpg", category: "Maggi", tags: [],
  },

  // --- SANDWICH ---
  {
    id: "cheese-corn-sandwich", vendorId: "cbri", name: "Cheese Corn Sandwich", description: "Grilled sandwich with melting cheese and corn",
    price: 110, image: "/images/menu/garlic-bread.jpg", category: "Sandwich", tags: ["Popular"], popular: true,
  },
  {
    id: "paneer-sandwich", vendorId: "cbri", name: "Paneer Sandwich", description: "Spiced paneer filling",
    price: 110, image: "/images/menu/garlic-bread.jpg", category: "Sandwich", tags: [],
  },
  {
    id: "aloo-sandwich", vendorId: "cbri", name: "Aloo Sandwich", description: "Classic spiced potato mash",
    price: 90, image: "/images/menu/falafel-wrap.jpg", category: "Sandwich", tags: [],
  },
  {
    id: "paneer-makhani-sandwich", vendorId: "cbri", name: "Paneer Makhani Sandwich", description: "Rich paneer makhani stuffed and grilled",
    price: 180, image: "/images/menu/chicken-shawarma.jpg", category: "Sandwich", tags: ["Spicy"],
  },

  // --- PATTIES ---
  {
    id: "aloo-patty", vendorId: "cbri", name: "Aloo Patty", description: "Crispy golden puff filled with potatoes",
    price: 20, image: "/images/menu/spring-rolls.jpg", category: "Patties", tags: ["Popular"], popular: true,
  },
  {
    id: "cheese-corn-patty", vendorId: "cbri", name: "Cheese Corn Patty", description: "Puff loaded with cheese and corn",
    price: 35, image: "/images/menu/spring-rolls.jpg", category: "Patties", tags: [],
  },
  {
    id: "paneer-patty", vendorId: "cbri", name: "Paneer Patty", description: "Flaky puff filled with spiced paneer",
    price: 35, image: "/images/menu/spring-rolls.jpg", category: "Patties", tags: [],
  },

  // --- PARATHA ---
  {
    id: "aloo-paratha", vendorId: "cbri", name: "Aloo Paratha", description: "Stuffed potato flatbread",
    price: 40, image: "/images/menu/masala-dosa.jpg", category: "Paratha", tags: ["Popular"], popular: true,
  },
  {
    id: "aloo-pyaz-paratha", vendorId: "cbri", name: "Aloo Pyaz Paratha", description: "Stuffed potato & onion flatbread",
    price: 40, image: "/images/menu/masala-dosa.jpg", category: "Paratha", tags: [],
  },
  {
    id: "paneer-paratha", vendorId: "cbri", name: "Paneer Paratha", description: "Cottage cheese stuffed flatbread",
    price: 65, image: "/images/menu/mysore-dosa.jpg", category: "Paratha", tags: [],
  },
  {
    id: "paneer-pyaz-paratha", vendorId: "cbri", name: "Paneer Pyaz Paratha", description: "Cottage cheese & onion flatbread",
    price: 55, image: "/images/menu/mysore-dosa.jpg", category: "Paratha", tags: [],
  },
  {
    id: "mix-paratha", vendorId: "cbri", name: "Mix Paratha", description: "Mixed veggies stuffed flatbread",
    price: 55, image: "/images/menu/masala-dosa.jpg", category: "Paratha", tags: [],
  },
  {
    id: "pyaz-paratha", vendorId: "cbri", name: "Pyaz Paratha", description: "Onion stuffed flatbread",
    price: 45, image: "/images/menu/masala-dosa.jpg", category: "Paratha", tags: [],
  },
  {
    id: "gobi-paratha", vendorId: "cbri", name: "Gobi Paratha", description: "Cauliflower stuffed flatbread",
    price: 45, image: "/images/menu/masala-dosa.jpg", category: "Paratha", tags: [],
  },
  {
    id: "gobi-pyaz-paratha", vendorId: "cbri", name: "Gobi Pyaz Paratha", description: "Cauliflower & onion flatbread",
    price: 45, image: "/images/menu/masala-dosa.jpg", category: "Paratha", tags: [],
  },
  {
    id: "plain-paratha", vendorId: "cbri", name: "Plain Paratha", description: "Classic layered flatbread",
    price: 25, image: "/images/menu/masala-dosa.jpg", category: "Paratha", tags: [],
  },
]

// Helper functions
export function getVendorsByStore(store: StoreId): Vendor[] {
  const vendorIds = new Set(storeVendorMap[store])
  return vendors.filter((vendor) => vendorIds.has(vendor.id))
}

export function getMenuItemsByStore(store: StoreId): MenuItem[] {
  const vendorIds = new Set(storeVendorMap[store])
  return menuItems.filter((item) => vendorIds.has(item.vendorId))
}

export function getVendorById(id: string, store?: StoreId): Vendor | undefined {
  if (store) {
    const vendorIds = new Set(storeVendorMap[store])
    if (!vendorIds.has(id)) return undefined
  }
  return vendors.find((v) => v.id === id)
}

export function getMenuItemsByVendor(vendorId: string, store?: StoreId): MenuItem[] {
  if (store) {
    const vendorIds = new Set(storeVendorMap[store])
    if (!vendorIds.has(vendorId)) return []
  }
  return menuItems.filter((item) => item.vendorId === vendorId)
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id)
}

export function getFeaturedVendors(store?: StoreId): Vendor[] {
  const source = store ? getVendorsByStore(store) : vendors
  return source.filter((v) => v.featured)
}

export function getPopularItems(store?: StoreId): MenuItem[] {
  const source = store ? getMenuItemsByStore(store) : menuItems
  return source.filter((item) => item.popular)
}

export function getMenuCategories(vendorId: string, store?: StoreId): string[] {
  const items = getMenuItemsByVendor(vendorId, store)
  return [...new Set(items.map((item) => item.category))]
}

export function calculateItemTotal(
  item: MenuItem,
  quantity: number,
  selectedCustomizations: SelectedCustomization[],
  variant?: string
): number {
  let basePrice = item.price
  if (variant && item.prices) {
    const match = item.prices.find(p => p.label === variant)
    if (match) basePrice = match.price
  }

  let total = basePrice * quantity

  if (item.customizations) {
    for (const selected of selectedCustomizations) {
      const customization = item.customizations.find((c) => c.id === selected.customizationId)
      if (customization) {
        for (const optionId of selected.optionIds) {
          const option = customization.options.find((o) => o.id === optionId)
          if (option) {
            total += option.price * quantity
          }
        }
      }
    }
  }

  return total
}
