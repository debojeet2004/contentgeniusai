
import { db } from "@/db/drizzle";
import { organization } from "@/db/schema";
import { eq } from "drizzle-orm";
/**
 * Checks if a brand/organization exists in the database
 * @param brandId - The unique identifier of the brand/organization to check
 * @returns Object containing:
 *  - isBrandPresent: boolean indicating if brand exists
 *  - data: Organization data if brand exists, null otherwise
 */
export async function checkBrand(
  brandId: string
): Promise<{ isBrandPresent: boolean; data: typeof organization.$inferSelect | null }> {
  try {
    const brand = await db.query.organization.findFirst({
      where: eq(organization.id, brandId),
    });
    
    return {
      isBrandPresent: brand !== undefined,
      data: brand || null,
    };
  } catch (error) {
    console.error("Error checking brand existence:", error);
    return {
      isBrandPresent: false,
      data: null,
    };
  }
}