import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSummary } from "@/lib/openai-client"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get the event with its articles
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        articles: {
          include: {
            article: {
              select: {
                content: true,
                excerpt: true,
                title: true,
              },
            },
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    if (event.aiSummary) {
      return NextResponse.json({
        success: true,
        aiSummary: event.aiSummary,
        cached: true,
      })
    }

    if (event.articles.length === 0) {
      return NextResponse.json(
        { error: "No articles found for this event" },
        { status: 400 }
      )
    }

    // Create a comprehensive summary from all articles in the event
    const allContent = event.articles
      .map(ea => ea.article.content || ea.article.excerpt || ea.article.title)
      .filter(Boolean)
      .join('\n\n')
      .substring(0, 3000) // Limit content to avoid token limits

    // Generate AI summary
    const aiSummary = await generateSummary(allContent)

    if (!aiSummary) {
      return NextResponse.json(
        { error: "Failed to generate AI summary" },
        { status: 500 }
      )
    }

    // Update the event with the generated AI summary
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { aiSummary },
    })

    return NextResponse.json({
      success: true,
      aiSummary,
      cached: false,
      event: updatedEvent,
    })
  } catch (error) {
    console.error("Error generating AI summary:", error)
    return NextResponse.json(
      { error: "Failed to generate AI summary" },
      { status: 500 }
    )
  }
}
