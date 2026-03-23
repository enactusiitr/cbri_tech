"use client"

// ============ COMMENTED OUT: cbri-inside Order Success page (disabled per order-flow simplification) ============
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

  useEffect(() => {
    router.replace(storePath("/"))
  }, [router, storePath])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground font-medium">Redirecting to home...</p>
    </div>
  )

  // ============ ORIGINAL cbri-inside ORDER SUCCESS PAGE BELOW (COMMENTED OUT) ============
  /*
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string
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
      ...original JSX...
    </div>
  )
  */
  // ============ END ORIGINAL cbri-inside ORDER SUCCESS PAGE ============
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="font-bold text-primary animate-pulse">Redirecting...</p></div>}>
      <SuccessContent />
    </Suspense>
  )
}
