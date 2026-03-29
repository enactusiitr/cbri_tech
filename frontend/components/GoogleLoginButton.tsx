"use client"

import { useEffect, useRef } from "react"
import { useGoogleAuth } from "@/context/GoogleAuthContext"

declare global {
  interface Window {
    google?: any
  }
}

export function GoogleLoginButton() {
  const { login } = useGoogleAuth()
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      
      if (!clientId || clientId.includes("YOUR_GOOGLE_CLIENT_ID")) {
        console.error("Missing Google Client ID! Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local")
        if (buttonRef.current) {
          buttonRef.current.innerHTML = "<div class='text-red-500 text-sm font-bold p-2 border border-red-500 rounded text-center'>Missing Client ID in .env.local</div>"
        }
        return // Prevent initializing with empty client ID
      }

      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            login(response.credential)
          },
        })
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "filled_black",
          size: "medium",
          shape: "pill",
          text: "signin_with",
          locale: "en",
        })
      }
    }

    if (window.google && window.google.accounts) {
      initializeGoogleSignIn()
    } else {
      const intervalId = setInterval(() => {
        if (window.google && window.google.accounts) {
          clearInterval(intervalId)
          initializeGoogleSignIn()
        }
      }, 100)
      return () => clearInterval(intervalId)
    }
  }, [login])

  return <div ref={buttonRef} className="overflow-hidden rounded-full"></div>
}
