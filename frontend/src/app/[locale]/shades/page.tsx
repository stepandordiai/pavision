import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import ContactUsBanner from "@/components/ContactUsBanner/ContactUsBanner";
import Faqs from "@/components/Faqs/Faqs";
import "./styles.scss";

const PAGE = "shades";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "shades.meta" });
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

export default async function Shades({
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
				heading={t("shades.title")}
				subheading={t("shades.subtitle")}
				// TODO: hotlinked Pexels image, replace with your own photo in /public
				imgSrc="https://images.pexels.com/photos/36353407/pexels-photo-36353407.png"
				secondaryBtnTxt={t("shades.exploreBtn")}
				imgAlt={t("shades.imgAlt")}
				currentPage={t("shades.heading")}
				locale={locale}
			/>
			<section className="section" id="section">
				<h2 className="section__title">{t("shades.intro.heading")}</h2>
				<div className="shades-section-container">
					<div>
						{(t.raw("shades.intro.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
					{/* TODO: hotlinked Crestron video, replace with your own video in /public */}
					<video
						style={{ width: "100%", borderRadius: 10 }}
						autoPlay
						playsInline
						muted
						loop
					>
						<source src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shading-video.mp4" />
					</video>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t("shades.section1.heading")}</h2>
				<div className="shades-section-container">
					{/* TODO: hotlinked Crestron image, replace with your own photo in /public */}
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-reliable.jpg"
						alt={t("shades.section1.imgAlt")}
					/>
					<div>
						{(t.raw("shades.section1.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t(`shades.section2.heading`)}</h2>
				<div className="shades-section-container">
					<div>
						{(t.raw(`shades.section2.paragraphs`) as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t(`shades.section3.heading`)}</h2>
				<div className="technology-section-container">
					<div>
						{(t.raw(`shades.section3.paragraphs`) as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
					<img
						style={{
							borderRadius: 10,
						}}
						src="/shades/01.png"
						alt=""
					/>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t(`shades.section4.heading`)}</h2>
				<div className="shades-section-container">
					<div>
						{(t.raw(`shades.section4.paragraphs`) as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t(`shades.section5.heading`)}</h2>
				<div className="shades-section-container">
					<div>
						{(t.raw(`shades.section5.paragraphs`) as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			<section className="section technology-section">
				<h2 className="section__title">{t("shades.section6.heading")}</h2>
				<p>{t("shades.section6.intro")}</p>
				<div className="technology-section-container">
					{(
						t.raw("shades.section6.items") as { name: string; text: string }[]
					).map((item) => (
						<div key={item.name}>
							<h3>{item.name}</h3>
							<p>{item.text}</p>
						</div>
					))}
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t("shades.section7.heading")}</h2>
				<div className="shades-flex-process">
					<div>
						<h3>{t("shades.section7.item1.title")}</h3>
						<p>{t("shades.section7.item1.description")}</p>
					</div>
					<div>
						<h3>{t("shades.section7.item2.title")}</h3>
						<p>{t("shades.section7.item2.description")}</p>
					</div>
					<div>
						<h3>{t("shades.section7.item3.title")}</h3>
						<p>{t("shades.section7.item3.description")}</p>
					</div>
					<div>
						<h3>{t("shades.section7.item4.title")}</h3>
						<p>{t("shades.section7.item4.description")}</p>
					</div>
					<div>
						<h3>{t("shades.section7.item5.title")}</h3>
						<p>{t("shades.section7.item5.description")}</p>
					</div>
					<div>
						<h3>{t("shades.section7.item6.title")}</h3>
						<p>{t("shades.section7.item6.description")}</p>
					</div>
				</div>
			</section>
			<Faqs faqs="shades.faqs" />
			<ContactUsBanner />
		</main>
	);
}
