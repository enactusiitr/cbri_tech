"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Clock } from "lucide-react"
import { getFeaturedVendors } from "@/lib/data"
import { useStore, useStorePath } from "@/context/StoreContext"

export function VendorCarousel() {
  const { selectedStore } = useStore()
  const storePath = useStorePath()
  const featuredVendors = selectedStore ? getFeaturedVendors(selectedStore) : []

  return (
    <section className="py-6">
      <div className="px-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-poster">FEATURED</h3>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            Hot picks
          </span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {featuredVendors.map((vendor) => (
          <Link
            key={vendor.id}
            href={storePath(`/vendor/${vendor.id}`)}
            className="flex-shrink-0 w-72 snap-start group"
          >
            <div className="relative bg-card rounded-xl border-2 border-foreground poster-shadow overflow-hidden transition-all group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none">
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {/* Featured badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded border-2 border-foreground">
                  FEATURED
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="text-lg font-black text-poster mb-1">{vendor.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{vendor.tagline}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-bold">{vendor.rating}</span>
                    </div>
                    {/* Delivery time */}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{vendor.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Cuisine tags */}
                  <div className="text-xs font-medium text-muted-foreground">
                    {vendor.cuisine[0]}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
