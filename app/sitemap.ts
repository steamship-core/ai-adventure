import prisma from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const adventures = await prisma.adventure.findMany({
    where: {
      deletedAt: null,
      public: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let pages = [
    {
      url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures/tagged`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/create`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/play`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/policies/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/policies/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/policies/copyright`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  for (const adventure of adventures) {
    pages.push({
      url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures/${adventure.id}`,
      lastModified: adventure.updatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  return pages as any;
}
