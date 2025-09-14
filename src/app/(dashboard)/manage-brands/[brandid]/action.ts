/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { eq } from "drizzle-orm";
import { organization } from "@/db/schema";
import { db } from "@/db/drizzle";
import { revalidatePath } from "next/cache";

export async function updateGeneralInfo({
  brandId,
  data,
}: {
  brandId: string;
  data: any;
}) {

  try {
    await db
      .update(organization)
      .set({
        name: data.name,
        slug: data.slug,
        logo: null,
        // logo: data.logo,
        description: data.description,
        brandmission: data.brandmission,
        industry: data.industry,
        targetaudience: data.targetaudience,
        voicetone: data.voicetone,
        uniqsellingpoints: data.uniqsellingpoints,
        competitor: data.competitor,
      })
      .where(eq(organization.id, brandId));

      revalidatePath(`/manage-brands/${data.slug}?id=${brandId}&tab=brandInfo`);

    return {
      success: true,
      message: "General information updated successfully.",
    };
  } catch (error) {
    console.error("Database update failed:", error);
    return {
      success: false,
      message: "Failed to update general information.",
    };
  }
}

export async function updateBrandIdentity({
  brandId,
  data,
}: {
  brandId: string;
  data: any;
}) {
  console.log("FROM ACTION", brandId, data);

  try {
    const metadataJson = JSON.stringify(data);
    await db
      .update(organization)
      .set({
        brandmetadata: metadataJson,
      })
      .where(eq(organization.id, brandId));

    return {
      success: true,
      message: "Brand identity updated successfully.",
    };
  } catch (error) {
    console.error("Database update failed:", error);
    return {
      success: false,
      message: "Failed to update brand identity.",
    };
  }
}
