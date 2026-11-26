import HeroParallax from "@/components/HeroParallax/HeroParallax";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactUsBanner from "@/components/ContactUsBanner/ContactUsBanner";
import Faqs from "@/components/Faqs/Faqs";
import "./styles.scss";

const PAGE = "climate";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "climate.meta" });
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

export default async function Climate({
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
				heading={t("climate.title")}
				subheading={t("climate.subtitle")}
				// TODO: hotlinked Crestron image, replace with your own photo in /public
				imgSrc="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostat-thumn.jpg"
				secondaryBtnTxt={t("climate.exploreBtn")}
				imgAlt={t("climate.imgAlt")}
				currentPage={t("nav.climate")}
				locale={locale}
			/>
			<section className="technology-section" id="section">
				<h2 className="section__title">{t("climate.intro.heading")}</h2>
				<div className="technology-section-container">
					<div>
						{(t.raw("climate.intro.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
					<div style={{ position: "relative" }}>
						{/* <img
							style={{
								position: "absolute",
								height: "100%",
								bottom: "-25px",
								left: "-10px",
							}}
							src="/05-c.png"
							alt=""
							aria-hidden="true"
						/> */}
						<img
							style={{
								borderRadius: 10,
							}}
							src="/climate/01.png"
							alt={t("climate.intro.imgAlt")}
						/>
					</div>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("climate.section1.heading")}</h2>
				<div className="technology-section-container">
					{/* TODO: hotlinked Crestron image, replace with your own photo in /public */}
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostats-thoughtfully-designed.jpg"
						alt={t("climate.section1.imgAlt")}
					/>
					<div>
						{(t.raw("climate.section1.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("climate.section2.heading")}</h2>
				<div className="technology-section-container">
					<div>
						{(t.raw("climate.section2.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("climate.section3.heading")}</h2>
				<div className="technology-section-container">
					<div>
						{(t.raw("climate.section3.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
					{/* TODO: hotlinked Crestron image, replace with your own photo in /public */}
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostats-schedule-routine.jpg"
						alt={t("climate.section3.imgAlt")}
					/>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("climate.section4.heading")}</h2>
				<div className="technology-section-container">
					<div>
						{(t.raw("climate.section4.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("climate.section5.heading")}</h2>
				<div className="technology-section-container">
					<img
						style={{
							borderRadius: 10,
						}}
						src="/05.jpg"
						alt={t("climate.section5.imgAlt")}
					/>
					<div>
						{(t.raw("climate.section5.paragraphs") as string[]).map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">{t("climate.section6.heading")}</h2>
				<p>{t("climate.section6.intro")}</p>
				<div className="technology-section-container">
					{(
						t.raw("climate.section6.items") as {
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
				<h2 className="section__title">{t("climate.section7.heading")}</h2>
				<div className="climate-flex-process">
					<div>
						<h3>{t("climate.section7.item1.title")}</h3>
						<p>{t("climate.section7.item1.description")}</p>
					</div>
					<div>
						<h3>{t("climate.section7.item2.title")}</h3>
						<p>{t("climate.section7.item2.description")}</p>
					</div>
					<div>
						<h3>{t("climate.section7.item3.title")}</h3>
						<p>{t("climate.section7.item3.description")}</p>
					</div>
					<div>
						<h3>{t("climate.section7.item4.title")}</h3>
						<p>{t("climate.section7.item4.description")}</p>
					</div>
					<div>
						<h3>{t("climate.section7.item5.title")}</h3>
						<p>{t("climate.section7.item5.description")}</p>
					</div>
					<div>
						<h3>{t("climate.section7.item6.title")}</h3>
						<p>{t("climate.section7.item6.description")}</p>
					</div>
				</div>
			</section>
			<Faqs faqs="climate.faqs" />

			<ContactUsBanner />
		</main>
	);
}
