"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { salads } from "@/lib/salads-data"
import { SaladCard } from "@/components/salad-card"
import { SaladDrawer } from "@/components/salad-drawer"
import { SaladModal } from "@/components/salad-modal"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Salad } from "@/lib/salads-data"

export function SaladMenu() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSalad, setSelectedSalad] = useState<Salad | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const isMobile = useIsMobile()

  const filteredSalads = useMemo(() => {
    if (!searchQuery.trim()) return salads
    const query = searchQuery.toLowerCase()
    return salads.filter(
      (salad) =>
        salad.name.toLowerCase().includes(query) ||
        salad.description.toLowerCase().includes(query) ||
        salad.ingredients.some((ing) => ing.toLowerCase().includes(query)) ||
        salad.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }, [searchQuery])

  const handleViewDetails = (salad: Salad) => {
    setSelectedSalad(salad)
    setDetailsOpen(true)
  }

  const handleCloseDetails = (open: boolean) => {
    setDetailsOpen(open)
    if (!open) {
      setSelectedSalad(null)
    }
  }

  return (
    <section id="menu" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Our Fresh Salads</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Choose from our selection of 10 handcrafted vegetarian salads. Available in half (200g) and full (300g)
            portions.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search salads, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 text-base"
            />
          </div>
        </div>

        {filteredSalads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSalads.map((salad) => (
              <SaladCard key={salad.id} salad={salad} onViewDetails={handleViewDetails} isSelected={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No salads found matching "{searchQuery}"</p>
          </div>
        )}

        {/* Mobile: Drawer, Desktop: Modal */}
        {isMobile ? (
          <SaladDrawer salad={selectedSalad} open={detailsOpen} onOpenChange={handleCloseDetails} />
        ) : (
          <SaladModal salad={selectedSalad} open={detailsOpen} onOpenChange={handleCloseDetails} />
        )}
      </div>
    </section>
  )
}
