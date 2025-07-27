"use client"

import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"
import { useState } from "react"

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // Add your logout logic here
      // For example: await signOut() or redirect to logout endpoint
      console.log("Logging out...")

      // Simulate logout delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to login page or home
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading} className="gap-2 bg-transparent">
      <LogOutIcon className="h-4 w-4" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  )
}
