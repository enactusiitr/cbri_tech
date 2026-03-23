"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Clock, Bike, Heart } from "lucide-react"
import { useStorePath } from "@/context/StoreContext"
import type { Vendor } from "@/lib/data"

interface VendorHeaderProps {
  vendor: Vendor
}

export function VendorHeader({ vendor }: VendorHeaderProps) {
  const storePath = useStorePath()

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-56">
        <Image
          src={vendor.coverImage}
          alt={vendor.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />

        {/* Back Button */}
        <Link
          href={storePath("/")}
          className="absolute top-4 left-4 p-2 bg-card rounded-full border-2 border-foreground poster-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 p-2 bg-card rounded-full border-2 border-foreground poster-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Vendor Info */}
      <div className="relative -mt-16 px-4 pb-4">
        <div className="bg-card rounded-xl border-2 border-foreground poster-shadow p-4">
          <div className="flex items-start gap-4">
            {/* Vendor Logo */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-foreground -mt-10 bg-card">
              <Image
                src={vendor.image}
                alt={vendor.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-black text-poster">{vendor.name}</h1>
                  <p className="text-muted-foreground">{vendor.tagline}</p>
                </div>
                {/* Rating */}
                <div className="flex items-center gap-1 px-3 py-1.5 bg-accent rounded-lg border-2 border-foreground flex-shrink-0">
                  <Star className="w-4 h-4 fill-accent-foreground text-accent-foreground" />
                  <span className="font-bold">{vendor.rating}</span>
                  <span className="text-xs text-muted-foreground">({vendor.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t-2 border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{vendor.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {vendor.deliveryFee === 0 ? "Free delivery" : `Rs.${vendor.deliveryFee} delivery`}
              </span>
            </div>
            <div className="flex gap-2 ml-auto">
              {vendor.cuisine.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
