"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Salad } from "@/lib/salads-data"
import { pricing } from "@/lib/salads-data"

interface SaladCardProps {
  salad: Salad
  onViewDetails: (salad: Salad) => void
  isSelected?: boolean
}

export function SaladCard({ salad, onViewDetails, isSelected }: SaladCardProps) {
  const nutrition = salad.nutrition.half

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 group cursor-pointer ${
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border/50 hover:border-primary/30"
      }`}
      onClick={() => onViewDetails(salad)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={salad.image || "/placeholder.svg"}
          alt={salad.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        {salad.tags.length > 0 && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{salad.tags[0]}</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-foreground">{salad.name}</h3>
          <span className="font-bold text-primary text-lg">₹{pricing.half.price}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-sm font-semibold text-green-700">{nutrition.calories}</p>
            <p className="text-xs text-green-600">kcal</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-2 text-center">
            <p className="text-sm font-semibold text-orange-700">{nutrition.protein}g</p>
            <p className="text-xs text-orange-600">Protein</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-sm font-semibold text-blue-700">{nutrition.fiber}g</p>
            <p className="text-xs text-blue-600">Fiber</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 text-center">
            <p className="text-sm font-semibold text-purple-700">{nutrition.carbs}g</p>
            <p className="text-xs text-purple-600">Carbs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
