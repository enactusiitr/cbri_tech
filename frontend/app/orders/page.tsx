"use client"

// ============ COMMENTED OUT: Your Orders page (disabled per order-flow simplification) ============
// import Link from "next/link"
// import Image from "next/image"
// import { ArrowLeft, ChevronRight, Clock, Package } from "lucide-react"
// import { BottomNav } from "@/components/layout/bottom-nav"
// import { useStoreData, useStorePath } from "@/context/StoreContext"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStorePath } from "@/context/StoreContext"

export default function OrdersPage() {
  const router = useRouter()
  const storePath = useStorePath()

  // Redirect to home since orders page is disabled
  useEffect(() => {
    router.replace(storePath("/"))
  }, [router, storePath])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground font-medium">Redirecting to home...</p>
    </div>
  )

  // ============ ORIGINAL YOUR ORDERS PAGE BELOW (COMMENTED OUT) ============
  /*
  const { vendors, menuItems } = useStoreData()
  const storePath = useStorePath()
  const mockOrders = vendors.slice(0, 3).map((vendor, index) => ({
    id: `ORD-12345${6 - index}`,
    vendor,
    status: "delivered" as const,
    items: menuItems
      .filter((item) => item.vendorId === vendor.id)
      .slice(0, 2)
      .map((item) => item.name),
    total: 220 + index * 40,
    date: index === 0 ? "Today, 2:30 PM" : index === 1 ? "Yesterday, 7:15 PM" : "Mar 15, 1:00 PM",
  }))

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background border-b-2 border-foreground">
        <div className="flex items-center gap-4 h-16 px-4 max-w-lg mx-auto">
          <Link
            href={storePath("/")}
            className="p-2 rounded-lg border-2 border-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-poster">YOUR ORDERS</h1>
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <section>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Active Orders
          </h2>
          <div className="p-6 bg-muted rounded-xl border-2 border-dashed border-border text-center">
            <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No active orders</p>
            <Link
              href={storePath("/")}
              className="inline-block mt-3 text-sm font-bold text-primary hover:underline"
            >
              Browse restaurants
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Past Orders
          </h2>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <Link
                key={order.id}
                href={storePath(`/orders/${order.id}`)}
                className="flex items-center gap-3 p-3 bg-card rounded-xl border-2 border-foreground hover:bg-muted transition-colors"
              >
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-foreground">
                  <Image
                    src={order.vendor.image}
                    alt={order.vendor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold truncate">{order.vendor.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.items.join(", ")}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 px-2 py-1 text-xs font-bold rounded ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {order.date}
                    </div>
                    <span className="font-bold">Rs.{order.total}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
  */
  // ============ END ORIGINAL YOUR ORDERS PAGE ============
}
