import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { prisma } from "@/lib/prisma"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json()

    // Fetch the pricing plan
    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return NextResponse.json(
        { error: "Pricing plan not found" },
        { status: 404 }
      )
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(plan.price * 100), // Convert to paise
      currency: plan.currency,
      receipt: `order_${Date.now()}`,
      notes: {
        planId: plan.id,
        userId: userId,
        planName: plan.name,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
