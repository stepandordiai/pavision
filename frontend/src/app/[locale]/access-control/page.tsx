import HeroParallax from "@/components/HeroParallax/HeroParallax";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ContactUsBanner from "@/components/ContactUsBanner/ContactUsBanner";
import Faqs from "@/components/Faqs/Faqs";
import "./styles.scss";

const PAGE = "access-control";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "homeAccess.meta" });
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

export default async function AccessControl({
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
				heading={t("homeAccess.title")}
				subheading={t("homeAccess.subtitle")}
				imgSrc="/access-control.jpg"
				secondaryBtnTxt={t("homeAccess.exploreBtn")}
				imgAlt={t("homeAccess.imgAlt")}
				currentPage={t("homeAccess.heading")}
				locale={locale}
			/>
			<section className="technology-section" id="section">
				<h2 className="section__title">{t("homeAccess.intro.heading")}</h2>
				{(t.raw("homeAccess.intro.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("homeAccess.section1.heading")}</h2>
				<div className="technology-section-container">
					<div>
						{(t.raw("homeAccess.section1.paragraphs") as string[]).map(
							(p, i) => (
								<p key={i}>{p}</p>
							),
						)}
					</div>
					{/* TODO: check /05.jpg fits this topic, or replace with your own photo of a lock/reader */}
					<img
						style={{
							borderRadius: 10,
						}}
						src="/05.jpg"
						alt={t("homeAccess.section1.imgAlt")}
					/>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("homeAccess.section2.heading")}</h2>
				<div className="technology-section-container">
					<img
						style={{
							borderRadius: 10,
							maxHeight: "100svh",
						}}
						src="/home-access/03.png"
						alt={t("homeAccess.section2.imgAlt")}
					/>
					<div>
						{(t.raw("homeAccess.section2.paragraphs") as string[]).map(
							(p, i) => (
								<p key={i}>{p}</p>
							),
						)}
					</div>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("homeAccess.section3.heading")}</h2>
				{(t.raw("homeAccess.section3.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("homeAccess.section4.heading")}</h2>
				{(t.raw("homeAccess.section4.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("homeAccess.section5.heading")}</h2>
				{(t.raw("homeAccess.section5.paragraphs") as string[]).map((p, i) => (
					<p key={i}>{p}</p>
				))}
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("homeAccess.section6.heading")}</h2>
				<p>{t("homeAccess.section6.intro")}</p>
				{(
					t.raw("homeAccess.section6.items") as { name: string; text: string }[]
				).map((item) => (
					<div key={item.name}>
						<h3>{item.name}</h3>
						<p>{item.text}</p>
					</div>
				))}
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("homeAccess.section7.heading")}</h2>
				<ol>
					{[1, 2, 3, 4, 5, 6].map((n) => (
						<li key={n}>
							<h3>{t(`homeAccess.section7.item${n}.title`)}</h3>
							<p>{t(`homeAccess.section7.item${n}.description`)}</p>
						</li>
					))}
				</ol>
			</section>
			<Faqs faqs="homeAccess.faqs" />
			<ContactUsBanner />
		</main>
	);
}
