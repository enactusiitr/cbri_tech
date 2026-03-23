"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useStorePath } from "@/context/StoreContext"
import { cn } from "@/lib/utils"

export function FloatingCartButton() {
  const { getItemCount, getSubtotal, vendor } = useCart()
  const storePath = useStorePath()
  const itemCount = getItemCount()
  const subtotal = getSubtotal()

  if (itemCount === 0) return null

  return (
    <Link
      href={storePath("/cart")}
      className={cn(
        "fixed bottom-20 left-4 right-4 z-40 max-w-lg mx-auto",
        "flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-xl border-2 border-foreground poster-shadow",
        "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center border-2 border-foreground">
            {itemCount}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium opacity-90">{vendor?.name}</p>
          <p className="font-bold">View Cart</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xl font-black">Rs.{subtotal}</p>
      </div>
    </Link>
  )
}
