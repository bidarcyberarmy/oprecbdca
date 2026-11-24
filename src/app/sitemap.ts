import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://oprec.bidarcyberarmy.org/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://oprec.bidarcyberarmy.org/daftar",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
