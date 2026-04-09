import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";

const pages = ["/", "/o-nas", "/produkty", "/kontakty"];

export default function sitemap(): MetadataRoute.Sitemap {
	return routing.locales.flatMap((locale) =>
		pages.map((page) => ({
			url: `${BASE_URL}/${locale}${page === "/" ? "" : page}`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: page === "/" ? 1 : 0.8,
			alternates: {
				languages: {
					...Object.fromEntries(
						routing.locales.map((l) => [
							l,
							`${BASE_URL}/${l}${page === "/" ? "" : page}`,
						]),
					),
					"x-default": `${BASE_URL}/${routing.defaultLocale}${page === "/" ? "" : page}`,
				},
			},
		})),
	);
}
