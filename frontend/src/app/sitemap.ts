import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";
import { getProducts } from "@/lib/api/products";

const pages = [
	{
		path: "",
		changeFrequency: "monthly",
		priority: 1,
		lastModified: "2026-11-10",
	},
	{
		path: "/about-us",
		changeFrequency: "monthly",
		priority: 0.6,
		lastModified: "2026-11-10",
	},
	{
		path: "/for-developers",
		changeFrequency: "monthly",
		priority: 0.7,
		lastModified: "2026-11-10",
	},
	{
		path: "/for-architects",
		changeFrequency: "monthly",
		priority: 0.7,
		lastModified: "2026-11-10",
	},
	{
		path: "/products",
		changeFrequency: "monthly",
		priority: 0.6,
		lastModified: "2026-11-10",
	},
	{
		path: "/contacts",
		changeFrequency: "monthly",
		priority: 0.6,
		lastModified: "2026-11-10",
	},
	{
		path: "/appointment",
		changeFrequency: "monthly",
		priority: 0.6,
		lastModified: "2026-11-10",
	},
	{
		path: "/access-control",
		changeFrequency: "monthly",
		priority: 0.8,
		lastModified: "2026-11-10",
	},
	{
		path: "/lighting",
		changeFrequency: "monthly",
		priority: 0.8,
		lastModified: "2026-11-10",
	},
	{
		path: "/shades",
		changeFrequency: "monthly",
		priority: 0.8,
		lastModified: "2026-11-10",
	},
	{
		path: "/climate",
		changeFrequency: "monthly",
		priority: 0.8,
		lastModified: "2026-11-10",
	},
	{
		path: "/cinema-and-video",
		changeFrequency: "monthly",
		priority: 0.8,
		lastModified: "2026-11-10",
	},
	{
		path: "/audio",
		changeFrequency: "monthly",
		priority: 0.8,
		lastModified: "2026-11-10",
	},
	{
		path: "/security",
		changeFrequency: "monthly",
		priority: 0.8,
		lastModified: "2026-11-10",
	},
	{
		path: "/loxone-smart-home",
		changeFrequency: "monthly",
		priority: 0.9,
		lastModified: "2026-11-10",
	},
	{
		path: "/crestron-integration",
		changeFrequency: "monthly",
		priority: 0.9,
		lastModified: "2026-11-10",
	},
	{
		path: "/privacy-policy",
		changeFrequency: "yearly",
		priority: 0.1,
		lastModified: "2026-11-10",
	},
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { data } = await getProducts();
	const products = data ?? [];

	const localePages = routing.locales.flatMap((locale) =>
		pages.map((page) => ({
			url: `${BASE_URL}/${locale}${page.path}`,
			lastModified: page.lastModified,
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

	const productsPages = routing.locales.flatMap((locale) =>
		products.map((product) => ({
			url: `${BASE_URL}/${locale}/products/${product.slug}`,
			lastModified: product.updated_at ?? product.created_at,
			changeFrequency: "monthly" as const,
			priority: 0.5,
			alternates: {
				languages: {
					...Object.fromEntries(
						routing.locales.map((l) => [
							l,
							`${BASE_URL}/${l}/products/${product.slug}`,
						]),
					),
					"x-default": `${BASE_URL}/${routing.defaultLocale}/products/${product.slug}`,
				},
			},
		})),
	);

	return [...localePages, ...productsPages];
}
