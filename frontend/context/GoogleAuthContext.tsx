"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface UserProfile {
  name: string
  email: string
  picture: string
}

interface GoogleAuthContextType {
  user: UserProfile | null
  isAuthReady: boolean
  login: (credential: string) => void
  logout: () => void
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined)

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext)
  if (!context) {
    throw new Error("useGoogleAuth must be used within a GoogleAuthProvider")
  }
  return context
}

export const GoogleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    // Load from localStorage on mount
    const savedUser = localStorage.getItem("google_auth_session")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem("google_auth_session")
      }
    }
    setIsAuthReady(true)
  }, [])

  const decodeJwt = (token: string): any => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
      return JSON.parse(jsonPayload)
    } catch (e) {
      return null
    }
  }

  const login = (credential: string) => {
    const decoded = decodeJwt(credential)
    if (decoded && decoded.email) {
      const domain = decoded.email.split("@")[1]
      if (domain === "iitr.ac.in" || domain.endsWith(".iitr.ac.in")) {
        const userProfile: UserProfile = {
          name: decoded.name || "",
          email: decoded.email,
          picture: decoded.picture || "",
        }
        setUser(userProfile)
        localStorage.setItem("google_auth_session", JSON.stringify(userProfile))
      } else {
        alert("Access Denied: Only .iitr.ac.in (and its subdomains) emails are allowed.")
        logout()
      }
    } else {
        alert("Invalid login credential.")
        logout()
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("google_auth_session")
  }

  return (
    <GoogleAuthContext.Provider value={{ user, isAuthReady, login, logout }}>
      {children}
    </GoogleAuthContext.Provider>
  )
}
