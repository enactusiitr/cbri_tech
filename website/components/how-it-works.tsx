import { Smartphone, ChefHat, Bike } from "lucide-react"

const steps = [
  {
    icon: Smartphone,
    step: "1",
    title: "Order by 6 PM",
    description: "Place your order through our website before 6 PM for next-day delivery",
  },
  {
    icon: ChefHat,
    step: "2",
    title: "We Prepare Fresh",
    description: "Our chefs prepare your salad fresh in the early morning hours",
  },
  {
    icon: Bike,
    step: "3",
    title: "Delivered by 10 AM",
    description: "Your fresh salad arrives at your doorstep before breakfast",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Getting your fresh morning salad is as easy as 1-2-3</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.step} className="text-center relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center relative">
                <step.icon className="h-10 w-10 text-primary" />
                <span className="absolute -top-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
