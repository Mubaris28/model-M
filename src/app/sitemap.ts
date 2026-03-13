import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.modelmanagement.mu";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/models",
    "/categories",
    "/casting",
    "/new-faces",
    "/directory",
    "/marketplace",
    "/sponsor",
    "/about",
    "/contact",
    "/login",
    "/signup",
    "/footer/about-us",
    "/footer/blog",
    "/footer/careers",
    "/footer/how-it-works",
    "/footer/how-it-works/models",
    "/footer/how-it-works/professionals",
    "/footer/modelling-advice",
    "/footer/press",
    "/footer/privacy-policy",
    "/footer/safety-and-trust",
    "/footer/support",
    "/footer/terms-of-service",
    "/professionals",
    "/modelsTalents",
  ].map((path): MetadataRoute.Sitemap[number] => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  return staticRoutes;
}
