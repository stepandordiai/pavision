import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "./AboutUs.scss";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "aboutUs.meta" });
	const page = "about-us";
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${page}`]),
	);

	return {
		title: t("title"),
		description: t("desc"),
		alternates: {
			canonical: `/${locale}/${page}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${page}`,
			},
		},
	};
}

export default async function AboutUs() {
	const t = await getTranslations();

	return (
		<main className="main">
			<h1 className="main__title">{t("aboutUsTitle")}</h1>
			<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
				{t.raw("home.whoWeAreDesc").map((txt: string, i: number) => {
					return <p key={i}>{txt}</p>;
				})}
			</div>
		</main>
	);
}
