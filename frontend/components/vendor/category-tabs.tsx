"use client"

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
    <div className="sticky top-16 z-30 bg-background border-b border-border/60 relative">
      {/* Edge fade overlays */}
      <div className="filter-bar-fade-left" />
      <div className="filter-bar-fade-right" />

      <div className="filter-bar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={
              activeCategory === category
                ? "filter-chip-active"
                : "filter-chip"
            }
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
