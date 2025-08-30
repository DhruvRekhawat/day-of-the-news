"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"
import { usePayment } from "@/hooks/usePayment"
import { useSession } from "@/lib/auth-client"
import AuthModal from "@/components/sign-in-modal"
import { toast } from "sonner"

interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
  period: string
  description: string
  features: string[]
  isPopular: boolean
  isActive: boolean
}

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<PricingPlan | null>(null)
  const { data: session } = useSession()
  const { handlePayment, isLoading: isPaymentLoading, isRazorpayLoaded, scriptLoadError } = usePayment()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/pricing")
        if (response.ok) {
          const data = await response.json()
          setPlans(data)
        }
      } catch (error) {
        console.error("Error fetching plans:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!session?.user?.id) {
      // Show sign in modal if user is not logged in
      setPendingPlan(plan)
      setShowAuthModal(true)
      return
    }

    if (scriptLoadError) {
      toast.error(scriptLoadError)
      return
    }

    if (!isRazorpayLoaded) {
      toast.error("Payment gateway is still loading. Please try again in a moment.")
      return
    }

    await handlePayment(plan.id, session.user.id, plan.name, {
      name: session.user.name || undefined,
      email: session.user.email || undefined
    })
  }

  const handleAuthSuccess = async () => {
    if (pendingPlan && session?.user?.id) {
      // Retry the subscription after successful login
      await handlePayment(pendingPlan.id, session.user.id, pendingPlan.name, {
        name: session.user.name || undefined,
        email: session.user.email || undefined
      })
      setPendingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">PRICING</p>
          <h1 className="text-4xl font-bold  mb-4">Choose your perfect plan</h1>
          <p className="text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
            Get unlimited access to bias analysis, fact-checking, and AI-powered insights. Select the plan that best fits your needs and start exploring news from every perspective.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="p-8 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-8 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-8 rounded-lg ${
                  plan.isPopular ? "bg-gray-900 text-white" : "border border-gray-200"
                }`}
              >
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className={`text-sm ${plan.isPopular ? "" : "text-gray-600 dark:text-gray-200"} mb-6`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      ₹{plan.price}
                    </span>
                    <span className={`ml-1 ${plan.isPopular ? "" : "text-gray-600 dark:text-gray-200"}`}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className={`font-medium mb-4 ${plan.isPopular ? "text-white" : ""}`}>
                    What&apos;s included
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className={`w-5 h-5 mr-3 ${plan.isPopular ? "text-white" : ""}`} />
                        <span className={`text-sm ${plan.isPopular ? "" : "text-gray-600 dark:text-gray-200"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className="w-full" 
                  variant={plan.isPopular ? "secondary" : "default"}
                  onClick={() => handleSubscribe(plan)}
                  disabled={isPaymentLoading || !isRazorpayLoaded || !!scriptLoadError}
                >
                  {isPaymentLoading ? "Processing..." : 
                   scriptLoadError ? "Payment Unavailable" :
                   !isRazorpayLoaded ? "Loading..." :
                   session?.user?.id ? "Subscribe Now" : "Sign In to Subscribe"}
                </Button>
                
                {!session?.user?.id && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                    You&apos;ll need to sign in to subscribe to this plan
                  </p>
                )}
                
                {scriptLoadError && (
                  <p className="text-xs text-center text-red-600 dark:text-red-400 mt-2">
                    {scriptLoadError}
                  </p>
                )}
                
                {!isRazorpayLoaded && !scriptLoadError && (
                  <p className="text-xs text-center text-yellow-600 dark:text-yellow-400 mt-2">
                    Payment gateway is loading...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      
      {/* Auth Modal for non-logged in users */}
      <AuthModal 
        isOpen={showAuthModal}
        onOpenChange={(open) => {
          setShowAuthModal(open)
          if (!open) {
            // Clear pending plan if modal is closed without signing in
            setPendingPlan(null)
          }
        }}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}
