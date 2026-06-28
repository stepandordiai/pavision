import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import "./styles.scss";
import Breadcrumbs from "@/components/common/Breadcrumbs/Breadcrumbs";

const PAGE = "for-developers";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale });
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${PAGE}`]),
	);

	return {
		// title: t("title"),
		// description: t("desc"),
		alternates: {
			canonical: `/${locale}/${PAGE}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${PAGE}`,
			},
		},
	};
}

export default async function ForDevs() {
	const t = await getTranslations();

	return (
		<main className="main">
			<Breadcrumbs links={[{ label: t("nav.forDevs") }]} />
			Page is currently under construction... Stay tune!
		</main>
	);
}
