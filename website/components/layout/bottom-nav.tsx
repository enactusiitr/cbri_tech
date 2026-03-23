"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStorePath } from "@/context/StoreContext"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
]

export function BottomNav() {
  const pathname = usePathname()
  const storePath = useStorePath()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-foreground safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const itemPath = storePath(item.href)
          const isActive = pathname === itemPath
          return (
            <Link
              key={item.href}
              href={itemPath}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6",
                  isActive && "stroke-[2.5]"
                )}
              />
              <span className={cn(
                "text-xs font-medium",
                isActive && "font-bold"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
