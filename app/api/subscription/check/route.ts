import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await request.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Check if user has an active subscription
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: {
          gte: new Date()
        }
      },
      include: {
        plan: true
      }
    })

    if (activeSubscription) {
      return NextResponse.json({
        hasActiveSubscription: true,
        subscription: {
          id: activeSubscription.id,
          planName: activeSubscription.plan.name,
          endDate: activeSubscription.endDate,
          autoRenew: activeSubscription.autoRenew
        }
      })
    }

    // Check if user has expired subscriptions
    const expiredSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: {
          lt: new Date()
        }
      }
    })

    // If there's an expired subscription, update it and downgrade user
    if (expiredSubscription) {
      await prisma.subscription.update({
        where: { id: expiredSubscription.id },
        data: { status: 'EXPIRED' }
      })

      await prisma.user.update({
        where: { id: userId },
        data: { role: 'FREE' }
      })

      return NextResponse.json({
        hasActiveSubscription: false,
        message: "Subscription has expired"
      })
    }

    return NextResponse.json({
      hasActiveSubscription: false
    })

  } catch (error) {
    console.error("Error checking subscription:", error)
    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    )
  }
}
