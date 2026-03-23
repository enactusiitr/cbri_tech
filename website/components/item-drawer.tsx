"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Minus, Plus, Flame } from "lucide-react"
import type { MenuItem, Vendor, SelectedCustomization } from "@/lib/data"
import { calculateItemTotal } from "@/lib/data"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

interface ItemDrawerProps {
  item: MenuItem | null
  vendor: Vendor
  isOpen: boolean
  onClose: () => void
}

export function ItemDrawer({ item, vendor, isOpen, onClose }: ItemDrawerProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomization[]>([])
  const [specialInstructions, setSpecialInstructions] = useState("")

  // Reset state when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1)
      setSpecialInstructions("")
      // Initialize customizations with required defaults
      const initialCustomizations: SelectedCustomization[] = []
      if (item.customizations) {
        item.customizations.forEach((customization) => {
          if (customization.required && customization.options.length > 0) {
            initialCustomizations.push({
              customizationId: customization.id,
              optionIds: [customization.options[0].id],
            })
          }
        })
      }
      setSelectedCustomizations(initialCustomizations)
    }
  }, [item])

  if (!item) return null

  const isSpicy = item.tags.includes("Spicy")
  const isVegan = item.tags.includes("Vegan")
  const total = calculateItemTotal(item, quantity, selectedCustomizations)

  const handleCustomizationChange = (
    customizationId: string,
    optionId: string,
    type: "single" | "multiple"
  ) => {
    setSelectedCustomizations((prev) => {
      const existing = prev.find((c) => c.customizationId === customizationId)

      if (type === "single") {
        if (existing) {
          return prev.map((c) =>
            c.customizationId === customizationId ? { ...c, optionIds: [optionId] } : c
          )
        }
        return [...prev, { customizationId, optionIds: [optionId] }]
      }

      // Multiple selection
      if (existing) {
        const hasOption = existing.optionIds.includes(optionId)
        if (hasOption) {
          const newOptionIds = existing.optionIds.filter((id) => id !== optionId)
          if (newOptionIds.length === 0) {
            return prev.filter((c) => c.customizationId !== customizationId)
          }
          return prev.map((c) =>
            c.customizationId === customizationId ? { ...c, optionIds: newOptionIds } : c
          )
        }
        return prev.map((c) =>
          c.customizationId === customizationId
            ? { ...c, optionIds: [...c.optionIds, optionId] }
            : c
        )
      }
      return [...prev, { customizationId, optionIds: [optionId] }]
    })
  }

  const isOptionSelected = (customizationId: string, optionId: string) => {
    const customization = selectedCustomizations.find((c) => c.customizationId === customizationId)
    return customization?.optionIds.includes(optionId) ?? false
  }

  const handleAddToCart = () => {
    addItem(item, vendor, quantity, selectedCustomizations, specialInstructions || undefined)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/50 z-50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl border-t-2 border-x-2 border-foreground max-h-[90vh] overflow-hidden transition-transform duration-300",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-muted rounded-full hover:bg-accent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] pb-32">
          {/* Image */}
          <div className="relative h-48 mx-4 rounded-xl overflow-hidden border-2 border-foreground">
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-2xl font-black text-poster">{item.name}</h2>
                <span className="text-xl font-bold">Rs.{item.price}</span>
              </div>
              <p className="text-muted-foreground mt-1">{item.description}</p>

              {/* Tags */}
              <div className="flex items-center gap-2 mt-2">
                {isSpicy && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded">
                    <Flame className="w-3 h-3" />
                    Spicy
                  </span>
                )}
                {isVegan && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                    Vegetarian
                  </span>
                )}
              </div>
            </div>

            {/* Customizations */}
            {item.customizations?.map((customization) => (
              <div key={customization.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{customization.name}</h3>
                  {customization.required && (
                    <span className="text-xs text-secondary font-medium">Required</span>
                  )}
                </div>

                <div className="space-y-2">
                  {customization.options.map((option) => {
                    const isSelected = isOptionSelected(customization.id, option.id)
                    return (
                      <button
                        key={option.id}
                        onClick={() =>
                          handleCustomizationChange(customization.id, option.id, customization.type)
                        }
                        className={cn(
                          "flex items-center justify-between w-full p-3 rounded-lg border-2 transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                            )}
                          >
                            {isSelected && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                          </div>
                          <span className="font-medium">{option.name}</span>
                        </div>
                        {option.price > 0 && (
                          <span className="text-sm text-muted-foreground">+Rs.{option.price}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Special Instructions */}
            <div className="space-y-2">
              <h3 className="font-bold">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests? (optional)"
                className="w-full p-3 rounded-lg border-2 border-border bg-transparent resize-none focus:border-primary focus:outline-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t-2 border-foreground safe-area-pb">
          <div className="flex items-center gap-4">
            {/* Quantity */}
            <div className="flex items-center gap-2 px-2 py-1 border-2 border-foreground rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 hover:bg-muted rounded"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 hover:bg-muted rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-bold rounded-lg border-2 border-foreground poster-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Add to Cart - Rs.{total}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
