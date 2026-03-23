import { Truck, Sun, Clock, Leaf } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const usps = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "No delivery charges on all orders",
  },
  {
    icon: Sun,
    title: "Delivery by 10 AM",
    description: "Fresh salad before breakfast",
  },
  {
    icon: Clock,
    title: "Order by 6 PM",
    description: "Place order a day before",
  },
  {
    icon: Leaf,
    title: "100% Vegetarian",
    description: "Pure veg, no compromise",
  },
]

export function UspSection() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {usps.map((usp) => (
            <Card key={usp.title} className="border-0 bg-background shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <usp.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{usp.title}</h3>
                <p className="text-sm text-muted-foreground">{usp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
