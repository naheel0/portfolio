import { MetadataRoute } from "next";
import { getProjects } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL,                   lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/blog`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/resume`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];

  const projects = await getProjects();
  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const settings = await getSettings();
  const articles = await getDevtoArticles(settings.devtoUsername);
  const articleEntries: MetadataRoute.Sitemap = articles
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${BASE_URL}/blog/${a.slug}`,
      lastModified: new Date(a.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...projectEntries, ...articleEntries];
}
