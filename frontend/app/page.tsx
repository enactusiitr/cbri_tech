"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Store } from "lucide-react"
import { useStore } from "@/context/StoreContext"
import { STORES, getStoreLabel, storeSlugMap } from "@/lib/data"
import { GoogleLoginButton } from "@/components/GoogleLoginButton"
import { useGoogleAuth } from "@/context/GoogleAuthContext"
import { getStoreClosedMessage, getStoreTimingLabel, isStoreOpen } from "@/lib/store-hours"

export default function SelectStorePage() {
  const { selectedStore, setStore } = useStore()
  const { user } = useGoogleAuth()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border-2 border-foreground poster-shadow-sm mb-5">
            <Store className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">Zakaaz</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-poster">SELECT YOUR STORE</h1>
          <p className="text-muted-foreground mt-3 font-medium">
            Continue with your campus location to see the correct restaurants and menu.
          </p>
        </div>

        {!user && (
          <div className="flex flex-col items-center justify-center mb-8 bg-card p-6 rounded-2xl border-2 border-foreground poster-shadow-sm">
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4 text-center text-sm font-medium">
              Please authenticate with your Google account (.iitr.ac.in) to explore the menu and place orders.
            </p>
            <GoogleLoginButton />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {STORES.map((store) => {
            const open = isStoreOpen(store, now)
            const canEnter = Boolean(user) && open

            return (
              <Link
                key={store}
                href={canEnter ? `/${storeSlugMap[store]}` : "#"}
                onClick={(event) => {
                  if (!user) {
                    event.preventDefault()
                    return
                  }

                  if (!open) {
                    event.preventDefault()
                    return
                  }

                  setStore(store)
                }}
                className="block"
              >
                <div
                  className={`group h-52 sm:h-60 bg-card border-2 border-foreground rounded-2xl poster-shadow p-6 text-left transition-all cursor-pointer active:scale-95 ${
                    canEnter ? "hover:translate-x-1 hover:translate-y-1 hover:shadow-none" : "opacity-80"
                  }`}
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Store</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] font-bold ${
                          open
                            ? "border-green-700 bg-green-100 text-green-800"
                            : "border-red-700 bg-red-100 text-red-800"
                        }`}
                      >
                        {open ? "Open" : "Closed"}
                      </span>
                      {selectedStore === store && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-foreground bg-accent text-accent-foreground text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-3xl sm:text-4xl font-black text-poster">{getStoreLabel(store)}</p>
                      <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-2">
                        Timings: {getStoreTimingLabel(store)}
                      </p>
                      {!open && (
                        <p className="text-xs sm:text-sm font-semibold text-red-600 mt-1">
                          {getStoreClosedMessage(store)}
                        </p>
                      )}
                    </div>
                    <div className={`inline-flex items-center gap-2 text-sm font-bold ${canEnter ? "text-primary" : "text-muted-foreground"}`}>
                      {canEnter ? "Enter Store" : "sed"}
                      {canEnter && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
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
