"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, ArrowRight, Home } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface PaymentResult {
  status: "success" | "error"
  message: string
  orderId?: string
  amount?: string
  planName?: string
}

export default function PaymentResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<PaymentResult | null>(null)

  useEffect(() => {
    const status = searchParams.get("status")
    const message = searchParams.get("message")
    const orderId = searchParams.get("orderId") || undefined
    const amount = searchParams.get("amount") || undefined
    const planName = searchParams.get("planName") || undefined

    if (status === "success") {
      setResult({
        status: "success",
        message: message || "Payment completed successfully!",
        orderId,
        amount,
        planName
      })
    } else if (status === "error") {
      setResult({
        status: "error",
        message: message || "Payment failed. Please try again.",
        orderId
      })
    } else {
      // Invalid status, redirect to pricing
      router.push("/pricing")
    }
  }, [searchParams, router])

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment result...</p>
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
          <Card className="text-center">
            <CardHeader className="pb-6">
              {result.status === "success" ? (
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              )}
              
              <CardTitle className={`text-2xl ${result.status === "success" ? "text-green-600" : "text-red-600"}`}>
                {result.status === "success" ? "Payment Successful!" : "Payment Failed"}
              </CardTitle>
              
              <CardDescription className="text-lg">
                {result.message}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {result.status === "success" && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Subscription Details
                  </h3>
                  {result.planName && (
                    <p className="text-green-700 dark:text-green-300">
                      Plan: <span className="font-medium">{result.planName}</span>
                    </p>
                  )}
                  {result.amount && (
                    <p className="text-green-700 dark:text-green-300">
                      Amount: <span className="font-medium">₹{result.amount}</span>
                    </p>
                  )}
                  {result.orderId && (
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Order ID: {result.orderId}
                    </p>
                  )}
                </div>
              )}

              {result.status === "error" && result.orderId && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Order ID: {result.orderId}
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                    If you were charged, please contact support with this order ID.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {result.status === "success" ? (
                  <Button 
                    onClick={() => router.push("/account/subscription")}
                    className="flex items-center gap-2"
                  >
                    View Subscription <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => router.push("/pricing")}
                    className="flex items-center gap-2"
                  >
                    Try Again <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" /> Go Home
                </Button>
              </div>

              {result.status === "success" && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You can now access all premium features. Your subscription will be automatically renewed.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}





