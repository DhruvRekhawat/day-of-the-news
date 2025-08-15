"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"
import { usePayment } from "@/hooks/usePayment"
import { useSession } from "@/lib/auth-client"

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
  const { data: session } = useSession()
  const { handlePayment, isLoading: isPaymentLoading } = usePayment()

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
      // Handle not logged in case
      return
    }

    await handlePayment(plan.id, session.user.id, plan.name)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">PRICING</p>
          <h1 className="text-4xl font-bold  mb-4">Affordable pricing plans</h1>
          <p className="text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id arcu, convallis est sed. Proin nulla eu a vitae
            lectus leo suscipit.
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
            {plans.map((plan, index) => (
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
                  disabled={isPaymentLoading}
                >
                  {isPaymentLoading ? "Processing..." : "Subscribe Now"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
