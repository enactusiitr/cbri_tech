"use client"

// ============ COMMENTED OUT: OrderTimeline component (disabled per order-flow simplification) ============
// import { Check, ChefHat, Package, Bike, MapPin } from "lucide-react"
// import { cn } from "@/lib/utils"

type OrderStatus = "confirmed" | "preparing" | "ready" | "picked-up" | "on-the-way" | "delivered"

interface OrderTimelineProps {
  status: OrderStatus
}

// Export kept to avoid build errors in any remaining imports
export function OrderTimeline({ status }: OrderTimelineProps) {
  return null

  // ============ ORIGINAL TIMELINE COMPONENT BELOW (COMMENTED OUT) ============
  /*
  const currentIndex = statusOrder.indexOf(status)
  const displayIndex = status === "picked-up" ? 2 : currentIndex

  const steps = [
    { id: "confirmed", label: "Order Confirmed", icon: Check },
    { id: "preparing", label: "Preparing", icon: ChefHat },
    { id: "ready", label: "Ready for Pickup", icon: Package },
    { id: "on-the-way", label: "On the Way", icon: Bike },
    { id: "delivered", label: "Delivered", icon: MapPin },
  ]

  const statusOrder: OrderStatus[] = ["confirmed", "preparing", "ready", "picked-up", "on-the-way", "delivered"]

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isCompleted = index < displayIndex
        const isCurrent = index === displayIndex
        const Icon = step.icon

        return (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-accent border-foreground text-foreground animate-pulse"
                      : "bg-muted border-border text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-12 transition-all",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>

            <div className="flex-1 pb-8">
              <p
                className={cn(
                  "font-bold",
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {status === "preparing" && "Your food is being prepared with care"}
                  {status === "ready" && "Your order is ready and waiting"}
                  {(status === "on-the-way" || status === "picked-up") &&
                    "Your delivery partner is on the way"}
                  {status === "delivered" && "Enjoy your meal!"}
                  {status === "confirmed" && "We've received your order"}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
  */
  // ============ END ORIGINAL TIMELINE COMPONENT ============
}
