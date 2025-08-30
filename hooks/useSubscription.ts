import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"

interface SubscriptionData {
  id: string
  planName: string
  endDate: string
  autoRenew: boolean
}

interface SubscriptionStatus {
  hasActiveSubscription: boolean
  subscription?: SubscriptionData
  message?: string
}

export const useSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  const checkSubscription = async () => {
    if (!session?.user?.id) {
      setSubscriptionStatus(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/subscription/check")
      if (response.ok) {
        const data = await response.json()
        setSubscriptionStatus(data)
      } else {
        setSubscriptionStatus({ hasActiveSubscription: false })
      }
    } catch (error) {
      console.error("Error checking subscription:", error)
      setSubscriptionStatus({ hasActiveSubscription: false })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSubscription()
  }, [session?.user?.id])

  return {
    subscriptionStatus,
    isLoading,
    checkSubscription
  }
}
