import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { StoreProvider, StoreGuard } from "@/context/StoreContext"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Campus Bites - Food Delivery for Students",
  description:
    "Order delicious food from your favorite campus vendors. Fast delivery, great prices, perfect for students. Wok & Roll, Burger Barn, Dosa Express, and more!",
  keywords: [
    "campus food delivery",
    "student food",
    "college delivery",
    "fast food",
    "Asian food",
    "burgers",
    "pizza",
    "dosa",
    "wraps",
  ],
  authors: [{ name: "Campus Bites" }],
  creator: "Campus Bites",
  publisher: "Campus Bites",
  generator: "v0.app",
  metadataBase: new URL("https://campusbites.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://campusbites.app",
    siteName: "Campus Bites",
    title: "Campus Bites - Food Delivery for Students",
    description:
      "Order delicious food from your favorite campus vendors. Fast delivery, great prices, perfect for students.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Campus Bites - Food Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Bites - Food Delivery for Students",
    description:
      "Order delicious food from your favorite campus vendors. Fast delivery, great prices.",
    images: ["/og-image.jpg"],
    creator: "@campusbites",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)", color: "#ea580c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased grain-texture">
        <StoreProvider>
          <CartProvider>
            <StoreGuard>{children}</StoreGuard>
          </CartProvider>
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
