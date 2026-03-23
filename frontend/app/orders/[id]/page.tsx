"use client"

// ============ COMMENTED OUT: Order Tracking page (disabled per order-flow simplification) ============
// import { useState, useEffect, use } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { useSearchParams } from "next/navigation"
// import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, Store } from "lucide-react"
// import { OrderTimeline } from "@/components/order/order-timeline"
// import { BottomNav } from "@/components/layout/bottom-nav"
// import { useStoreData, useStorePath } from "@/context/StoreContext"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStorePath } from "@/context/StoreContext"

// type OrderStatus = "confirmed" | "preparing" | "ready" | "picked-up" | "on-the-way" | "delivered"

interface OrderPageProps {
  params: Promise<{ id: string }>
}

export default function OrderTrackingPage({ params }: OrderPageProps) {
  const router = useRouter()
  const storePath = useStorePath()

  // Redirect to home since order tracking page is disabled
  useEffect(() => {
    router.replace(storePath("/"))
  }, [router, storePath])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground font-medium">Redirecting to home...</p>
    </div>
  )

  // ============ ORIGINAL ORDER TRACKING PAGE BELOW (COMMENTED OUT) ============
  /*
  const { vendors } = useStoreData()
  const { id: orderId } = use(params)
  const searchParams = useSearchParams()
  const isNew = searchParams.get("new") === "true"

  const [status, setStatus] = useState<OrderStatus>("confirmed")

  useEffect(() => {
    if (!isNew) return
    const statusFlow: OrderStatus[] = [
      "confirmed",
      "preparing",
      "ready",
      "on-the-way",
      "delivered",
    ]
    let currentIndex = 0
    const interval = setInterval(() => {
      currentIndex++
      if (currentIndex < statusFlow.length) {
        setStatus(statusFlow[currentIndex])
      } else {
        clearInterval(interval)
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [isNew])

  const vendor = vendors[0]
  if (!vendor) return null
  const estimatedTime = status === "delivered" ? "Delivered" : "15-20 min"

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background border-b-2 border-foreground">
        <div className="flex items-center gap-4 h-16 px-4 max-w-lg mx-auto">
          <Link
            href={storePath("/orders")}
            className="p-2 rounded-lg border-2 border-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-black text-poster">ORDER #{orderId.slice(-6)}</h1>
            <p className="text-sm text-muted-foreground">Track your order</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <div className="p-4 bg-card rounded-xl border-2 border-foreground poster-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="text-2xl font-black text-poster">{estimatedTime}</p>
            </div>
            <div
              className={`px-3 py-1.5 rounded-full border-2 border-foreground font-bold text-sm ${
                status === "delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-accent text-accent-foreground"
              }`}
            >
              {status === "confirmed" && "CONFIRMED"}
              {status === "preparing" && "PREPARING"}
              {status === "ready" && "READY"}
              {status === "picked-up" && "PICKED UP"}
              {status === "on-the-way" && "ON THE WAY"}
              {status === "delivered" && "DELIVERED"}
            </div>
          </div>

          <div className="relative h-40 bg-muted rounded-lg border-2 border-border mb-4 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Live tracking map</p>
              </div>
            </div>
            {status === "on-the-way" && (
              <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-primary rounded-full animate-ping" />
            )}
          </div>

          {(status === "on-the-way" || status === "delivered") && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center border-2 border-foreground">
                  <span className="text-lg font-bold">RK</span>
                </div>
                <div>
                  <p className="font-bold">Rahul K.</p>
                  <p className="text-sm text-muted-foreground">Delivery Partner</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-card rounded-full border-2 border-foreground hover:bg-accent transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 bg-card rounded-full border-2 border-foreground hover:bg-accent transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-card rounded-xl border-2 border-foreground">
          <h2 className="font-black text-poster mb-4">ORDER STATUS</h2>
          <OrderTimeline status={status} />
        </div>

        <div className="p-4 bg-card rounded-xl border-2 border-foreground">
          <h2 className="font-black text-poster mb-3">ORDER FROM</h2>
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-foreground">
              <Image
                src={vendor.image}
                alt={vendor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-bold">{vendor.name}</p>
              <p className="text-sm text-muted-foreground">{vendor.tagline}</p>
            </div>
            <Link
              href={storePath(`/vendor/${vendor.id}`)}
              className="p-2 bg-muted rounded-lg hover:bg-accent transition-colors"
            >
              <Store className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="p-4 bg-card rounded-xl border-2 border-foreground">
          <h2 className="font-black text-poster mb-3">DELIVERY ADDRESS</h2>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-bold">Main Campus, Building A</p>
              <p className="text-sm text-muted-foreground">Room 204, Second Floor</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-card rounded-xl border-2 border-foreground">
          <h2 className="font-black text-poster mb-3">ORDER DETAILS</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-medium">{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Placed at</span>
              <span className="font-medium">
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium">Paid Online</span>
            </div>
          </div>
        </div>

        <button className="w-full p-4 bg-muted rounded-xl border-2 border-foreground text-center font-bold hover:bg-accent transition-colors">
          Need Help with this Order?
        </button>
      </div>

      <BottomNav />
    </div>
  )
  */
  // ============ END ORIGINAL ORDER TRACKING PAGE ============
}
