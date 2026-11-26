import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import ContactUsBanner from "@/components/ContactUsBanner/ContactUsBanner";
import Faqs from "@/components/Faqs/Faqs";
import "./styles.scss";

const PAGE = "security";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "security.meta" });
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

export default async function Security({
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
				heading={t("security.title")}
				subheading={t("security.subtitle")}
				imgSrc="/security.png"
				secondaryBtnTxt={t("security.exploreBtn")}
				imgAlt={t("security.imgAlt")}
				currentPage={t("security.heading")}
				locale={locale}
			/>
			<section className="technology-section" id="section">
				<h2 className="section__title">{t("security.intro.heading")}</h2>
				<div className="technology-section-container">
					<div>
						{(t.raw("security.intro.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
					<img
						style={{
							borderRadius: 10,
							maxHeight: "100svh",
						}}
						src="https://images.pexels.com/photos/12713156/pexels-photo-12713156.jpeg"
						alt={t("security.intro.imgAlt")}
					/>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("security.section1.heading")}</h2>
				<div className="technology-section-container">
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://images.pexels.com/photos/8134817/pexels-photo-8134817.jpeg"
						alt={t("security.section1.imgAlt")}
					/>
					<div>
						{(t.raw("security.section1.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			{[2, 3, 4, 5].map((n) => (
				<section className="technology-section" key={n}>
					<h2 className="section__title">
						{t(`security.section${n}.heading`)}
					</h2>
					<div className="technology-section-container">
						<div>
							{(t.raw(`security.section${n}.paragraphs`) as string[]).map(
								(p, i) => (
									<p key={i}>{p}</p>
								),
							)}
						</div>
					</div>
				</section>
			))}
			<section className="technology-section">
				<h2 className="section__title">{t("security.section6.heading")}</h2>
				<p>{t("security.section6.intro")}</p>
				<div className="technology-section-container">
					{(
						t.raw("security.section6.items") as {
							name: string;
							text: string;
						}[]
					).map((item) => (
						<div key={item.name}>
							<h3>{item.name}</h3>
							<p>{item.text}</p>
						</div>
					))}
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("security.section7.heading")}</h2>
				<div className="security-flex-process">
					<div>
						<h3>{t("security.section7.item1.title")}</h3>
						<p>{t("security.section7.item1.description")}</p>
					</div>
					<div>
						<h3>{t("security.section7.item2.title")}</h3>
						<p>{t("security.section7.item2.description")}</p>
					</div>
					<div>
						<h3>{t("security.section7.item3.title")}</h3>
						<p>{t("security.section7.item3.description")}</p>
					</div>
					<div>
						<h3>{t("security.section7.item4.title")}</h3>
						<p>{t("security.section7.item4.description")}</p>
					</div>
					<div>
						<h3>{t("security.section7.item5.title")}</h3>
						<p>{t("security.section7.item5.description")}</p>
					</div>
					<div>
						<h3>{t("security.section7.item6.title")}</h3>
						<p>{t("security.section7.item6.description")}</p>
					</div>
				</div>
			</section>
			<Faqs faqs="security.faqs" />
			<ContactUsBanner />
		</main>
	);
}
