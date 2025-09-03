"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubscription } from "@/hooks/useSubscription"
import { useSession } from "@/lib/auth-client"
import { format } from "date-fns"
import { Calendar, CheckCircle, Clock, CreditCard, DollarSign, RefreshCw } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function SubscriptionPage() {
  const { data: session } = useSession()
  const { subscriptionStatus, isLoading, checkSubscription } = useSubscription()
  const searchParams = useSearchParams()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Check if user just completed payment
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccessMessage(true)
      toast.success("Welcome to premium! Your subscription is now active.")
      
      // Remove success param from URL
      const url = new URL(window.location.href)
      url.searchParams.delete("success")
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams])

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to view your subscription</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getSubscriptionStatus = (endDate: Date) => {
    const daysRemaining = getDaysRemaining(endDate)
    if (daysRemaining <= 0) return "Expired"
    if (daysRemaining <= 7) return "Expiring Soon"
    return "Active"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
            <p className="text-gray-600 dark:text-gray-200">
              Manage your subscription and billing information
            </p>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Welcome to Premium!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your subscription is now active. Enjoy all premium features!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ) : subscriptionStatus?.hasActiveSubscription ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Active Subscription
                    </CardTitle>
                    <CardDescription>
                      You have an active subscription to our premium plan
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="default" 
                    className={`${
                      getSubscriptionStatus(new Date(subscriptionStatus.subscription?.endDate || "")) === "Expired" 
                        ? "bg-red-500" 
                        : getSubscriptionStatus(new Date(subscriptionStatus.subscription?.endDate || "")) === "Expiring Soon"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {getSubscriptionStatus(new Date(subscriptionStatus.subscription?.endDate || ""))}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-200">Plan</p>
                    <p className="font-medium">{subscriptionStatus.subscription?.planName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-200">Auto Renew</p>
                    <p className="font-medium">
                      {subscriptionStatus.subscription?.autoRenew ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-200">Started on</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {subscriptionStatus.subscription?.startDate && 
                        format(new Date(subscriptionStatus.subscription.startDate), "PPP")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-200">Expires on</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {subscriptionStatus.subscription?.endDate && 
                        format(new Date(subscriptionStatus.subscription.endDate), "PPP")}
                    </p>
                  </div>
                </div>

                {/* Days Remaining */}
                {subscriptionStatus.subscription?.endDate && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-200">Subscription Status</span>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300">
                      {(() => {
                        const daysRemaining = getDaysRemaining(new Date(subscriptionStatus.subscription.endDate))
                        if (daysRemaining <= 0) {
                          return "Your subscription has expired. Please renew to continue accessing premium features."
                        } else if (daysRemaining <= 7) {
                          return `Your subscription expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}. Consider renewing to avoid interruption.`
                        } else {
                          return `Your subscription is active for ${daysRemaining} more day${daysRemaining === 1 ? '' : 's'}.`
                        }
                      })()}
                    </p>
                  </div>
                )}

                {/* Amount */}
                {subscriptionStatus.subscription?.amount && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>Amount: ₹{subscriptionStatus.subscription.amount}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={checkSubscription}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Status
                  </Button>
                  <Button variant="destructive">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  No Active Subscription
                </CardTitle>
                <CardDescription>
                  {subscriptionStatus?.message || "You don't have an active subscription"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-200 mb-4">
                  Upgrade to premium to unlock advanced features and higher usage limits.
                </p>
                <Button onClick={() => window.location.href = "/pricing"}>
                  View Plans
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
