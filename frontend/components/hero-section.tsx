import { Button } from "@/components/ui/button"
import { ArrowDown, Clock } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-accent opacity-60"
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
            100% Vegetarian
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
            Fresh Salads.
            <br />
            <span className="text-primary">Delivered Fresh</span> Every Morning.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto text-pretty">
            Start your day healthy with farm-fresh vegetarian salads delivered to your doorstep before breakfast. Free
            delivery. 10-hour shelf life.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-primary text-primary-foreground rounded-full text-sm sm:text-base font-medium">
            <Clock className="h-4 w-4" />
            Order by 6 PM, Delivery by 10 AM
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <a href="#menu">
                View Menu
                <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">How It Works</a>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              Starting at ₹80
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              Free Delivery
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              Morning Fresh
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
