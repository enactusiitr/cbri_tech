"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Clock, Package, XCircle } from "lucide-react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { GoogleLoginButton } from "@/components/GoogleLoginButton"
import { useGoogleAuth } from "@/context/GoogleAuthContext"
import { useStorePath } from "@/context/StoreContext"

type CustomerOrder = {
  _id?: string
  id?: string
  status?: string
  totalAmount?: number
  createdAt?: string
  estimatedTime?: number
  estimatedDeliveryTime?: string
  items?: Array<{ itemName?: string; name?: string; quantity?: number }>
}

const getCustomerStatusLabel = (status?: string) => {
  const value = (status || "pending").toLowerCase()
  if (value === "accepted") return "Preparing"
  if (value === "pending") return "Ordered"
  if (value === "completed") return "Delivered"
  if (value === "rejected") return "Rejected"
  return value
}

export default function OrdersPage() {
  const router = useRouter()
  const storePath = useStorePath()
  const { user, isAuthReady } = useGoogleAuth()

  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthReady) return
    if (!user?.email) {
      setOrders([])
      return
    }

    const fetchOrders = async () => {
      setIsLoading(true)
      setError("")
      try {
        const response = await fetch(`/api/orders?userEmail=${encodeURIComponent(user.email)}`)
        const raw = await response.text()
        const data = raw ? JSON.parse(raw) : null

        if (response.status === 404) {
          setOrders([])
          return
        }

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || `Failed to fetch orders (HTTP ${response.status})`)
        }

        const nextOrders: CustomerOrder[] = Array.isArray(data.orders) ? data.orders : []
        nextOrders.sort((a, b) => {
          const left = new Date(a.createdAt || 0).getTime()
          const right = new Date(b.createdAt || 0).getTime()
          return right - left
        })
        setOrders(nextOrders)
      } catch (err: any) {
        setError(err?.message || "Failed to fetch orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthReady, user?.email])

  const title = useMemo(() => {
    if (!isAuthReady) return "Loading..."
    if (!user) return "Login Required"
    return "Your Orders"
  }, [isAuthReady, user])

  const statusIcon = (status: string) => {
    const value = status.toLowerCase()
    if (value.includes("completed") || value.includes("delivered")) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    if (value.includes("rejected") || value.includes("cancel")) {
      return <XCircle className="w-4 h-4 text-red-500" />
    }
    return <Clock className="w-4 h-4 text-amber-500" />
  }

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
          <h1 className="text-xl font-black text-poster">{title}</h1>
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        {!isAuthReady ? (
          <div className="text-center text-muted-foreground font-medium py-10">Preparing your session...</div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center bg-card p-6 rounded-2xl border-2 border-foreground poster-shadow-sm">
            <p className="text-muted-foreground mb-4 text-center text-sm font-medium">
              Please sign in with your Google iitr.ac.in account to view your orders.
            </p>
            <GoogleLoginButton />
          </div>
        ) : isLoading ? (
          <div className="text-center text-muted-foreground font-medium py-10">Loading orders...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold py-10">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl bg-card">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-bold text-lg mb-1">No Orders Yet</p>
            <p className="text-muted-foreground text-sm">Once you place an order, it will appear here.</p>
            <button
              onClick={() => router.push(storePath("/"))}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg border-2 border-foreground"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, index) => (
              <div key={order._id || order.id || String(index)} className="p-4 bg-card rounded-xl border-2 border-foreground">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-bold text-sm">Order #{String(order._id || order.id || "").slice(-8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recently placed"}
                    </p>
                  </div>
                  <p className="font-black text-lg">Rs.{order.totalAmount || 0}</p>
                </div>

                <div className="inline-flex items-center gap-1.5 mb-2 px-2 py-1 rounded-md bg-muted">
                  {statusIcon(order.status || "pending")}
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {getCustomerStatusLabel(order.status)}
                  </span>
                </div>

                {(order.status || "").toLowerCase() === "accepted" && order.estimatedDeliveryTime && (
                  <p className="text-xs font-semibold text-amber-700 mb-2">
                    Expected delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}

                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  {(order.items || []).map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.quantity || 1}x {item.itemName || item.name || "Item"}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
