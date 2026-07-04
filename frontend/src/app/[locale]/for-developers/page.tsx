import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import Faqs from "@/components/Faqs/Faqs";
import Brands from "@/components/Brands/Brands";
import SmartHomeHub from "./SmartHomeHub";
import References from "@/components/References/References";
import "./styles.scss";

const PAGE = "for-developers";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "forDevs.meta" });
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
	};
}

export default async function ForDevs() {
	const t = await getTranslations();

	return (
		<main>
			<HeroParallax
				heading={t("forDevs.heading")}
				subheading={t("forDevs.subheading")}
				imgSrc="/16.webp"
				secondaryBtnTxt={t("forDevs.exploreBtn")}
				currentPage={t("nav.forDevs")}
				currentPageUrl="/loxone-smart-home"
			/>
			<section className="section" id="section">
				<h2 className="section__title">{t("forDevs.section1.heading")}</h2>
				<ul className="for-devs-list">
					{t.raw("forDevs.section1.list").map((item: string, i: number) => {
						return <li key={i}>{item}</li>;
					})}
				</ul>
			</section>
			<section className="section">
				<h2 className="section__title">{t("forDevs.section2.heading")}</h2>
				<ul className="for-devs-list">
					{t.raw("forDevs.section2.list").map((item: string, i: number) => {
						return <li key={i}>{item}</li>;
					})}
				</ul>
			</section>
			<section className="section">
				<SmartHomeHub />
			</section>

			<section className="section">
				<h2 className="section__title">{t("forDevs.section3.heading")}</h2>
				<ul className="for-devs-list">
					{t.raw("forDevs.section3.list").map((item: string, i: number) => {
						return <li key={i}>{item}</li>;
					})}
				</ul>
			</section>
			<section className="section" id="solar">
				<h2 className="section__title">{t("forDevs.section4.heading")}</h2>
				<p>{t("forDevs.section4.subheading")}</p>
				<ul className="for-devs-list">
					{t.raw("forDevs.section4.list").map((item: string, i: number) => {
						return <li key={i}>{item}</li>;
					})}
				</ul>
			</section>
			<section className="section">
				<h2 className="section__title">{t("forDevs.section5.heading")}</h2>
				<ul className="for-devs-flex-process">
					{t.raw("forDevs.section5.list").map((item: string, i: number) => {
						return (
							<li key={i}>
								<span>{i + 1}</span>
								<span>{item}</span>
							</li>
						);
					})}
				</ul>
			</section>
			<section className="section">
				<h2 className="section__title">{t("forDevs.section6.heading")}</h2>
				<ul className="for-devs-list">
					{t.raw("forDevs.section6.list").map((item: string, i: number) => {
						return <li key={i}>{item}</li>;
					})}
				</ul>
			</section>
			<References />
			<Brands />
			<Faqs faqs={"forDevs.faqs"} />
		</main>
	);
}
