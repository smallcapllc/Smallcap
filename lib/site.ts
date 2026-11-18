import type { Metadata } from "next";

export const siteName = "Small Cap Consulting";

export const siteDescription =
  "Operations and AI automation consulting for legacy small businesses.";

export const siteUrl = "https://smallcap.cc";

export function pageSocial(
  title: string,
  description: string,
  options?: { type?: "website" | "article"; path?: string },
): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  return {
    title,
    description,
    authors: [{ name: siteName }],
    openGraph: {
      title: fullTitle,
      description,
      siteName,
      type: options?.type ?? "website",
      ...(options?.path ? { url: options.path } : {}),
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
