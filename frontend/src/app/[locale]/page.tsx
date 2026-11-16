import type { Metadata } from "next";
import Hero from "@/components/Hero/Hero";
import Technologies from "@/components/home/Technologies/Technologies";
import OurSolutions from "@/components/home/OurSolutions/OurSolutions";
import WhatWeDo from "@/components/WhatWeDo/WhatWeDo";
import Testimonials from "@/components/Testimonials/Testimonials";
import Brands from "@/components/Brands/Brands";
import ProgrammingServices from "@/components/ProgrammingServices/ProgrammingServices";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import socials from "@/data/socials.json";
import { BASE_URL } from "@/lib/constants";
import "./Home.scss";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "home.meta" });
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}`]),
	);

	return {
		title: t("title"),
		description: t("desc"),
		alternates: {
			canonical: `/${locale}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}`,
			},
		},

		openGraph: {
			title: t("title"),
			description: t("desc"),
			url: `/${locale}`,
			type: "website",
			images: "/pavision-og.png",
		},
	};
}

export default async function Home() {
	const t = await getTranslations();

	// TODO: learn this
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				"@id": `${BASE_URL}/#website`,
				name: "P&A Vision",
				alternateName: ["pavision.cz", "P&A Vision s.r.o."],
				url: `${BASE_URL}/`,
				inLanguage: routing.locales,
				publisher: { "@id": `${BASE_URL}/#organization` },
			},
			{
				"@type": ["Organization", "HomeAndConstructionBusiness"],
				"@id": `${BASE_URL}/#organization`,
				name: "P&A Vision",
				legalName: "P&A Vision s.r.o.",
				url: `${BASE_URL}/`,
				logo: `${BASE_URL}/logo.svg`,
				image: `${BASE_URL}/pavision-og.png`,
				description: t("home.meta.desc"),
				email: "info@pavision.cz",
				telephone: "+420775632426",
				vatID: "CZ23654341",
				identifier: {
					"@type": "PropertyValue",
					propertyID: "IČO",
					value: "23654341",
				},
				address: {
					"@type": "PostalAddress",
					streetAddress: "Soběslavova 1381",
					addressLocality: "Kladno",
					postalCode: "272 01",
					addressCountry: "CZ",
				},
				areaServed: [
					{ "@type": "Country", name: "Czech Republic" },
					{ "@type": "Place", name: "Europe" },
				],
				knowsAbout: [
					"Smart home",
					"Home automation",
					"Crestron",
					"Loxone",
					"Lutron",
					"Home cinema",
					"Multiroom audio",
					"Network infrastructure",
				],
				contactPoint: [
					{
						"@type": "ContactPoint",
						telephone: "+420775632426",
						email: "info@pavision.cz",
						contactType: "sales",
						areaServed: "CZ",
						availableLanguage: ["cs", "en"],
					},
				],
				sameAs: socials.map((s) => s.url),
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				// TODO: learn this: replace(/</g, "\\u003c")
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			<main>
				<Hero />
				<ProgrammingServices />
				<OurSolutions />
				<WhatWeDo />
				<Testimonials />
				<Technologies />
				<Brands />
			</main>
		</>
	);
}
