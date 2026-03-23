"use client"

import { cn } from "@/lib/utils"

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-16 z-30 bg-background border-b-2 border-foreground">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border-2 border-foreground transition-all whitespace-nowrap",
              activeCategory === category
                ? "bg-foreground text-background"
                : "bg-card text-foreground hover:bg-muted"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
