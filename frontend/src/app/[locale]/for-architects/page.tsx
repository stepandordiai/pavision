import { Metadata } from "next";
import "./styles.scss";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import Brands from "@/components/Brands/Brands";
import Faqs from "@/components/Faqs/Faqs";
import References from "@/components/References/References";

const PAGE = "for-architects";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "forArchitects.meta" });
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

export default async function ForArchitects({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale });

	return (
		<main>
			<HeroParallax
				heading={t("forArchitects.heading")}
				subheading={t("forArchitects.subheading")}
				imgSrc="/for-architects.png"
				secondaryBtnTxt={t("forArchitects.exploreBtn")}
				currentPage={t("nav.forArchitects")}
				locale={locale}
			/>
			<section className="section" id="section">
				<h2 className="section__title">
					{t("forArchitects.section1.heading")}
				</h2>
				<ul className="for-devs-list">
					{t
						.raw("forArchitects.section1.list")
						.map((item: string, i: number) => {
							return <li key={i}>{item}</li>;
						})}
				</ul>
				<p>{t("forArchitects.section1.txt1")}</p>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("forArchitects.section2.heading")}
				</h2>
				<ul className="for-devs-list">
					{t
						.raw("forArchitects.section2.list")
						.map((item: string, i: number) => {
							return <li key={i}>{item}</li>;
						})}
				</ul>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("forArchitects.section3.heading")}
				</h2>
				<ul className="for-devs-list">
					{t
						.raw("forArchitects.section3.list")
						.map((item: string, i: number) => {
							return <li key={i}>{item}</li>;
						})}
				</ul>
			</section>
			<section className="section" id="solar">
				<h2 className="section__title">
					{t("forArchitects.section4.heading")}
				</h2>
				<ul className="for-devs-list">
					{t
						.raw("forArchitects.section4.list")
						.map((item: string, i: number) => {
							return <li key={i}>{item}</li>;
						})}
				</ul>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("forArchitects.section5.heading")}
				</h2>
				<div className="for-architects-flex-container">
					<div>
						<h3>Crestron</h3>
						<p style={{ fontSize: "18px", fontWeight: "500" }}>
							{t("forArchitects.section5.bestFor")}
						</p>
						<p>{t("forArchitects.section5.crestronBestFor")}</p>
						<p style={{ fontSize: "18px", fontWeight: "500" }}>
							{t("forArchitects.section5.scale")}
						</p>
						<p>{t("forArchitects.section5.crestronScale")}</p>
						<p style={{ fontSize: "18px", fontWeight: "500" }}>
							{t("forArchitects.section5.customization")}
						</p>
						<p>{t("forArchitects.section5.crestronCustomization")}</p>
					</div>
					<div>
						<h3>Lutron</h3>
						<p style={{ fontSize: "18px", fontWeight: "500" }}>
							{t("forArchitects.section5.bestFor")}
						</p>
						<p>{t("forArchitects.section5.lutronBestFor")}</p>
						<p style={{ fontSize: "18px", fontWeight: "500" }}>
							{t("forArchitects.section5.scale")}
						</p>
						<p>{t("forArchitects.section5.lutronScale")}</p>
						<p style={{ fontSize: "18px", fontWeight: "500" }}>
							{t("forArchitects.section5.customization")}
						</p>
						<p>{t("forArchitects.section5.lutronCustomization")}</p>
					</div>
					<div>
						<h3>Loxone</h3>
						<p style={{ fontSize: "18px", fontWeight: "500" }}>
							{t("forArchitects.section5.bestFor")}
						</p>
						<p>{t("forArchitects.section5.loxoneBestFor")}</p>
						<p style={{ fontSize: "18px", fontWeight: "500" }}>
							{t("forArchitects.section5.scale")}
						</p>
						<p>{t("forArchitects.section5.loxoneScale")}</p>
						<p style={{ fontSize: "18px", fontWeight: "500" }}>
							{t("forArchitects.section5.customization")}
						</p>
						<p>{t("forArchitects.section5.loxoneCustomization")}</p>
					</div>
				</div>

				{/* <ul className="for-devs-flex-process">
					{t
						.raw("forArchitects.section5.list")
						.map((item: string, i: number) => {
							return (
								<li key={i}>
									<span>{i + 1}</span>
									<span>{item}</span>
								</li>
							);
						})}
				</ul> */}
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("forArchitects.section6.heading")}
				</h2>
				<ul className="for-devs-list">
					{t
						.raw("forArchitects.section6.list")
						.map((item: string, i: number) => {
							return <li key={i}>{item}</li>;
						})}
				</ul>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("forArchitects.section7.heading")}
				</h2>
				<ul className="for-devs-list">
					{t
						.raw("forArchitects.section7.list")
						.map((item: string, i: number) => {
							return <li key={i}>{item}</li>;
						})}
				</ul>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("forArchitects.section8.heading")}
				</h2>
				<ul className="for-devs-list">
					{t
						.raw("forArchitects.section8.list")
						.map((item: string, i: number) => {
							return <li key={i}>{item}</li>;
						})}
				</ul>
			</section>
			<References />
			<Faqs faqs={"forArchitects.faqs"} />
			<Brands />
		</main>
	);
}
