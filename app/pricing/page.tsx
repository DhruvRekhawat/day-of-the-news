import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "$99",
      period: "/monthly",
      description: "Lorem ipsum dolor sit amet doloroli sitiol conse ctetur adipiscing elit.",
      features: ["All analytics features", "Up to 250,000 tracked visits", "Normal support", "Up to 3 team members"],
      buttonText: "Get started",
      buttonVariant: "default" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$199",
      period: "/monthly",
      description: "Lorem ipsum dolor sit amet doloroli sitiol conse ctetur adipiscing elit.",
      features: [
        "All analytics features",
        "Up to 1,000,000 tracked visits",
        "Premium support",
        "Up to 10 team members",
      ],
      buttonText: "Get started",
      buttonVariant: "secondary" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$399",
      period: "/monthly",
      description: "Lorem ipsum dolor sit amet doloroli sitiol conse ctetur adipiscing elit.",
      features: [
        "All analytics features",
        "Up to 5,000,000 tracked visits",
        "Dedicated support",
        "Up to 50 team members",
      ],
      buttonText: "Get started",
      buttonVariant: "default" as const,
      popular: false,
    },
  ]

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

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={` p-8 ${
                plan.popular ? "bg-gray-900 text-white" : " border border-gray-200"
              }`}
            >
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.popular ? "" : "text-gray-600 dark:text-gray-200"} mb-6`}>{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`ml-1 ${plan.popular ? "" : "text-gray-600 dark:text-gray-200"}`}>{plan.period}</span>
                </div>
              </div>

              <div className="mb-8">
                <p className={`font-medium mb-4 ${plan.popular ? "text-white" : ""}`}>What&apos;s included</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className={`w-5 h-5 mr-3 ${plan.popular ? "text-white" : ""}`} />
                      <span className={`text-sm ${plan.popular ? "" : "text-gray-600 dark:text-gray-200"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full" variant={plan.popular ? "secondary" : "default"}>
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
