"use server";

import { revalidatePath } from "next/cache";

export async function revalidateTokko(): Promise<{
  success: boolean;
  error?: string;
  timestamp?: string;
}> {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return { success: false, error: "REVALIDATE_SECRET not configured" };
  }

  try {
    revalidatePath("/", "layout");
    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: "Error al revalidar. Intentá nuevamente.",
    };
  }
}
