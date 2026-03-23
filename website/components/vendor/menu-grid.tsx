"use client"

import type { MenuItem } from "@/lib/data"
import { MenuItemCard } from "./menu-item-card"

interface MenuGridProps {
  items: MenuItem[]
  activeCategory: string
  onSelectItem: (item: MenuItem) => void
  onQuickAdd: (item: MenuItem) => void
}

export function MenuGrid({
  items,
  activeCategory,
  onSelectItem,
  onQuickAdd,
}: MenuGridProps) {
  // Group items by category
  const itemsByCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  // Get categories in order
  const categories = Object.keys(itemsByCategory)

  return (
    <div className="px-4 py-4 space-y-8">
      {categories.map((category) => (
        <section
          key={category}
          id={`category-${category.toLowerCase().replace(/\s+/g, "-")}`}
          className={activeCategory !== category && activeCategory !== categories[0] ? "hidden" : ""}
        >
          <h3 className="text-lg font-black text-poster mb-3 flex items-center gap-2">
            {category}
            <span className="text-sm font-medium text-muted-foreground">
              ({itemsByCategory[category].length})
            </span>
          </h3>

          <div className="space-y-3">
            {itemsByCategory[category].map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
