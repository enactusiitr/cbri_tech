"use client"

import { Search } from "lucide-react"
import { useState } from "react"
import { categories } from "@/lib/data"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SearchBar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="px-4 py-4 space-y-3 max-w-lg mx-auto">
      {/* Search Input */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 bg-card rounded-xl border-2 border-foreground transition-all",
          isFocused && "poster-shadow-sm"
        )}
      >
        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search for food or restaurants..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
        />
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border-2 border-foreground transition-all whitespace-nowrap",
              selectedCategory === category.id
                ? "bg-foreground text-background"
                : "bg-card text-foreground hover:bg-muted"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
