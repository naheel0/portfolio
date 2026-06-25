import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL,                   lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/#about`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/#skills`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/#projects`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/#contact`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.7 },
  ];
}
