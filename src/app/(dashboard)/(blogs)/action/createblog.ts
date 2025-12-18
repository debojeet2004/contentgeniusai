// @/app/actions/blog/createBlog.ts
"use server";

// import { after } from 'next/server';
import { db } from "@/db/drizzle";
// import { eq } from 'drizzle-orm';
// import { revalidatePath } from 'next/cache';
import { z } from "zod";
import { blog, ContentType, Status } from "@/db/schema/blog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSession } from "@/lib/session";

/**
 * Fetches the currently active user ID from the Better Auth session.
 * Returns null if no active user is set.
 */
async function getActiveUserData(): Promise<{
  activeBrandId: string | null;
  userId: string;
} | null> {
  const session = await getSession();

  const activeBrandId = session?.session?.activeOrganizationId;
  const userId = session?.session?.userId;
  console.log("session", session);
  console.log("userData", activeBrandId, userId);
  if (!userId) {
    return null;
  }
  if (!activeBrandId) {
    return {
      userId: userId,
      activeBrandId: null,
    };
  }
  return {
    userId: userId,
    activeBrandId: activeBrandId,
  };
}

// The Zod schema to validate data coming from the client
const blogSchema = z.object({
  persona: z.enum(["brand", "casual"]),
  contentType: z.enum(ContentType.enumValues),
  // This is the common data from the form
  commonFormData: z.object({
    topic: z.string(),
    field: z.string(),
    targetAudience: z.array(z.string()).optional(),
    userGoal: z.array(z.string()).optional(),
    searchIntent: z.array(z.string()).optional(),
    usp: z.array(z.string()).optional(),
    tone: z.array(z.string()).optional(),
    formattingNotes: z.array(z.string()).optional(),
    wordCountRange: z.string().optional(),
    callToActions: z.array(z.string()).optional(),
    imagePrompts: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
});

// // --- MAIN SERVER ACTION ---
export async function createBlog(formData: z.infer<typeof blogSchema>) {
  const validatedData = blogSchema.safeParse(formData);
  if (!validatedData.success) {
    return { success: false, message: validatedData.error.message };
  }

  try {
    const { persona, contentType, commonFormData } = validatedData.data;
    const userData = await getActiveUserData();
    // console.log("userData",userData)

    if (!userData?.userId) {
      return { success: false, message: "User not authenticated. Please log in.." };
    }

    const finalBrandId = persona === "brand" ? userData.activeBrandId : null;

    if (persona === "brand" && !finalBrandId) {
      return {
        success: false,
        message: "Please select or create a brand to proceed.",
      };
    }

    const [newBlog] = await db
      .insert(blog)
      .values({
        userId: userData.userId,
        brandId: finalBrandId,
        contentType,
        inputmetadata: commonFormData,
        tags: commonFormData.tags || [],
        status: "pending",
      })
      .returning();

    if (!newBlog) {
      return { success: false, message: "Failed to create blog record." };
    }

    // Example background job (uncomment if needed)
    // after(async () => {
    //   const aiOutput = await callAIModel(validatedData.data);
    //   await db.update(blog)
    //     .set({ outputdata: aiOutput, status: "draft" })
    //     .where(eq(blog.id, newBlog.id));
    //   revalidatePath("/create-blogs");
    // });

    return {
      success: true,
      message: "Blog creation started.",
      blogId: newBlog.id,
    };
  } catch (error) {
    console.error("An unexpected server error occurred:", error);
    return { success: false, message: "An unexpected server error occurred." };
  }
}

// A placeholder for your AI API call (unchanged)
// async function callAIModel(input: any) {
//   await new Promise(resolve => setTimeout(resolve, 5000));
//   return {
//     title: `AI-Generated Title for: ${input.commonFormData.topic}`,
//     content: 'This is the AI-generated content based on your input.',
//   };
// }
