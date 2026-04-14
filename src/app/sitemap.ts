import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";

const pages = [
	{
		path: "",
		changeFrequency: "weekly",
		priority: 1,
	},
	{
		path: "/about-us",
		changeFrequency: "monthly",
		priority: 0.6,
	},
	{
		path: "/products",
		changeFrequency: "weekly",
		priority: 0.9,
	},
	{
		path: "/contacts",
		changeFrequency: "monthly",
		priority: 0.6,
	},
	{
		path: "/home-access",
		changeFrequency: "weekly",
		priority: 0.8,
	},
	{
		path: "/lighting",
		changeFrequency: "weekly",
		priority: 0.8,
	},
	{
		path: "/shades",
		changeFrequency: "weekly",
		priority: 0.8,
	},
	{
		path: "/thermostat",
		changeFrequency: "weekly",
		priority: 0.8,
	},
	{
		path: "/video",
		changeFrequency: "weekly",
		priority: 0.8,
	},
	{
		path: "/privacy-policy",
		changeFrequency: "yearly",
		priority: 0.3,
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
