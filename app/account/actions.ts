"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Utility to fetch session and user ID
async function getSessionUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.id || null;
}

// 🧠 1. Get User Profile with Counts
export async function getUserAccountData() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    });

    return user;
  } catch (error) {
    console.error("Error fetching user account data:", error);
    return null;
  }
}

// 📚 2. Get User Bookmarks
export async function getUserBookmarks() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return [];

    const bookmarks = await prisma.eventBookmark.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            summary: true,
            topic: true,
            publishedAt: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookmarks.map((b) => ({
      id: b.id,
      createdAt: b.createdAt,
      event: b.event,
    }));
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

// ❤️ 3. Get User Likes
export async function getUserLikes() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return [];

    const likes = await prisma.eventLike.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            summary: true,
            topic: true,
            publishedAt: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return likes.map((like) => ({
      id: like.id,
      createdAt: like.createdAt,
      event: like.event,
    }));
  } catch (error) {
    console.error("Error fetching likes:", error);
    return [];
  }
}

// 🔖 4. Get User Followed Topics
export async function getUserFollowedTopics() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return [];

    const followedTopics = await prisma.followedTopic.findMany({
      where: { userId },
      include: {
        topic: true,
      },
    });

    return followedTopics.map((f) => f.topic);
  } catch (error) {
    console.error("Error fetching followed topics:", error);
    return [];
  }
}

// 🖼️ 5. Update User Image
export async function updateUserImage(imageUrl: string) {
  try {
    const userId = await getSessionUserId();
    if (!userId) throw new Error("Unauthorized");

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
      select: {
        id: true,
        image: true,
      },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user image:", error);
    throw new Error("Failed to update image");
  }
}
