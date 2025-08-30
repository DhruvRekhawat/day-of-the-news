"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSubscription } from "@/hooks/useSubscription"
import { useSession } from "@/lib/auth-client"
import { Calendar, CreditCard, RefreshCw } from "lucide-react"
import { format } from "date-fns"

export default function SubscriptionPage() {
  const { data: session } = useSession()
  const { subscriptionStatus, isLoading, checkSubscription } = useSubscription()

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
                  <Badge variant="default" className="bg-green-500">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-200 mb-1">Expires on</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {subscriptionStatus.subscription?.endDate && 
                      format(new Date(subscriptionStatus.subscription.endDate), "PPP")}
                  </p>
                </div>

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
