import HeroParallax from "@/components/HeroParallax/HeroParallax";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import ContactUsBanner from "@/components/ContactUsBanner/ContactUsBanner";
import Faqs from "@/components/Faqs/Faqs";
import "./styles.scss";

const PAGE = "cinema-and-video";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "video.meta" });
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
			images: [{ url: "/pavision-og.png", width: 1200, height: 630 }],
		},
	};
}

export default async function CinemaAndVideo({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations();

	return (
		<main>
			<HeroParallax
				heading={t("video.title")}
				subheading={t("video.subtitle")}
				imgSrc="/video/01-c.png"
				secondaryBtnTxt={t("video.exploreBtn")}
				imgAlt={t("video.imgAlt")}
				currentPage={t("video.heading")}
				locale={locale}
			/>
			<section className="section" id="section">
				<h2 className="section__title">{t("video.intro.heading")}</h2>
				{(t.raw("video.intro.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="section">
				<h2 className="section__title">{t("video.section1.heading")}</h2>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(2, 1fr)",
						gap: 40,
					}}
				>
					<div>
						{(t.raw("video.section1.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
					<img
						style={{
							borderRadius: 10,
						}}
						src="/video/02.jpg"
						alt={t("video.section1.imgAlt")}
					/>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t("video.section2.heading")}</h2>
				{(t.raw("video.section2.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="section">
				<h2 className="section__title">{t("video.section3.heading")}</h2>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(2, 1fr)",
						gap: 40,
					}}
				>
					<img
						style={{
							borderRadius: 10,
						}}
						src="/video/03.png"
						alt={t("video.section3.imgAlt")}
					/>
					<div>
						{(t.raw("video.section3.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">{t("video.section4.heading")}</h2>
				{(t.raw("video.section4.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="section">
				<h2 className="section__title">{t("video.section5.heading")}</h2>
				{(t.raw("video.section5.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="section">
				<h2 className="section__title">{t("video.section6.heading")}</h2>
				<p>{t("video.section6.intro")}</p>
				{(
					t.raw("video.section6.items") as { name: string; text: string }[]
				).map((item) => (
					<div key={item.name}>
						<h3>{item.name}</h3>
						<p>{item.text}</p>
					</div>
				))}
			</section>
			<section className="section">
				<h2 className="section__title">{t("video.section7.heading")}</h2>

				<div className="video-flex-process">
					<div>
						<h3>{t("video.section7.item1.title")}</h3>
						<p>{t("video.section7.item1.description")}</p>
					</div>
					<div>
						<h3>{t("video.section7.item2.title")}</h3>
						<p>{t("video.section7.item2.description")}</p>
					</div>
					<div>
						<h3>{t("video.section7.item3.title")}</h3>
						<p>{t("video.section7.item3.description")}</p>
					</div>
					<div>
						<h3>{t("video.section7.item4.title")}</h3>
						<p>{t("video.section7.item4.description")}</p>
					</div>
					<div>
						<h3>{t("video.section7.item5.title")}</h3>
						<p>{t("video.section7.item5.description")}</p>
					</div>
					<div>
						<h3>{t("video.section7.item6.title")}</h3>
						<p>{t("video.section7.item6.description")}</p>
					</div>
				</div>
			</section>
			<Faqs faqs="video.faqs" />
			<ContactUsBanner />
		</main>
	);
}
