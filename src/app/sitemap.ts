import type { MetadataRoute } from "next";

const locales = ["cs", "en"];
const pages = ["/", "/o-nas", "/produkty", "/kontakty"];
const BASE_URL = "https://www.pavision.cz";

export default function sitemap(): MetadataRoute.Sitemap {
	return locales.flatMap((locale) =>
		pages.map((page) => ({
			url: `${BASE_URL}/${locale}${page === "/" ? "" : page}`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: page === "/" ? 1 : 0.8,
			alternates: {
				languages: {
					...Object.fromEntries(
						locales.map((l) => [
							l,
							`${BASE_URL}/${l}${page === "/" ? "" : page}`,
						]),
					),
					"x-default": `${BASE_URL}/cs${page === "/" ? "" : page}`,
				},
			},
		})),
	);
}
