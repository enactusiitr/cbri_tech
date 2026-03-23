"use client"

// ============ COMMENTED OUT: Order Success/Confirmed page (disabled per order-flow simplification) ============
// import { useEffect, useState, Suspense } from "react"
// import { useParams, useRouter, useSearchParams } from "next/navigation"
// import Link from "next/link"
// import { CheckCircle2, ChefHat, Package, Bike, ArrowRight, Home } from "lucide-react"
// import { getVendorById, type Vendor } from "@/lib/data"
// import { useStorePath } from "@/context/StoreContext"

import { useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useStorePath } from "@/context/StoreContext"

function SuccessContent() {
  const router = useRouter()
  const storePath = useStorePath()

  // Redirect to home since success page is disabled (inline success screen is used instead)
  useEffect(() => {
    router.replace(storePath("/"))
  }, [router, storePath])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground font-medium">Redirecting to home...</p>
    </div>
  )

  // ============ ORIGINAL ORDER SUCCESS PAGE BELOW (COMMENTED OUT) ============
  /*
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.id as string
  const vendorId = searchParams.get("vendorId")

  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [address, setAddress] = useState<string>("Loading...")
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (vendorId) {
      const v = getVendorById(vendorId)
      if (v) setVendor(v)
    }

    try {
      const saved = localStorage.getItem("checkout_details")
      if (saved) {
        setAddress(JSON.parse(saved).address || "Campus Address")
      }
    } catch(e) {}
  }, [vendorId])

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirecting(true)
      router.push(storePath(`/orders/${orderId}?new=true`))
    }, 4000)

    return () => clearTimeout(timer)
  }, [orderId, router, storePath])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pb-12 overflow-y-auto">
      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 fade-in duration-300">
          <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-4 border-foreground poster-shadow-sm">
            <CheckCircle2 className="w-12 h-12" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-poster tracking-tight">Order Confirmed!</h1>
            <p className="text-muted-foreground font-medium mt-1">Your food is being prepared</p>
          </div>
        </div>

        <div className="bg-card border-2 border-foreground rounded-2xl p-5 poster-shadow-sm space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-150 fill-mode-both">
          <div className="flex justify-between items-start border-b-2 border-border pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order ID</p>
              <p className="font-bold text-foreground">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Est. Delivery</p>
              <p className="text-xl font-black text-primary">{vendor?.deliveryTime || "15-20 min"}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <p className="font-bold text-lg">{vendor?.name || "Store"}</p>
            <p className="text-sm text-muted-foreground line-clamp-1 truncate">{address}</p>
          </div>
        </div>

        <div className="bg-card border-2 border-foreground rounded-2xl p-5 poster-shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-both">
          <h3 className="text-sm font-bold uppercase tracking-wide mb-4">Live Status</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-foreground font-bold">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-primary text-lg">Order Confirmed</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground font-medium opacity-50 relative">
              <div className="absolute top-[-24px] left-[18px] w-0.5 h-4 bg-border"></div>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-muted-foreground">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="text-lg">Preparing</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground font-medium opacity-50 relative">
              <div className="absolute top-[-24px] left-[18px] w-0.5 h-4 bg-border"></div>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-muted-foreground">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-lg">Ready</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground font-medium opacity-50 relative">
              <div className="absolute top-[-24px] left-[18px] w-0.5 h-4 bg-border"></div>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-muted-foreground">
                <Bike className="w-5 h-5" />
              </div>
              <span className="text-lg">On the Way</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-500 fill-mode-both">
          <Link
            href={storePath(`/orders/${orderId}?new=true`)}
            onClick={() => setRedirecting(true)}
            className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl border-2 border-foreground poster-shadow-sm active:scale-95 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            {redirecting ? "Redirecting..." : "Track Order"} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href={storePath("/")}
            className="flex items-center justify-center gap-2 w-full py-4 bg-card text-foreground font-bold text-lg rounded-xl border-2 border-foreground active:scale-95 transition-all hover:bg-muted"
          >
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
  */
  // ============ END ORIGINAL ORDER SUCCESS PAGE ============
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="font-bold text-primary animate-pulse">Redirecting...</p></div>}>
      <SuccessContent />
    </Suspense>
  )
}
