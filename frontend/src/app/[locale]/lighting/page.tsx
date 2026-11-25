import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LightingClient from "./LightingClient";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import ContactUsBanner from "@/components/ContactUsBanner/ContactUsBanner";
import Faqs from "@/components/Faqs/Faqs";
import "./styles.scss";

const PAGE = "lighting";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "lighting.meta" });
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

export default async function Lighting({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations();

	return (
		<main style={{ overflow: "hidden" }}>
			<HeroParallax
				heading={t("lighting.hero.heading")}
				subheading={t("lighting.hero.subheading")}
				imgSrc="/lighting/01-c.png"
				secondaryBtnTxt={t("lighting.hero.exploreBtn")}
				imgAlt={t("lighting.hero.imgAlt")}
				currentPage={t("nav.lighting")}
				locale={locale}
			/>
			<section className="section">
				<h2 className="section__title">{t("lighting.intro.heading")}</h2>
				{(t.raw("lighting.intro.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="section">
				<h2 className="section__title">{t("lighting.section1.heading")}</h2>
				<LightingClient />
				<div style={{ marginTop: "10px" }}>
					{t.raw("lighting.section1.paragraphs").map((p: string, i: number) => (
						<p key={i}>{p}</p>
					))}
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t("lighting.section2.heading")}</h2>
				<div className="lightning-section-container">
					{/* TODO: Crestron's hotlinked video — replace with your own footage */}
					<video
						style={{ width: "100%", borderRadius: 10 }}
						autoPlay
						playsInline
						muted
						loop
					>
						<source src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product_lighting_-_os4_update-(1080p).mp4" />
					</video>
					<div>
						{t
							.raw("lighting.section2.paragraphs")
							.map((p: string, i: number) => (
								<p key={i}>{p}</p>
							))}
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t("lighting.section3.heading")}</h2>
				<div className="lightning-section-container">
					<img
						style={{
							borderRadius: 10,
						}}
						src="/lighting/02-c.png"
						alt={t("lighting.section3.imgAlt") ?? ""}
					/>
					<div>
						{t
							.raw("lighting.section3.paragraphs")
							.map((p: string, i: number) => (
								<p key={i}>{p}</p>
							))}
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t("lighting.section4.heading")}</h2>
				{t.raw("lighting.section4.paragraphs").map((p: string, i: number) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="section">
				<h2 className="section__title">{t("lighting.section5.heading")}</h2>
				{t.raw("lighting.section5.paragraphs").map((p: string, i: number) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="section">
				<h2 className="section__title">{t("lighting.section6.heading")}</h2>
				<p>{t("lighting.section6.intro")}</p>
				{t
					.raw("lighting.section6.items")
					.map((item: { name: string; text: string }) => (
						<div key={item.name}>
							<h3>{item.name}</h3>
							<p>{item.text}</p>
						</div>
					))}
			</section>
			<section className="section">
				<h2 className="section__title">{t("lighting.section7.heading")}</h2>
				<div className="lighting-flex-process">
					<div>
						<h3>{t("lighting.section7.item1.title")}</h3>
						<p>{t("lighting.section7.item1.description")}</p>
					</div>
					<div>
						<h3>{t("lighting.section7.item2.title")}</h3>
						<p>{t("lighting.section7.item2.description")}</p>
					</div>
					<div>
						<h3>{t("lighting.section7.item3.title")}</h3>
						<p>{t("lighting.section7.item3.description")}</p>
					</div>
					<div>
						<h3>{t("lighting.section7.item4.title")}</h3>
						<p>{t("lighting.section7.item4.description")}</p>
					</div>
					<div>
						<h3>{t("lighting.section7.item5.title")}</h3>
						<p>{t("lighting.section7.item5.description")}</p>
					</div>
					<div>
						<h3>{t("lighting.section7.item6.title")}</h3>
						<p>{t("lighting.section7.item6.description")}</p>
					</div>
				</div>
			</section>

			<Faqs faqs={"lighting.faqs"} />
			<ContactUsBanner />
		</main>
	);
}
