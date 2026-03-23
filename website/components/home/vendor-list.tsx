"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Bike } from "lucide-react"
import { useStoreData, useStorePath } from "@/context/StoreContext"

interface VendorListProps {
  selectedCategory: string
  searchQuery: string
}

export function VendorList({ selectedCategory, searchQuery }: VendorListProps) {
  const { vendors } = useStoreData()
  const storePath = useStorePath()
  const filteredVendors = vendors.filter((vendor) => {
    // Filter by category
    if (selectedCategory !== "all") {
      const cuisineLower = vendor.cuisine.map((c) => c.toLowerCase())
      const categoryMap: Record<string, string[]> = {
        asian: ["asian", "chinese", "thai", "japanese"],
        burgers: ["american", "burgers"],
        indian: ["indian", "south indian"],
        pizza: ["italian", "pizza"],
        wraps: ["mediterranean", "wraps"],
        healthy: ["healthy", "vegetarian"],
      }
      const matchTerms = categoryMap[selectedCategory] || [selectedCategory]
      if (!cuisineLower.some((c) => matchTerms.some((m) => c.includes(m)))) {
        return false
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        vendor.name.toLowerCase().includes(query) ||
        vendor.tagline.toLowerCase().includes(query) ||
        vendor.cuisine.some((c) => c.toLowerCase().includes(query))
      )
    }

    return true
  })

  return (
    <section id="vendors" className="py-6 px-4">
      <div className="max-w-lg mx-auto">
        <h3 className="text-xl font-black text-poster mb-4">ALL RESTAURANTS</h3>

        <div className="space-y-4">
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-medium">No restaurants found</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different search or category</p>
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={storePath(`/vendor/${vendor.id}`)}
                className="block group"
              >
                <div className="flex gap-4 p-3 bg-card rounded-xl border-2 border-foreground poster-shadow-sm transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 border-foreground">
                    <Image
                      src={vendor.image}
                      alt={vendor.name}
                      fill
                      className="object-cover"
                    />
                    {!vendor.isOpen && (
                      <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
                        <span className="text-background text-xs font-bold">CLOSED</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-poster truncate">{vendor.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{vendor.tagline}</p>
                      </div>
                      {/* Rating badge */}
                      <div className="flex items-center gap-1 px-2 py-1 bg-accent rounded-md border border-foreground flex-shrink-0">
                        <Star className="w-3 h-3 fill-accent-foreground text-accent-foreground" />
                        <span className="text-xs font-bold">{vendor.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      {/* Delivery time */}
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{vendor.deliveryTime}</span>
                      </div>
                      {/* Delivery fee */}
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Bike className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">
                          {vendor.deliveryFee === 0 ? "Free" : `Rs.${vendor.deliveryFee}`}
                        </span>
                      </div>
                      {/* Cuisines */}
                      <div className="text-xs text-muted-foreground">
                        {vendor.cuisine.slice(0, 2).join(" • ")}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
