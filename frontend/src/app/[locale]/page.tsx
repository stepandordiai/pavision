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

export default function Home() {
	return (
		<main>
			<Hero />
			<ProgrammingServices />
			<OurSolutions />
			<WhatWeDo />
			<Testimonials />
			<Technologies />
			<Brands />
		</main>
	);
}
