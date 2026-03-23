import { Leaf, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6" />
              <span className="font-semibold text-lg">Fresh Bowl</span>
            </div>
            <p className="text-background/70 text-sm">
              Fresh vegetarian salads delivered to your doorstep every morning. Eat healthy, live healthy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@freshbowl.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, Maharashtra</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Info</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Free delivery on all orders</li>
              <li>Order by 6 PM for next-day delivery</li>
              <li>10-hour shelf life guaranteed</li>
              <li>100% vegetarian kitchen</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} Fresh Bowl. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
