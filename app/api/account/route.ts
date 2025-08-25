import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function GET() {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    })


    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 402 })
    }

    // Get user data with counts
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            eventBookmarks: true,
            eventLikes: true,
            followedTopics: true,
            interactions: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user account data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { image } = body

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    // Update user image
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image },
      select: {
        id: true,
        image: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating user image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
