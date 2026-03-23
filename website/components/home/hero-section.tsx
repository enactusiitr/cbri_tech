"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-8 border-b-2 border-foreground">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-32 h-32 border-4 border-foreground rounded-full" />
        <div className="absolute bottom-4 right-8 w-24 h-24 border-4 border-foreground rotate-45" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-foreground rounded-full" />
      </div>

      <div className="relative max-w-lg mx-auto">
        <div className="space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent text-accent-foreground text-sm font-bold rounded-full border-2 border-foreground">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            FREE DELIVERY TODAY
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl font-black text-primary-foreground leading-none tracking-tight text-poster">
            HUNGRY?
            <br />
            <span className="text-accent">WE GOT YOU.</span>
          </h2>

          {/* Subtext */}
          <p className="text-primary-foreground/90 text-lg font-medium max-w-xs">
            Delicious food from your favorite campus spots, delivered fast.
          </p>

          {/* CTA */}
          <span className="text-black font-semibold inline-flex items-center gap-2 mt-4 inline-block">
            Order now →
          </span>
        </div>

        {/* Decorative food illustration placeholder */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-40 h-40 hidden sm:block">
          <div className="w-full h-full bg-accent/30 rounded-full border-4 border-foreground/20 flex items-center justify-center">
            <span className="text-6xl">🍔</span>
          </div>
        </div>
      </div>
    </section>
  )
}
