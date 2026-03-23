"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Store } from "lucide-react"
import { useStore } from "@/context/StoreContext"
import { STORES, getStoreLabel, storeSlugMap } from "@/lib/data"

export default function SelectStorePage() {
  const { selectedStore, setStore } = useStore()

  return (
    <main className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border-2 border-foreground poster-shadow-sm mb-5">
            <Store className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">Campus Bites</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-poster">SELECT YOUR STORE</h1>
          <p className="text-muted-foreground mt-3 font-medium">
            Continue with your campus location to see the correct restaurants and menu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {STORES.map((store) => (
            <Link
              key={store}
              href={`/${storeSlugMap[store]}`}
              onClick={() => setStore(store)}
              className="block"
            >
              <div className="group h-52 sm:h-60 bg-card border-2 border-foreground rounded-2xl poster-shadow p-6 text-left transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer active:scale-95">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Store
                    </span>
                    {selectedStore === store && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-foreground bg-accent text-accent-foreground text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex items-center">
                    <p className="text-3xl sm:text-4xl font-black text-poster">{getStoreLabel(store)}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                    Enter Store
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {selectedStore && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Current selection:{" "}
            <span className="font-bold text-foreground">{getStoreLabel(selectedStore)}</span>
          </p>
        )}
      </div>
    </main>
  )
}
