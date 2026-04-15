import CrestronApp from "@/components/CrestronApp/CrestronApp";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "./styles.scss";
import HomeAccessClient from "./HomeAccessClient";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "homeAccess.meta" });
	const page = "home-access";
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

export default async function HomeAccess() {
	const t = await getTranslations();

	return (
		<main>
			<HeroParallax
				heading={t("homeAccess.title")}
				subheading={t("homeAccess.subtitle")}
				imgSrc="https://www.lavishautomation.com/images/client/brands/security-header%201.jpg"
			/>
			<section className="technology-section" id="section">
				<h2 className="section__title">Peace of mind.</h2>
				<div className="technology-section-container">
					<p>
						The greatest stress reliever is knowing your home is safe and secure
						for you and your loved ones. Crestron Home unifies the technologies
						that make it a reality, from security systems to power and energy
						management that prevents service disruption. No matter what happens
						- storms, heat waves, equipment failures - your home will work
						exactly as it was designed to.
					</p>
					<img
						style={{
							borderRadius: 10,
						}}
						src="/05.jpg"
						alt=""
					/>
				</div>
			</section>
			<TechnologyProducts technology="Home Access" />
			<CrestronApp />
		</main>
	);
}
