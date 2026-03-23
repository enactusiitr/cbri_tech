"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import type { CartItem } from "@/lib/data"
import { calculateItemTotal } from "@/lib/data"
import { useCart } from "@/lib/cart-context"

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart()
  const total = calculateItemTotal(item.menuItem, item.quantity, item.selectedCustomizations, item.variant)

  // Get customization labels
  const customizationLabels: string[] = []
  if (item.menuItem.customizations) {
    for (const selected of item.selectedCustomizations) {
      const customization = item.menuItem.customizations.find(
        (c) => c.id === selected.customizationId
      )
      if (customization) {
        for (const optionId of selected.optionIds) {
          const option = customization.options.find((o) => o.id === optionId)
          if (option) {
            customizationLabels.push(option.name)
          }
        }
      }
    }
  }

  return (
    <div className="flex gap-3 p-3 bg-card rounded-xl border-2 border-foreground">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-foreground">
        <Image
          src={item.menuItem.image}
          alt={item.menuItem.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-poster truncate">
              {item.menuItem.name} {item.variant && <span className="text-muted-foreground text-sm font-medium">({item.variant})</span>}
            </h4>
            {customizationLabels.length > 0 && (
              <p className="text-xs text-muted-foreground truncate">
                {customizationLabels.join(", ")}
              </p>
            )}
            {item.specialInstructions && (
              <p className="text-xs text-muted-foreground italic truncate">
                Note: {item.specialInstructions}
              </p>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={() => removeItem(item.id)}
            className="p-1.5 text-muted-foreground hover:text-secondary transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 border-2 border-foreground rounded-lg">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1.5 hover:bg-muted rounded-l-md transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1.5 hover:bg-muted rounded-r-md transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Price */}
          <span className="font-bold">Rs.{total}</span>
        </div>
      </div>
    </div>
  )
}
