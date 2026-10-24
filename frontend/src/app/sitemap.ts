import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";

const pages = [
	{
		path: "",
		changeFrequency: "monthly",
		priority: 1,
	},
	{
		path: "/about-us",
		changeFrequency: "monthly",
		priority: 0.6,
	},
	{
		path: "/for-developers",
		changeFrequency: "monthly",
		priority: 0.7,
	},
	{
		path: "/for-architects",
		changeFrequency: "monthly",
		priority: 0.7,
	},
	{
		path: "/products",
		changeFrequency: "monthly",
		priority: 0.6,
	},
	{
		path: "/contacts",
		changeFrequency: "monthly",
		priority: 0.6,
	},
	{
		path: "/appointment",
		changeFrequency: "monthly",
		priority: 0.6,
	},
	{
		path: "/access-control",
		changeFrequency: "monthly",
		priority: 0.8,
	},
	{
		path: "/lighting",
		changeFrequency: "monthly",
		priority: 0.8,
	},
	{
		path: "/shades",
		changeFrequency: "monthly",
		priority: 0.8,
	},
	{
		path: "/climate",
		changeFrequency: "monthly",
		priority: 0.8,
	},
	{
		path: "/cinema-and-video",
		changeFrequency: "monthly",
		priority: 0.8,
	},
	{
		path: "/security",
		changeFrequency: "monthly",
		priority: 0.8,
	},
	{
		path: "/loxone-smart-home",
		changeFrequency: "monthly",
		priority: 0.9,
	},
	{
		path: "/crestron-integration",
		changeFrequency: "monthly",
		priority: 0.9,
	},
	{
		path: "/privacy-policy",
		changeFrequency: "yearly",
		priority: 0.1,
	},
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
	return routing.locales.flatMap((locale) =>
		pages.map((page) => ({
			url: `${BASE_URL}/${locale}${page.path}`,
			lastModified: new Date(),
			changeFrequency: page.changeFrequency,
			priority: page.priority,
			alternates: {
				languages: {
					...Object.fromEntries(
						routing.locales.map((l) => [l, `${BASE_URL}/${l}${page.path}`]),
					),
					"x-default": `${BASE_URL}/${routing.defaultLocale}${page.path}`,
				},
			},
		})),
	);
}
