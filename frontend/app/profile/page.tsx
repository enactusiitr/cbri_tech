"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Heart,
  Gift,
  Settings,
  Store,
} from "lucide-react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { useStore } from "@/context/StoreContext"
import { getStoreLabel } from "@/lib/data"

const menuItems = [
  { icon: MapPin, label: "Saved Addresses", href: "#" },
  { icon: CreditCard, label: "Payment Methods", href: "#" },
  { icon: Heart, label: "Favorites", href: "#" },
  { icon: Gift, label: "Rewards & Offers", href: "#", badge: "2 NEW" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
  { icon: HelpCircle, label: "Help & Support", href: "#" },
]

export default function ProfilePage() {
  const router = useRouter()
  const { selectedStore } = useStore()

  const handleChangeStore = () => {
    localStorage.removeItem("store")
    router.push("/select-store")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary px-4 py-8 border-b-2 border-foreground">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-card rounded-full border-4 border-foreground flex items-center justify-center poster-shadow">
              <User className="w-10 h-10 text-foreground" />
            </div>
            <div className="text-primary-foreground">
              <h1 className="text-2xl font-black text-poster">CAMPUS FOODIE</h1>
              <p className="opacity-90">+91 98765 43210</p>
              <button className="mt-1 text-sm font-bold underline">Edit Profile</button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="px-4 -mt-4 max-w-lg mx-auto">
        <div className="flex justify-around p-4 bg-card rounded-xl border-2 border-foreground poster-shadow">
          <div className="text-center">
            <p className="text-2xl font-black text-poster">12</p>
            <p className="text-sm text-muted-foreground">Orders</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-black text-poster">Rs.150</p>
            <p className="text-sm text-muted-foreground">Cashback</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-black text-poster">3</p>
            <p className="text-sm text-muted-foreground">Favorites</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button
          onClick={handleChangeStore}
          className="w-full mb-4 flex items-center justify-between p-4 bg-card rounded-xl border-2 border-foreground hover:bg-muted transition-colors poster-shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="font-bold">Change Store</p>
              <p className="text-sm text-muted-foreground">
                {selectedStore ? `Currently: ${getStoreLabel(selectedStore)}` : "Select your campus store"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="bg-card rounded-xl border-2 border-foreground overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between p-4 hover:bg-muted transition-colors ${
                index !== menuItems.length - 1 ? "border-b-2 border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-bold rounded">
                    {item.badge}
                  </span>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button className="flex items-center justify-center gap-2 w-full mt-4 p-4 bg-muted rounded-xl border-2 border-foreground font-bold text-secondary hover:bg-secondary/10 transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        {/* App Version */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Campus Bites v1.0.0
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
