import HeroParallax from "@/components/HeroParallax/HeroParallax";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactUsBanner from "@/components/ContactUsBanner/ContactUsBanner";
import Faqs from "@/components/Faqs/Faqs";
import "./styles.scss";

const PAGE = "audio";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "audio.meta" });
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

export default async function Audio({
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
				heading={t("audio.title")}
				subheading={t("audio.subtitle")}
				// TODO: hotlinked Bowers & Wilkins image — replace with your own photo in /public
				imgSrc="https://www.bowerswilkins.com/on/demandware.static/-/Sites-master-catalog-soundunited/default/dw0b413071/bowers/Rich-Content/bandw_formationbar_be_desktop.jpg"
				secondaryBtnTxt={t("audio.exploreBtn")}
				imgAlt={t("audio.imgAlt")}
				currentPage={t("audio.heading")}
				locale={locale}
			/>
			<section className="technology-section" id="section">
				<h2 className="section__title">{t("audio.intro.heading")}</h2>
				{(t.raw("audio.intro.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("audio.section1.heading")}</h2>
				<div className="technology-section-container">
					<div>
						{(t.raw("audio.section1.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
					<img
						style={{
							borderRadius: 10,
						}}
						src="/audio/01.png"
						alt={t("audio.section1.imgAlt")}
					/>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("audio.section2.heading")}</h2>
				{(t.raw("audio.section2.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("audio.section3.heading")}</h2>
				{(t.raw("audio.section3.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("audio.section4.heading")}</h2>
				<div className="technology-section-container">
					<img
						style={{
							borderRadius: 10,
						}}
						src="/audio/02.png"
						alt={t("audio.section4.imgAlt")}
					/>
					<div>
						{(t.raw("audio.section4.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("audio.section5.heading")}</h2>
				{(t.raw("audio.section5.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("audio.section6.heading")}</h2>
				<p>{t("audio.section6.intro")}</p>
				{(
					t.raw("audio.section6.items") as { name: string; text: string }[]
				).map((item) => (
					<div key={item.name}>
						<h3>{item.name}</h3>
						<p>{item.text}</p>
					</div>
				))}
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("audio.section7.heading")}</h2>
				<div className="audio-flex-process">
					<div>
						<h3>{t("audio.section7.item1.title")}</h3>
						<p>{t("audio.section7.item1.description")}</p>
					</div>
					<div>
						<h3>{t("audio.section7.item2.title")}</h3>
						<p>{t("audio.section7.item2.description")}</p>
					</div>
					<div>
						<h3>{t("audio.section7.item3.title")}</h3>
						<p>{t("audio.section7.item3.description")}</p>
					</div>
					<div>
						<h3>{t("audio.section7.item4.title")}</h3>
						<p>{t("audio.section7.item4.description")}</p>
					</div>
					<div>
						<h3>{t("audio.section7.item5.title")}</h3>
						<p>{t("audio.section7.item5.description")}</p>
					</div>
					<div>
						<h3>{t("audio.section7.item6.title")}</h3>
						<p>{t("audio.section7.item6.description")}</p>
					</div>
				</div>
			</section>
			<Faqs faqs="audio.faqs" />
			<ContactUsBanner />
		</main>
	);
}
