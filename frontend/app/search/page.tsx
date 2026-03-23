"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ArrowLeft, Star, Clock, Flame } from "lucide-react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { cn } from "@/lib/utils"
import { useStoreData, useStorePath } from "@/context/StoreContext"

export default function SearchPage() {
  const { vendors, menuItems } = useStoreData()
  const storePath = useStorePath()
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "restaurants" | "dishes">("all")

  const filteredVendors = query
    ? vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(query.toLowerCase()) ||
          v.cuisine.some((c) => c.toLowerCase().includes(query.toLowerCase()))
      )
    : []

  const filteredItems = query
    ? menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : []

  const showVendors = activeTab === "all" || activeTab === "restaurants"
  const showItems = activeTab === "all" || activeTab === "dishes"

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b-2 border-foreground">
        <div className="flex items-center gap-3 h-16 px-4 max-w-lg mx-auto">
          <Link
            href={storePath("/")}
            className="p-2 rounded-lg border-2 border-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-card rounded-xl border-2 border-foreground">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search food or restaurants..."
              className="flex-1 bg-transparent focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Tabs */}
        {query && (
          <div className="flex gap-2 px-4 py-2 overflow-x-auto">
            {(["all", "restaurants", "dishes"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-bold border-2 border-foreground transition-all capitalize",
                  activeTab === tab
                    ? "bg-foreground text-background"
                    : "bg-card text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        {!query ? (
          /* Empty State */
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-black text-poster mb-2">SEARCH ANYTHING</h2>
            <p className="text-muted-foreground">
              Find your favorite restaurants or dishes
            </p>

            {/* Popular Searches */}
            <div className="mt-8">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Pizza", "Burger", "Dosa", "Noodles", "Wrap"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-card rounded-full border-2 border-foreground font-medium hover:bg-muted transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : filteredVendors.length === 0 && filteredItems.length === 0 ? (
          /* No Results */
          <div className="text-center py-12">
            <p className="text-xl font-black text-poster mb-2">NO RESULTS</p>
            <p className="text-muted-foreground">
              Try searching for something else
            </p>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Restaurants */}
            {showVendors && filteredVendors.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                  Restaurants ({filteredVendors.length})
                </h2>
                <div className="space-y-3">
                  {filteredVendors.map((vendor) => (
                    <Link
                      key={vendor.id}
                      href={storePath(`/vendor/${vendor.id}`)}
                      className="flex items-center gap-3 p-3 bg-card rounded-xl border-2 border-foreground hover:bg-muted transition-colors"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-foreground">
                        <Image
                          src={vendor.image}
                          alt={vendor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{vendor.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                          <span>{vendor.rating}</span>
                          <span>•</span>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{vendor.deliveryTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Dishes */}
            {showItems && filteredItems.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                  Dishes ({filteredItems.length})
                </h2>
                <div className="space-y-3">
                  {filteredItems.map((item) => {
                    const vendor = vendors.find((v) => v.id === item.vendorId)
                    return (
                      <Link
                        key={item.id}
                        href={storePath(`/vendor/${item.vendorId}`)}
                        className="flex items-center gap-3 p-3 bg-card rounded-xl border-2 border-foreground hover:bg-muted transition-colors"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-foreground">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{item.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{vendor?.name}</span>
                            {item.tags.includes("Spicy") && (
                              <Flame className="w-3.5 h-3.5 text-secondary" />
                            )}
                          </div>
                        </div>
                        <span className="font-bold">Rs.{item.price}</span>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
