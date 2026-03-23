"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle } from "lucide-react"
import type { Salad } from "@/lib/salads-data"
import { pricing } from "@/lib/salads-data"
import { getWhatsAppOrderUrl } from "@/lib/constants"

interface SaladModalProps {
  salad: Salad | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaladModal({ salad, open, onOpenChange }: SaladModalProps) {
  if (!salad) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-[1200px] !w-[90vw] p-0 overflow-hidden h-auto aspect-video max-h-[90vh]"
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">{salad.name}</DialogTitle>
        <DialogDescription className="sr-only">{salad.description}</DialogDescription>

        <div className="grid grid-cols-[1.5fr_1fr] h-full min-h-[500px]">
          {/* Column 1: Image on top, Recipe below */}
          <div className="flex flex-col h-full border-r border-border">
            {/* Image - top half */}
            <div className="relative bg-muted flex-1 min-h-[250px]">
              <Image
                src={salad.image || "/placeholder.svg"}
                alt={salad.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>

            {/* Recipe Info - bottom section */}
            <div className="p-6 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-3">
                {salad.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">{salad.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{salad.description}</p>
            </div>
          </div>

          <div className="p-6 flex flex-col bg-muted/30 overflow-y-auto">
            {/* Ingredients at top */}
            <div className="mb-4">
              <h4 className="font-semibold text-foreground mb-2 text-sm">Ingredients</h4>
              <div className="flex flex-wrap gap-1.5">
                {salad.ingredients.map((ingredient) => (
                  <span key={ingredient} className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-3">Nutrition</h4>

            <Tabs defaultValue="half" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="half" className="text-xs">
                  Half
                </TabsTrigger>
                <TabsTrigger value="full" className="text-xs">
                  Full
                </TabsTrigger>
              </TabsList>

              <TabsContent value="half" className="flex-1 flex flex-col mt-0">
                <NutritionDisplay nutrition={salad.nutrition.half} size="half" />
              </TabsContent>
              <TabsContent value="full" className="flex-1 flex flex-col mt-0">
                <NutritionDisplay nutrition={salad.nutrition.full} size="full" />
              </TabsContent>
            </Tabs>

            <Button asChild className="w-full mt-4" size="default">
              <a href={getWhatsAppOrderUrl(salad.name)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Order on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NutritionDisplay({
  nutrition,
  size,
}: {
  nutrition: { calories: number; protein: number; fiber: number; carbs: number; fat: number }
  size: "half" | "full"
}) {
  const price = size === "half" ? pricing.half.price : pricing.full.price
  const weight = size === "half" ? "200g" : "300g"

  return (
    <div className="space-y-3 flex-1">
      {/* Row 1: Calories, Weight, Price */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-orange-100 text-orange-700 rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{nutrition.calories}</div>
          <div className="text-xs mt-0.5">Calories</div>
        </div>
        <div className="bg-muted text-foreground rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{weight}</div>
          <div className="text-xs mt-0.5">Weight</div>
        </div>
        <div className="bg-primary/10 text-primary rounded-lg p-3 text-center">
          <div className="text-xl font-bold">₹{price}</div>
          <div className="text-xs mt-0.5">Price</div>
        </div>
      </div>

      {/* Row 2: Macros */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-blue-100 text-blue-700 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold">{nutrition.protein}g</div>
          <div className="text-xs">Protein</div>
        </div>
        <div className="bg-green-100 text-green-700 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold">{nutrition.fiber}g</div>
          <div className="text-xs">Fiber</div>
        </div>
        <div className="bg-amber-100 text-amber-700 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold">{nutrition.carbs}g</div>
          <div className="text-xs">Carbs</div>
        </div>
        <div className="bg-purple-100 text-purple-700 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold">{nutrition.fat}g</div>
          <div className="text-xs">Fat</div>
        </div>
      </div>
    </div>
  )
}
