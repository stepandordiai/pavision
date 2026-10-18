import { Metadata } from "next";
import AppointmentClient from "./AppointmentClient";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "./styles.scss";

const PAGE = "appointment";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "appointment.meta" });
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${PAGE}`]),
	);

	return {
		title: t("title"),
		description: t("description"),
		alternates: {
			canonical: `/${locale}/${PAGE}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${PAGE}`,
			},
		},

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `/${locale}/${PAGE}`,
			type: "website",
			images: "/pavision-og.png",
		},
	};
}

export default function Appointment() {
	return <AppointmentClient />;
}
