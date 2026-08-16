import { MetadataRoute } from "next";
import { getProjects } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL,                   lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/resume`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];

  const projects = await getProjects();
  const projectEntries: MetadataRoute.Sitemap = projects
    .filter((p) => p.showDetailPage !== false)
    .map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticEntries, ...projectEntries];
}
