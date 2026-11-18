import { revalidatePath } from "next/cache";
import { listAllPostSlugs } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Daily Vercel Cron (vercel.json, 10:00 UTC / early morning Eastern) purges the
 * blog cache so a post becomes visible on its America/New_York date without a
 * new deploy. The handler only revalidates public blog URLs, so it does not
 * use a CRON_SECRET.
 */
export async function GET() {
  try {
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    for (const slug of listAllPostSlugs()) {
      if (slug.includes("/") || slug.includes("\\") || slug === "." || slug === "..") continue;
      revalidatePath(`/blog/${slug}`);
    }
    return Response.json({ revalidated: true });
  } catch (error) {
    console.error(error);
    return Response.json({ revalidated: false }, { status: 500 });
  }
}
