"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, ShoppingBag, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useStore, useStorePath } from "@/context/StoreContext"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { STORES, getStoreLabel, storeSlugMap, type StoreId } from "@/lib/data"
import { GoogleLoginButton } from "@/components/GoogleLoginButton"
import { useGoogleAuth } from "@/context/GoogleAuthContext"
export function Header() {
  const { getItemCount } = useCart()
  const { selectedStore, setStore } = useStore()
  const storePath = useStorePath()
  const router = useRouter()
  const itemCount = getItemCount()
  const { user, logout } = useGoogleAuth()

  const handleStoreChange = (store: StoreId) => {
    setStore(store)
    router.push(`/${storeSlugMap[store]}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-foreground">
      <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
        {/* Logo */}
        <Link href={storePath("/")} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg border-2 border-foreground poster-shadow-sm flex items-center justify-center">
            <span className="text-xl font-black text-primary-foreground">Z</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black tracking-tight text-poster">Zakaaz</h1>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-full border-2 border-foreground text-sm font-medium hover:bg-accent transition-colors">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="max-w-[120px] truncate hidden sm:inline">
                  {selectedStore ? getStoreLabel(selectedStore) : "Select Store"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48 border-2 border-foreground poster-shadow-sm">
              {STORES.map((store) => (
                <DropdownMenuItem 
                  key={store} 
                  onClick={() => handleStoreChange(store)}
                  className="font-medium cursor-pointer"
                >
                  {getStoreLabel(store)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <Link
            href={storePath("/profile")}
            className="flex items-center justify-center w-10 h-10 bg-card rounded-full border-2 border-foreground transition-all hover:bg-muted poster-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            {user ? (
              <img src={user.picture} alt="Profile" className="w-[1.875rem] h-[1.875rem] rounded-full" />
            ) : (
              <User className="w-5 h-5 text-foreground" />
            )}
          </Link>

          {/* Cart */}
          <Link
            href={storePath("/cart")}
            className={cn(
              "relative p-2 rounded-lg border-2 border-foreground transition-all",
              itemCount > 0
                ? "bg-primary text-primary-foreground poster-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                : "bg-card hover:bg-muted"
            )}
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center border-2 border-foreground">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
