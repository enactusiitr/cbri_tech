"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { CartItem, MenuItem, SelectedCustomization, Vendor } from "./data"
import { calculateItemTotal } from "./data"
import { usePathname } from "next/navigation"

interface CartContextType {
  items: CartItem[]
  vendor: Vendor | null
  addItem: (
    item: MenuItem,
    vendor: Vendor,
    quantity: number,
    customizations: SelectedCustomization[],
    specialInstructions?: string,
    variant?: string
  ) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const store = pathname?.includes("cbri-outside") ? "outside" : "inside"

  const [items, setItems] = useState<CartItem[]>([])
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart natively dependent on the active generic store mapping
  useEffect(() => {
    setIsLoaded(false)
    const saved = localStorage.getItem(`cart_${store}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setItems(parsed.items || [])
        setVendor(parsed.vendor || null)
      } catch (e) {
        setItems([])
        setVendor(null)
      }
    } else {
      setItems([])
      setVendor(null)
    }
    setIsLoaded(true)
  }, [store])

  // Sequentially write states directly to their mapped isolated storage string
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`cart_${store}`, JSON.stringify({ items, vendor }))
    }
  }, [items, vendor, store, isLoaded])

  const addItem = useCallback(
    (
      menuItem: MenuItem,
      itemVendor: Vendor,
      quantity: number,
      selectedCustomizations: SelectedCustomization[],
      specialInstructions?: string,
      variant?: string
    ) => {
      // Allow mixing vendors within the centralized store boundary dynamically
      if (vendor && vendor.id !== itemVendor.id) {
        // We explicitly keep prior items allowing deep conversion flow mapping
      }

      setVendor(itemVendor)

      const cartItem: CartItem = {
        id: `${menuItem.id}-${variant || "base"}-${Date.now()}`,
        menuItem,
        variant,
        quantity,
        selectedCustomizations,
        specialInstructions,
      }

      setItems((prev) => [...prev, cartItem])
    },
    [vendor]
  )

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== cartItemId)
      if (newItems.length === 0) {
        setVendor(null)
      }
      return newItems
    })
  }, [])

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId)
      return
    }

    setItems((prev) => prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item)))
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
    setVendor(null)
    localStorage.removeItem(`cart_${store}`)
  }, [store])

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => {
      return total + calculateItemTotal(item.menuItem, item.quantity, item.selectedCustomizations, item.variant)
    }, 0)
  }, [items])

  // Currently Delivery Fee is 0
  const getTotal = useCallback(() => {
    const subtotal = getSubtotal()
    const deliveryFee =  0 //|| vendor?.deliveryFee 
    return subtotal + deliveryFee
  }, [getSubtotal, vendor])

  return (
    <CartContext.Provider
      value={{
        items,
        vendor,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
