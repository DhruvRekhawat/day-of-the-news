import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import Razorpay from "razorpay"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = await request.json()

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

    // Get order details from Razorpay to extract plan information
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    // Fetch order details from Razorpay
    const order = await razorpay.orders.fetch(razorpay_order_id)
    
    // Get plan information from order notes
    const planId = order.notes?.planId as string
    const planName = order.notes?.planName as string
    
    if (!planId) {
      return NextResponse.json(
        { error: "Plan information not found in order" },
        { status: 400 }
      )
    }

    // Get the pricing plan
    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId }
    })

    if (!plan) {
      return NextResponse.json(
        { error: "Pricing plan not found" },
        { status: 404 }
      )
    }

    // For now, just update user role to PREMIUM
    // TODO: Implement subscription tracking after database migration
    console.log(`Payment successful for user ${userId}, plan: ${planName}`)

    // Update user role to PREMIUM
    await prisma.user.update({
      where: { id: userId },
      data: { role: "PREMIUM" },
    })

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
