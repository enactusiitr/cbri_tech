"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  getMenuItemsByStore,
  getVendorsByStore,
  isValidStore,
  isValidStoreSlug,
  slugStoreMap,
  storeSlugMap,
  type StoreId,
} from "@/lib/data"

const STORE_KEY = "store"

interface StoreContextType {
  selectedStore: StoreId | null
  isHydrated: boolean
  setStore: (store: StoreId) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedStore, setSelectedStore] = useState<StoreId | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const currentSlug = pathname.split("/")[1]
  const routeStore = isValidStoreSlug(currentSlug) ? slugStoreMap[currentSlug] : null
  const activeStore = routeStore ?? selectedStore

  useEffect(() => {
    const storedValue = localStorage.getItem(STORE_KEY)
    if (isValidStore(storedValue)) {
      setSelectedStore(storedValue)
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    if (routeStore) {
      setSelectedStore(routeStore)
      localStorage.setItem(STORE_KEY, routeStore)
      return
    }

    if (!activeStore && pathname !== "/") {
      router.replace("/")
      return
    }

    // Disable auto redirect from `/` so user can manually select store
    // if (activeStore && pathname === "/") {
    //   router.replace(`/${storeSlugMap[activeStore]}`)
    // }
  }, [activeStore, isHydrated, pathname, routeStore, router])

  const setStore = useCallback((store: StoreId) => {
    localStorage.setItem(STORE_KEY, store)
    setSelectedStore(store)
  }, [])

  const value = useMemo(
    () => ({
      selectedStore: activeStore,
      isHydrated,
      setStore,
    }),
    [activeStore, isHydrated, setStore]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return context
}

export function useStoreData() {
  const { selectedStore } = useStore()
  const scopedVendors = useMemo(
    () => (selectedStore ? getVendorsByStore(selectedStore) : []),
    [selectedStore]
  )
  const scopedMenuItems = useMemo(
    () => (selectedStore ? getMenuItemsByStore(selectedStore) : []),
    [selectedStore]
  )

  return {
    selectedStore,
    vendors: scopedVendors,
    menuItems: scopedMenuItems,
  }
}

export function useStorePath() {
  const { selectedStore } = useStore()

  return useCallback(
    (path = "/") => {
      const normalized = path.startsWith("/") ? path : `/${path}`
      if (!selectedStore) return normalized
      const prefix = `/${storeSlugMap[selectedStore]}`
      return normalized === "/" ? prefix : `${prefix}${normalized}`
    },
    [selectedStore]
  )
}

export function StoreGuard({ children }: { children: ReactNode }) {
  const { isHydrated } = useStore()
  const pathname = usePathname()

  if (!isHydrated && pathname !== "/") {
    return null
  }

  return <>{children}</>
}
