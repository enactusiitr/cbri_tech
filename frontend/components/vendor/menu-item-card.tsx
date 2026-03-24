"use client"

import Image from "next/image"
import { Plus, Flame } from "lucide-react"
import type { MenuItem } from "@/lib/data"
import { cn } from "@/lib/utils"

interface MenuItemCardProps {
  item: MenuItem
  onSelect: (item: MenuItem) => void
  onQuickAdd: (item: MenuItem) => void
}

export function MenuItemCard({ item, onSelect, onQuickAdd }: MenuItemCardProps) {
  const hasCustomizations = item.customizations && item.customizations.length > 0
  const isSpicy = item.tags.includes("Spicy")
  const isVegan = item.tags.includes("Vegan")
  const isPopular = item.popular

  return (
    <div
      className="flex gap-3 p-3 bg-card rounded-xl border-2 border-foreground poster-shadow-sm cursor-pointer transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
      onClick={() => onSelect(item)}
    >
      {/* Image */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 border-foreground">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
        {isPopular && (
          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded">
            POPULAR
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-poster line-clamp-2">{item.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
              {item.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">Rs.{item.price}</span>
            {/* Tags */}
            <div className="flex items-center gap-1">
              {isSpicy && (
                <span className="flex items-center gap-0.5 text-secondary">
                  <Flame className="w-3 h-3" />
                </span>
              )}
              {isVegan && (
                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">
                  VEG
                </span>
              )}
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (hasCustomizations) {
                onSelect(item)
              } else {
                onQuickAdd(item)
              }
            }}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-foreground font-bold text-sm transition-all",
              "bg-primary text-primary-foreground hover:translate-x-0.5 hover:translate-y-0.5"
            )}
          >
            <Plus className="w-4 h-4" />
            ADD
          </button>
        </div>
      </div>
    </div>
  )
}
