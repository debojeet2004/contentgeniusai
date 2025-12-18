import { db } from "@/db/drizzle";
import { getCurrentUser } from "@/lib/session";
import { and, eq, isNotNull, isNull } from "drizzle-orm";

export async function getBrandBlogsForUser({ brandId }: { brandId: string }) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, message: "User not found" };
  }

  try {
    const blogs = await db.query.blog.findMany({
      where: (blogs) =>
        // FIX: Use Drizzle's 'and()' to join the three necessary conditions
        and(
          eq(blogs.userId, user.id), // 1. SECURITY: Filter by User ID
          //   isNotNull(blogs.brandId), // 2. Filter for non-null brand IDs
          eq(blogs.brandId, brandId) // 3. FILTER: Filter by the specific Brand ID
        ),
      columns: {
        id: true,
        status: true,
        contentType: true,
        createdAt: true,
        tags: true,
        inputmetadata: true,
      },
    });
    const transformedBlogs = blogs.map((b) => ({
      id: b.id,
      status: b.status,
      contentType: b.contentType,
      createdAt: b.createdAt,
      tags: b.tags || [],
      inputmetadata: {
        topic: (b.inputmetadata as { topic?: string })?.topic,
        description: (b.inputmetadata as { description?: string })?.description,
      },
    }));

    return {
      success: true,
      blogs: transformedBlogs,
    };
  } catch (error) {
    console.error("Error fetching brand blogs:", error);
    return { success: false, message: "Failed to fetch brand blogs" };
  }
}

export async function getCasualBlogsForUser() {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, message: "User not found" };
  }
  try {
    const blogs = await db.query.blog.findMany({
      where: (blogs) =>
        and(
          eq(blogs.userId, user.id), // Filter by User
          isNull(blogs.brandId) // Filter for Casual
        ),
      columns: {
        id: true,
        status: true,
        contentType: true,
        createdAt: true,
        tags: true,
        inputmetadata: true,
      },
    });

    const transformedBlogs = blogs.map((b) => ({
      id: b.id,
      status: b.status,
      contentType: b.contentType,
      createdAt: b.createdAt,
      tags: b.tags || [],
      inputmetadata: {
        topic: (b.inputmetadata as { topic?: string })?.topic,
        description: (b.inputmetadata as { description?: string })?.description,
      },
    }));

    // Transform the result for consistency
    return {
      success: true,
      blogs: transformedBlogs,
    };
  } catch (error) {
    console.error("Error fetching casual blogs:", error);
    return { success: false, message: "Failed to fetch casual blogs" };
  }
}
