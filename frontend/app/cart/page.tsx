"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { CartItemCard } from "@/components/cart/cart-item"
import { useStore, useStorePath } from "@/context/StoreContext"
import { calculateItemTotal } from "@/lib/data"

export default function CartPage() {
  const router = useRouter()
  const { selectedStore } = useStore()
  const storePath = useStorePath()
  const { items, vendor, getSubtotal, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  
  const [form, setForm] = useState({ name: "", phone: "", address: "" })
  const [errors, setErrors] = useState({ name: "", phone: "", address: "" })

  useEffect(() => {
    const saved = localStorage.getItem("checkout_details")
    if (saved) {
      try {
        setForm(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  const subtotal = getSubtotal()
  const finalTotal = subtotal + 20 + 0 - 20

  const handleCheckout = async () => {
    const newErrors = { name: "", phone: "", address: "" }
    let isValid = true

    if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
      isValid = false
    }
    if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits"
      isValid = false
    }
    if (form.address.trim().length < 5) {
      newErrors.address = "Valid address is required"
      isValid = false
    }
    
    setErrors(newErrors)
    
    if (!isValid) return

    localStorage.setItem("checkout_details", JSON.stringify(form))

    setIsProcessing(true)
    
    try {
      const orderPayload = {
        customer: {
          name: form.name.trim(),
          phoneNumber: form.phone.trim(),
          address: form.address.trim(),
          canteen: selectedStore === "outside" ? "cbri outside" : "cbri inside",
        },
        items: items.map(item => ({
          itemName: `${item?.menuItem?.name ?? "Item"}${item?.variant ? ` (${item.variant})` : ""}`,
          quantity: Number(item?.quantity ?? 1),
          price: Number(
            item?.menuItem
              ? calculateItemTotal(
                  item.menuItem,
                  1,
                  item.selectedCustomizations ?? [],
                  item.variant,
                )
              : 0
          ),
          imageUrl: item?.menuItem?.image
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.menuItem.image}`
            : ""
        })),
        pricing: {
          subtotal: Number(subtotal),
          deliveryFee: 20,
          platformFee: 0,
          discount: 20,
          payableAmount: Number(finalTotal),
        },
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      
      if (data.success) {
        clearCart();
        setIsOrderPlaced(true);
      } else {
        alert(data?.message || "Failed to place order.");
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error(error);
      alert(`Error connecting to server (${apiUrl}). Message: ${error.message}`);
      setIsProcessing(false);
    }
  }

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-3xl font-black text-poster mb-3">Order Received!</h1>
        <p className="text-muted-foreground mb-8">Your order has been sent to the store successfully.</p>
        <Link 
          href={storePath("/")}
          className="px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl border-2 border-foreground poster-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-8">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background border-b-2 border-foreground">
          <div className="flex items-center gap-4 h-16 px-4 max-w-lg mx-auto">
            <Link
              href={storePath("/")}
              className="p-2 rounded-lg border-2 border-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-black text-poster">YOUR CART</h1>
          </div>
        </header>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center px-4 py-20 max-w-lg mx-auto">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-black text-poster mb-2">CART IS EMPTY</h2>
          <p className="text-muted-foreground text-center mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href={storePath("/")}
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg border-2 border-foreground poster-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            BROWSE MENU
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b-2 border-foreground">
        <div className="flex items-center gap-4 h-16 px-4 max-w-lg mx-auto">
          <Link
            href={storePath("/")}
            className="p-2 rounded-lg border-2 border-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-poster">YOUR CART</h1>
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          <h2 className="font-black text-poster">ORDER ITEMS</h2>
          {items.map((item) => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Add More Items */}
        <Link
          href={storePath("/")}
          className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-muted-foreground rounded-xl text-muted-foreground font-medium hover:border-foreground hover:text-foreground transition-colors bg-card"
        >
          + Add more items
        </Link>



        {/* Customer Details */}
        <div className="p-4 bg-card rounded-xl border-2 border-foreground space-y-3">
          <h2 className="font-black text-poster">DELIVERY DETAILS</h2>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 bg-transparent rounded-xl border-2 ${errors.name ? 'border-red-500' : 'border-foreground'} focus:outline-none text-sm font-medium placeholder:text-muted-foreground`}
              />
              {errors.name && <p className="text-red-500 text-xs font-bold mt-1 px-1">{errors.name}</p>}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone Number (10 digits)"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full px-4 py-3 bg-transparent rounded-xl border-2 ${errors.phone ? 'border-red-500' : 'border-foreground'} focus:outline-none text-sm font-medium placeholder:text-muted-foreground`}
              />
              {errors.phone && <p className="text-red-500 text-xs font-bold mt-1 px-1">{errors.phone}</p>}
            </div>

            <div>
              <textarea
                placeholder="Complete Delivery Address"
                value={form.address}
                onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                rows={3}
                className={`w-full px-4 py-3 bg-transparent rounded-xl border-2 ${errors.address ? 'border-red-500' : 'border-foreground'} focus:outline-none text-sm font-medium placeholder:text-muted-foreground resize-none`}
              />
              {errors.address && <p className="text-red-500 text-xs font-bold mt-1 px-1">{errors.address}</p>}
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="p-4 bg-card rounded-xl border-2 border-foreground space-y-3">
          <h2 className="font-black text-poster">BILL DETAILS</h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Item Total</span>
              <span className="font-medium">Rs.{subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-medium">Rs.20</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Platform Fee</span>
              <span className="font-medium">Rs.5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-medium text-green-600">-Rs.25</span>
            </div>
          </div>

          <div className="pt-3 border-t-2 border-border">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="font-black text-xl">Rs.{finalTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t-2 border-foreground safe-area-pb z-40">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl border-2 border-foreground poster-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : `Place Order - Rs.${finalTotal}`}
          </button>
        </div>
      </div>
    </div>
  )
}
