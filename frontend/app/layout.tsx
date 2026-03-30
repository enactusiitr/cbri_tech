import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { StoreProvider, StoreGuard } from "@/context/StoreContext"
import { GoogleAuthProvider } from "@/context/GoogleAuthContext"
import Script from "next/script"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zakaaz - Food Delivery for Students",
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
  authors: [{ name: "Zakaaz" }],
  creator: "Zakaaz",
  publisher: "Zakaaz",
  generator: "v0.app",
  metadataBase: new URL("https://Zakaaz.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://Zakaaz.app",
    siteName: "Zakaaz",
    title: "Zakaaz - Food Delivery for Students",
    description:
      "Order delicious food from your favorite campus vendors. Fast delivery, great prices, perfect for students.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zakaaz - Food Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zakaaz - Food Delivery for Students",
    description:
      "Order delicious food from your favorite campus vendors. Fast delivery, great prices.",
    images: ["/og-image.jpg"],
    creator: "@Zakaaz",
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
        url: "/icon.png",
        type: "image/png",
        sizes: "any",
      },
    ],
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
        <GoogleAuthProvider>
          <StoreProvider>
            <CartProvider>
              <StoreGuard>{children}</StoreGuard>
            </CartProvider>
          </StoreProvider>
        </GoogleAuthProvider>
        <Script src="https://accounts.google.com/gsi/client?hl=en" strategy="beforeInteractive" />
        <Analytics />
      </body>
    </html>
  )
}
