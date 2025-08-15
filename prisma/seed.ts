import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create pricing plans
  const plans = [
    {
      name: "Basic",
      price: 299,
      currency: "INR",
      period: "monthly",
      description: "Perfect for individual users who want to understand news bias and get reliable information.",
      features: [
        "Access to all news articles",
        "Bias analysis for each article",
        "Basic search functionality",
        "Email support"
      ],
      isPopular: false,
      isActive: true,
    },
    {
      name: "Premium",
      price: 599,
      currency: "INR",
      period: "monthly",
      description: "Advanced features for power users and professionals who need comprehensive news analysis.",
      features: [
        "Everything in Basic",
        "Advanced bias reporting",
        "Priority support",
        "Custom news alerts",
        "Export functionality",
        "API access"
      ],
      isPopular: true,
      isActive: true,
    }
  ]

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    })
  }

  console.log('Pricing plans seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
