"use client"

import { useState, useRef, useEffect } from "react"
import { vendors, type StoreId } from "@/lib/data"
import { useCart } from "@/lib/cart-context"
import { Plus, Minus, ArrowRight, Search, Flame } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useStorePath } from "@/context/StoreContext"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/home/hero-section"
import { menuInside } from "@/data/menuInside"
import { menuOutside } from "@/data/menuOutside"
import type { MenuItemData } from "@/data/menuInside"

interface HomePageProps {
  store: StoreId
}

export function HomePage({ store }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const storePath = useStorePath()
  
  const { items, addItem, updateQuantity, removeItem, getTotal, getItemCount } = useCart()
  
  // Load store-specific menu
  const storeMenuItems: MenuItemData[] = store === "inside" ? menuInside : menuOutside
  
  // Only filter by search
  const searchFilteredItems = storeMenuItems.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.description.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const groupedItems = searchFilteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItemData[]>)

  const getCartItem = (itemId: string, itemPrices?: {label: string, price: number}[]) => {
    const variant = itemPrices ? (selectedVariants[itemId] || itemPrices[0].label) : undefined
    return items.find(i => i.menuItem.id === itemId && i.variant === variant)
  }

  const handleAdd = (item: MenuItemData) => {
    const cbriVendor = vendors.find(v => v.id === "cbri")
    const variant = item.prices ? (selectedVariants[item.id] || item.prices[0].label) : undefined
    // Convert MenuItemData to MenuItem shape for cart context
    const menuItem = {
      ...item,
      vendorId: "cbri",
      tags: item.tags || [],
    }
    if (cbriVendor) addItem(menuItem as any, cbriVendor, 1, [], undefined, variant)
  }
  const handleIncrease = (cartItemId: string, currentQty: number) => updateQuantity(cartItemId, currentQty + 1)
  const handleDecrease = (cartItemId: string, currentQty: number) => currentQty > 1 ? updateQuantity(cartItemId, currentQty - 1) : removeItem(cartItemId)

  const cartTotal = getTotal()
  const cartItemCount = getItemCount()

  const categoryScrollRef = useRef<HTMLDivElement>(null)

  const scrollToCategory = (catName: string) => {
      setActiveCategory(catName.toLowerCase())
      if (catName.toLowerCase() === "all" || Object.keys(groupedItems).length === 0) {
          window.scrollTo({ top: 0, behavior: "smooth" })
          return
      }
      const element = document.getElementById(`category-${catName}`)
      if (element) {
        // Offset mapping TopBar 64px + SearchBar 55px + TopTabs 55px = 174px
        const y = element.getBoundingClientRect().top + window.scrollY - 180
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
  }

  // Linear Scroll Spy Tracker mapping UI highlights
  useEffect(() => {
    if (searchQuery) return 

    const handleScroll = () => {
      const categoryElements = Object.keys(groupedItems).map(cat => ({
        id: cat,
        el: document.getElementById(`category-${cat}`)
      }))
      
      let currentActive = activeCategory
      for (const { id, el } of categoryElements) {
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 220 && rect.bottom > 220) {
            currentActive = id.toLowerCase()
          }
        }
      }
      if (currentActive !== activeCategory) {
        setActiveCategory(currentActive)
        const tabEl = document.getElementById(`tab-${currentActive}`)
        if (tabEl && categoryScrollRef.current) {
          const container = categoryScrollRef.current
          const scrollLeft = tabEl.offsetLeft - container.offsetWidth / 2 + tabEl.offsetWidth / 2
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [groupedItems, activeCategory, searchQuery])

  return (
    <div className="min-h-screen bg-background pb-28">
      <Header />
      <HeroSection />

      <main className="max-w-lg mx-auto">
        
        {/* 6. SEARCH BAR */}
        <div className="px-3 py-2 bg-background sticky top-[64px] z-40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted border-2 border-foreground rounded-xl py-2 pl-9 pr-4 text-sm font-bold placeholder:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 3. SCROLL SPY CATEGORY TABS */}
        {!searchQuery && (
          <div className="sticky top-[119px] z-40 bg-background border-b-2 border-border shadow-sm overflow-x-auto no-scrollbar" ref={categoryScrollRef}>
            <div className="flex px-3 py-2.5 gap-2 w-max">
              {Object.keys(groupedItems).map((catName) => (
                <button
                  key={`tab-${catName}`}
                  id={`tab-${catName.toLowerCase()}`}
                  onClick={() => scrollToCategory(catName)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full border-2 font-bold text-sm transition-all shadow-sm ${
                    activeCategory === catName.toLowerCase()
                      ? "bg-foreground text-background border-foreground scale-105"
                      : "bg-card text-foreground border-border hover:border-foreground"
                  }`}
                >
                  {catName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. ULTRA-DENSE MENU LIST */}
        <div className="px-3 py-4 space-y-6">
          {Object.entries(groupedItems).map(([categoryName, catItems]) => (
            <div key={categoryName} id={`category-${categoryName}`} className="space-y-3">
              
              <h2 className="text-xl font-black text-poster tracking-tight flex items-center justify-between">
                <span>{categoryName}</span>
                <span className="text-sm font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border-2 border-border shadow-sm">{catItems.length}</span>
              </h2>
              
              <div className="grid gap-0 border-2 border-foreground rounded-xl bg-card overflow-hidden shadow-sm divide-y-2 divide-border">
                {catItems.map((item) => {
                  const cartItem = getCartItem(item.id, item.prices)
                  const isSpicy = item.tags.includes("Spicy")
                  const currentPrice = item.prices ? (item.prices.find(p => p.label === (selectedVariants[item.id] || item.prices![0].label))?.price || item.price) : item.price

                  return (
                    <div key={item.id} className="flex gap-2 p-3 bg-card transition-colors hover:bg-muted/50">
                      
                      {/* Left Block: Data Density */}
                      <div className="flex-1 min-w-0 pr-2 pb-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-3.5 h-3.5 rounded border-[1.5px] border-green-600 flex items-center justify-center flex-shrink-0 bg-green-50">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                          </span>
                          <h4 className="font-bold text-[17px] leading-tight truncate text-foreground tracking-tight">{item.name}</h4>
                          {isSpicy && <Flame className="w-3.5 h-3.5 text-secondary flex-shrink-0" />}
                        </div>
                        {item.prices ? (
                          <div className="flex items-center gap-2 mb-1">
                            <select 
                              className="text-xs font-bold bg-background border-2 border-foreground rounded-md px-1.5 py-0.5 outline-none focus:border-primary cursor-pointer shadow-sm"
                              value={selectedVariants[item.id] || item.prices[0].label}
                              onChange={(e) => setSelectedVariants(prev => ({ ...prev, [item.id]: e.target.value }))}
                            >
                              {item.prices.map(p => (
                                <option key={p.label} value={p.label}>{p.label}</option>
                              ))}
                            </select>
                            <span className="font-black text-[14px] text-foreground">
                              Rs.{currentPrice}
                            </span>
                          </div>
                        ) : (
                          <p className="font-black text-[13px] mb-1 text-foreground">Rs.{item.price}</p>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-1 leading-snug pr-1 font-medium">{item.description}</p>
                      </div>
                      
                      {/* Right Block: Image & Absolute Stepper Extrusion */}
                      <div className="w-[100px] flex-shrink-0 flex flex-col items-center relative pb-3">
                        <div className="relative w-full aspect-square rounded-xl border-2 border-foreground overflow-hidden bg-muted shadow-sm">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        
                        <div className="absolute -bottom-1.5 w-[90%] h-[34px] bg-card rounded-lg border-2 border-foreground shadow-sm">
                          {!cartItem ? (
                            <button
                              onClick={() => handleAdd(item)}
                              className="w-full h-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-black text-xs uppercase tracking-wider transition-colors rounded-md active:scale-95"
                            >
                              ADD <Plus className="w-3 h-3 ml-0.5" />
                            </button>
                          ) : (
                            <div className="w-full h-full flex items-center justify-between bg-primary text-primary-foreground font-bold text-xs rounded-md overflow-hidden">
                              <button onClick={() => handleDecrease(cartItem.id, cartItem.quantity)} className="w-8 h-full flex items-center justify-center active:bg-foreground active:text-background transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                              <span className="flex-1 text-center tabular-nums text-sm">{cartItem.quantity}</span>
                              <button onClick={() => handleIncrease(cartItem.id, cartItem.quantity)} className="w-8 h-full flex items-center justify-center active:bg-foreground active:text-background transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          
          {Object.keys(groupedItems).length === 0 && (
            <div className="text-center py-16 text-muted-foreground font-medium">
              No items found matching your search.
            </div>
          )}
        </div>
      </main>

      {/* 5. STICKY CART BAR */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-4 left-0 right-0 p-3 bg-transparent safe-area-pb z-50 animate-in slide-in-from-bottom-2 fade-in duration-200 pointer-events-none">
          <div className="max-w-lg mx-auto pointer-events-auto">
            <Link
              href={storePath("/cart")}
              className="w-full h-14 flex items-center justify-between px-4 bg-foreground text-background rounded-2xl border-2 border-foreground font-bold active:scale-95 transition-transform shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:bg-foreground/90"
            >
              <div className="flex items-center gap-3">
                <div className="bg-background text-foreground w-8 h-8 rounded-full flex items-center justify-center border-2 border-foreground text-sm font-black border-dashed">
                  {cartItemCount}
                </div>
                <div className="flex flex-col text-left justify-center pb-0.5">
                  <span className="text-[10px] opacity-70 uppercase tracking-widest leading-none mb-1">Total</span>
                  <span className="text-[17px] leading-none tracking-tight">Rs.{cartTotal}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 uppercase tracking-wide text-[13px] bg-background text-foreground px-4 py-2 rounded-xl border-2 border-foreground shadow-sm">
                View Cart <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
