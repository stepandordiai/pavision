import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}`]),
	);

	return {
		title: "P&A Vision | Kvalita, design a technologie v dokonalé rovnováze",
		description:
			"Tvoříme chytré domy, audio & video systémy, automatizaci a energeticky efektivní řešení.",
		alternates: {
			canonical: `/${locale}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}`,
			},
		},
	};
}

export default function Home() {
	return <HomeClient />;
}
