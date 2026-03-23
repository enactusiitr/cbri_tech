"use client"

import Image from "next/image"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle } from "lucide-react"
import type { Salad } from "@/lib/salads-data"
import { pricing } from "@/lib/salads-data"
import { getWhatsAppOrderUrl } from "@/lib/constants"

interface SaladDrawerProps {
  salad: Salad | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaladDrawer({ salad, open, onOpenChange }: SaladDrawerProps) {
  if (!salad) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="overflow-y-auto">
          <DrawerHeader className="text-left">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
              <Image
                src={salad.image || "/placeholder.svg"}
                alt={salad.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
                priority
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {salad.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <DrawerTitle className="text-2xl">{salad.name}</DrawerTitle>
            <DrawerDescription className="text-base leading-relaxed mt-2">{salad.description}</DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-8 space-y-6">
            {/* Ingredients */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Ingredients</h4>
              <div className="flex flex-wrap gap-2">
                {salad.ingredients.map((ingredient) => (
                  <span key={ingredient} className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Nutritional Information</h4>
              <Tabs defaultValue="half">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="half">Half</TabsTrigger>
                  <TabsTrigger value="full">Full</TabsTrigger>
                </TabsList>
                <TabsContent value="half">
                  <NutritionDisplay nutrition={salad.nutrition.half} size="half" />
                </TabsContent>
                <TabsContent value="full">
                  <NutritionDisplay nutrition={salad.nutrition.full} size="full" />
                </TabsContent>
              </Tabs>
            </div>

            <Button asChild className="w-full" size="lg">
              <a href={getWhatsAppOrderUrl(salad.name)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Order on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function NutritionDisplay({
  nutrition,
  size,
}: {
  nutrition: { calories: number; protein: number; fiber: number; carbs: number; fat: number }
  size: "half" | "full"
}) {
  const weight = size === "half" ? pricing.half.weight : pricing.full.weight
  const price = size === "half" ? pricing.half.price : pricing.full.price

  return (
    <div className="space-y-3">
      {/* First Row: Calories, Weight, Price */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-orange-100 text-orange-700 rounded-xl p-3 text-center">
          <div className="text-lg font-bold">{nutrition.calories}</div>
          <div className="text-xs mt-1">Calories</div>
        </div>
        <div className="bg-muted rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-foreground">{weight}</div>
          <div className="text-xs mt-1 text-muted-foreground">Weight</div>
        </div>
        <div className="bg-primary/10 text-primary rounded-xl p-3 text-center">
          <div className="text-lg font-bold">₹{price}</div>
          <div className="text-xs mt-1">Price</div>
        </div>
      </div>

      {/* Second Row: Macros */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-blue-100 text-blue-700 rounded-xl p-2.5 text-center">
          <div className="text-base font-bold">{nutrition.protein}g</div>
          <div className="text-xs mt-0.5">Protein</div>
        </div>
        <div className="bg-green-100 text-green-700 rounded-xl p-2.5 text-center">
          <div className="text-base font-bold">{nutrition.fiber}g</div>
          <div className="text-xs mt-0.5">Fiber</div>
        </div>
        <div className="bg-amber-100 text-amber-700 rounded-xl p-2.5 text-center">
          <div className="text-base font-bold">{nutrition.carbs}g</div>
          <div className="text-xs mt-0.5">Carbs</div>
        </div>
        <div className="bg-purple-100 text-purple-700 rounded-xl p-2.5 text-center">
          <div className="text-base font-bold">{nutrition.fat}g</div>
          <div className="text-xs mt-0.5">Fat</div>
        </div>
      </div>
    </div>
  )
}
