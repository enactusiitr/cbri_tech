"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  LogOut,
  ChevronRight,
  Store,
  ArrowLeft,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Package
} from "lucide-react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { useStore, useStorePath } from "@/context/StoreContext"
import { getStoreLabel } from "@/lib/data"
import { useGoogleAuth } from "@/context/GoogleAuthContext"

export default function ProfilePage() {
  const router = useRouter()
  const { selectedStore } = useStore()
  const storePath = useStorePath()
  const { user, logout } = useGoogleAuth()

  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [errorOrders, setErrorOrders] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/")
    } else {
      fetchOrders()
    }
  }, [user, router])

  const fetchOrders = async () => {
    if (!user?.email) return;
    setLoadingOrders(true)
    setErrorOrders("")
    try {
      const apiUrl = `/api/orders?userEmail=${encodeURIComponent(user.email)}`
      const res = await fetch(apiUrl)
      if (!res.ok) {
         // Treat 404 as no orders, not an error
         if (res.status === 404) {
           setOrders([])
           setErrorOrders("")
           return
         }
         const errorBody = await res.text().catch(() => "Could not read error body")
         const errorMsg = `HTTP Error ${res.status}: ${res.statusText}. Body: ${errorBody}`;
         console.error("Fetch error details:", errorMsg);
         throw new Error(`Failed to fetch orders (HTTP ${res.status}).`)
      }
      
      const data = await res.json()
      if (data.success && data.orders) {
        const myOrders = data.orders
        myOrders.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        setOrders(myOrders)
      } else {
        console.warn("API response did not contain success: true or an orders array.", data);
        setOrders([])
      }
    } catch (err: any) {
      console.error("Fetch error:", err)
      if (err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch')) {
         console.error("CORS or Network Error detected. Backend might not be allowing this origin, or terminal server is down.");
         setErrorOrders("Network error: Could not connect to backend (Possible CORS or server down issue).")
      } else {
         setErrorOrders(err.message || "An unexpected error occurred while fetching orders.")
      }
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleChangeStore = () => {
    localStorage.removeItem("store")
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s.includes("deliv") || s.includes("complet")) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (s.includes("cancel") || s.includes("reject")) return <XCircle className="w-4 h-4 text-red-500" />
    return <Clock className="w-4 h-4 text-blue-500" />
  }

  const getCustomerStatusLabel = (status: string) => {
    const s = (status || "pending").toLowerCase()
    if (s === "accepted") return "Preparing"
    if (s === "pending") return "Ordered"
    if (s === "completed") return "Delivered"
    if (s === "rejected") return "Rejected"
    return status || "Processing"
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b-2 border-foreground">
        <div className="flex items-center gap-4 h-16 px-4 max-w-lg mx-auto">
          <Link
            href={storePath("/")}
            className="p-2 rounded-lg border-2 border-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-poster">MY PROFILE</h1>
        </div>
      </header>

      {/* User Info */}
      <div className="bg-primary px-4 py-8 border-b-2 border-foreground">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-card rounded-full border-4 border-foreground overflow-hidden flex items-center justify-center poster-shadow">
               <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="text-primary-foreground">
              <h1 className="text-2xl font-black text-poster leading-tight">{user.name}</h1>
              <p className="opacity-90 font-medium text-sm mt-1">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Store Context */}
        <button
          onClick={handleChangeStore}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border-2 border-foreground hover:bg-muted transition-colors poster-shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="font-bold">Change Campus Store</p>
              <p className="text-sm text-muted-foreground">
                {selectedStore ? `Currently browsing: ${getStoreLabel(selectedStore)}` : "Select a store"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* My Orders Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-poster flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            MY ORDERS
          </h2>

          <div className="bg-card rounded-xl border-2 border-foreground overflow-hidden">
             {loadingOrders ? (
                <div className="p-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
             ) : errorOrders ? (
                <div className="p-6 text-center text-red-500 font-bold">
                    <p>{errorOrders}</p>
                    <button onClick={fetchOrders} className="mt-2 text-sm underline">Try Again</button>
                </div>
             ) : orders.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                    <Package className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
                    <p className="font-bold text-lg mb-1">No orders yet</p>
                    <p className="text-muted-foreground text-sm mb-4">You haven&apos;t placed any orders with this account.</p>
                    <Link href={storePath("/")} className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg border-2 border-foreground poster-shadow-sm text-sm">
                        Start Ordering
                    </Link>
                </div>
             ) : (
                <div className="flex flex-col max-h-[400px] overflow-y-auto">
                    {orders.map((order, index) => (
                        <div key={order._id || index} className={`p-4 ${index !== orders.length - 1 ? 'border-b-2 border-border' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold text-sm">Order #{String(order._id || order.id || "").substring(0, 8)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Recent"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black">Rs.{order.totalAmount || order.pricing?.payableAmount || 0}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5 mb-3 bg-muted w-fit px-2 py-1 rounded-md">
                                {getStatusIcon(order.status)}
                                <span className="text-xs font-bold uppercase tracking-wider">{getCustomerStatusLabel(order.status)}</span>
                            </div>

                            {String(order.status || "").toLowerCase() === "accepted" && order.estimatedDeliveryTime && (
                              <p className="text-xs font-semibold text-amber-700 mb-2">
                                Expected delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            )}

                            <div className="text-sm">
                                <ul className="list-disc list-inside text-muted-foreground">
                                    {order.items?.map((item: any, i: number) => (
                                        <li key={i} className="truncate">
                                            {item.quantity}x {item.itemName || item.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
             )}
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full p-4 bg-red-100 rounded-xl border-2 border-red-500 font-bold text-red-600 hover:bg-red-200 transition-colors poster-shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        {/* App Version */}
        <p className="text-center text-sm text-muted-foreground pt-4">
          Zakaaz v1.0.0
        </p>
      </div>

    </div>
  )
}
