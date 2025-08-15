import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const plans = await prisma.pricingPlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: 'asc',
      },
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching pricing plans:", error)
    return NextResponse.json(
      { error: "Failed to fetch pricing plans" },
      { status: 500 }
    )
  }
}
