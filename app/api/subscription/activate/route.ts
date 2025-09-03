import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
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

    const { 
      userId, 
      planId, 
      razorpayPaymentId, 
      razorpayOrderId,
      amount 
    } = await request.json()

    // Verify the user is updating their own subscription
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get the pricing plan details
    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId }
    })

    if (!plan) {
      return NextResponse.json(
        { error: "Pricing plan not found" },
        { status: 404 }
      )
    }

    // Calculate subscription dates
    const now = new Date()
    const startDate = now
    const endDate = new Date(now)
    
    // Add months based on plan period
    if (plan.period === "month") {
      endDate.setMonth(endDate.getMonth() + 1)
    } else if (plan.period === "year") {
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else {
      // Default to 1 month
      endDate.setMonth(endDate.getMonth() + 1)
    }

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: {
        userId: userId
      },
      update: {
        planId: planId,
        planName: plan.name,
        startDate: startDate,
        endDate: endDate,
        status: "ACTIVE",
        autoRenew: true,
        lastPaymentId: razorpayPaymentId,
        lastOrderId: razorpayOrderId,
        lastPaymentDate: now,
        amount: amount || plan.price
      },
      create: {
        userId: userId,
        planId: planId,
        planName: plan.name,
        startDate: startDate,
        endDate: endDate,
        status: "ACTIVE",
        autoRenew: true,
        lastPaymentId: razorpayPaymentId,
        lastOrderId: razorpayOrderId,
        lastPaymentDate: now,
        amount: amount || plan.price
      }
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: userId,
        planId: planId,
        amount: amount || plan.price,
        currency: plan.currency,
        status: "COMPLETED",
        razorpayPaymentId: razorpayPaymentId,
        razorpayOrderId: razorpayOrderId,
        paymentDate: now
      }
    })

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        planName: subscription.planName,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status
      }
    })

  } catch (error) {
    console.error("Error activating subscription:", error)
    return NextResponse.json(
      { error: "Failed to activate subscription" },
      { status: 500 }
    )
  }
}





