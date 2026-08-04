import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import { TransitionLink } from "@/components/TransitionLink";
import Faqs from "@/components/Faqs/Faqs";
import "./styles.scss";

const PAGE = "crestron-integration";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "crestronIntegration.meta",
	});
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

const section8Images = [
	"https://www.loxone.com/enus/wp-content/uploads/sites/13/2021/09/PH-Header-Blog-Smart-Home-Installation-Consulting.jpg",
	"https://www.loxone.com/enus/wp-content/uploads/sites/13/2026/03/ph_loxone_header_software-scaled-1.jpg",
	"https://www.loxone.com/int/wp-content/uploads/sites/21/2022/06/PH-ElektrikerSchaltschrank-scaled-1.jpg",
	"https://www.loxone.com/enen/wp-content/uploads/sites/3/2026/03/PH-Library.jpg",
	"https://infrastor.de/wp-content/uploads/2024/09/Loxone-App-1.jpg",
	"https://www.loxone.com/enus/wp-content/uploads/sites/13/2026/04/fs-header-support-loxone-desktop-scaled-1.jpg",
];

export default async function CrestronHome({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale });

	return (
		<main>
			<HeroParallax
				// FIXME:
				heading={t("crestronIntegration.heading")}
				subheading={t("crestronIntegration.subheading")}
				imgSrc="https://www.strata-gee.com/wp-content/uploads/2024/08/PR_2024_Crestron_Home_OS4_in-app_Updates_1-RS-ADJ2.jpg"
				secondaryBtnTxt={t("crestronIntegration.heroSecondaryBtn")}
				currentPage="Crestron"
				locale={locale}
			/>
			<section className="section" id="section">
				<h2 className="section__title">
					{t("crestronIntegration.section1.heading")}
				</h2>
				<div className="section-container">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "12px" }}
					>
						{t
							.raw("crestronIntegration.section1.description")
							.map((p: string, i: number) => {
								return <p key={i}>{p}</p>;
							})}
					</div>
					<img
						style={{ borderRadius: "10px" }}
						src="https://www.slingersolutions.com/assets/crestron-hero-BkThue0W.jpg"
						alt=""
					/>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("crestronIntegration.section2.heading")}
				</h2>
				<div className="crestron-home-flex">
					<div>
						<h3>{t("crestronIntegration.section2.item1.title")}</h3>
						<p>{t("crestronIntegration.section2.item1.description")}</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/lighting"
						>
							More
						</TransitionLink>
						<img
							src="https://ghtgroup.com/media/yootheme/cache/91/crestron-solution-hw-lightingcontrol-tan-gold-keypad-918ef6e9.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>{t("crestronIntegration.section2.item2.title")}</h3>
						<p>{t("crestronIntegration.section2.item2.description")}</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/thermostat"
						>
							More
						</TransitionLink>
						<img
							src="https://www.crestron.com/getattachment/f6f79ade-f705-485c-8286-77e69be50f74/f6f79ade-f705-485c-8286-77e69be50f74.aspx"
							alt=""
						/>
					</div>
					<div>
						<h3>{t("crestronIntegration.section2.item3.title")}</h3>
						<p>{t("crestronIntegration.section2.item3.description")}</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/video"
						>
							More
						</TransitionLink>
						<img
							src="https://ghtgroup.com/media/zoo/images/enjoy-effortless-home-control-with-crestron-s-newest-remotes_1484d3df25990bf5e7542f56d54c603f.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>{t("crestronIntegration.section2.item4.title")}</h3>
						<p>{t("crestronIntegration.section2.item4.description")}</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/audio"
						>
							More
						</TransitionLink>
						<img
							src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/featured%20pages%20v2/image-124.png"
							alt=""
						/>
					</div>
					<div>
						<h3>{t("crestronIntegration.section2.item5.title")}</h3>
						<p>{t("crestronIntegration.section2.item5.description")}</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/security"
						>
							More
						</TransitionLink>
						<img
							src="https://essentialinstall.com/wp-content/uploads/2024/08/PR_2024_Crestron_Home_OS4_Updates_3.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>{t("crestronIntegration.section2.item6.title")}</h3>
						<p>{t("crestronIntegration.section2.item6.description")}</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/shades"
						>
							More
						</TransitionLink>
						<img
							src="https://www.strata-gee.com/wp-content/uploads/2021/11/Crestron-Battery-Powewred-Shades-with-mobile-UI-2-RS.png"
							alt=""
						/>
					</div>
					<div>
						<h3>{t("crestronIntegration.section2.item7.title")}</h3>
						<p>{t("crestronIntegration.section2.item7.description")}</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href=""
						>
							More
						</TransitionLink>
						<img
							src="https://www.crestron.com/getattachment/ff40e24d-8f0d-42c4-9762-c4e10b41b352/ff40e24d-8f0d-42c4-9762-c4e10b41b352.aspx"
							alt=""
						/>
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("crestronIntegration.section3.heading")}
				</h2>
				<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
					{t
						.raw("crestronIntegration.section3.description")
						.map((p: string, i: number) => {
							return <p key={i}>{p}</p>;
						})}
					<img
						style={{ margin: "0 auto" }}
						width={700}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/featured%20pages%20v2/creston%20home%20os4/smart_viewing@2x.png"
						alt=""
					/>
					{/* FIXME: */}
					<p style={{ textAlign: "center" }}>
						<span style={{ whiteSpace: "nowrap" }}>One app.</span>{" "}
						<span style={{ whiteSpace: "nowrap" }}>One interface.</span>{" "}
						<span style={{ whiteSpace: "nowrap" }}>One intelligent home.</span>
					</p>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("crestronIntegration.section4.heading")}
				</h2>
				<div className="section-container">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "12px" }}
					>
						<p>{t("crestronIntegration.section4.list1.title")}</p>
						<ul className="crestron-home-list">
							{t
								.raw("crestronIntegration.section4.list1.list")
								.map((el: string, i: number) => {
									return <li key={i}>{el}</li>;
								})}
						</ul>
						<p>{t("crestronIntegration.section4.list2.title")}</p>
						<ul className="crestron-home-list">
							{t
								.raw("crestronIntegration.section4.list2.list")
								.map((el: string, i: number) => {
									return <li key={i}>{el}</li>;
								})}
						</ul>
					</div>
					<img
						style={{ borderRadius: "10px" }}
						src="https://www.residentialsystems.com/wp-content/uploads/2022/02/Crestron-LED-Color-Tuning-Lifestyle-Image.jpg"
						alt=""
					/>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("crestronIntegration.section5.heading")}
				</h2>
				<div className="section-container">
					<img
						style={{ borderRadius: "10px" }}
						src="https://www.gramophone.com/sites/default/files/wysiwyg/Crestron-home-entertainment.jpg"
						alt=""
					/>
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<p>{t("crestronIntegration.section5.description")}</p>
						<p>{t("crestronIntegration.section5.list1.title")}</p>
						<ul className="crestron-home-list">
							{t
								.raw("crestronIntegration.section5.list1.list")
								.map((el: string, i: number) => {
									return <li key={i}>{el}</li>;
								})}
						</ul>
						<p>{t("crestronIntegration.section5.text")}</p>
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("crestronIntegration.section6.heading")}
				</h2>
				<div className="section-container">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "12px" }}
					>
						<p>{t("crestronIntegration.section6.description")}</p>
						<p>{t("crestronIntegration.section6.list1.title")}</p>
						<ul className="crestron-home-list">
							{t
								.raw("crestronIntegration.section6.list1.list")
								.map((el: string, i: number) => {
									return <li key={i}>{el}</li>;
								})}
						</ul>
						<p>{t("crestronIntegration.section6.text")}</p>
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns:
								"repeat(auto-fill, minmax(min(100%, 170px), 170px))",
							gap: "10px",
							// height: "100svh",
							justifyContent: "center",
						}}
					>
						<img src="/11.png" alt="" />
						<img src="/12.png" alt="" />
						<img src="/13.png" alt="" />
						<img src="/14.png" alt="" />
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("crestronIntegration.section7.heading")}
				</h2>
				{t
					.raw("crestronIntegration.section7.description")
					.map((p: string, i: number) => {
						return <p key={i}>{p}</p>;
					})}
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("crestronIntegration.section8.heading")}
				</h2>
				<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
					<p>{t("crestronIntegration.section8.list1.title")}</p>
					<ul className="crestron-home-flex-img">
						{t
							.raw("crestronIntegration.section8.list1.list")
							.map((item: string, i: number) => (
								<li key={item}>
									<span>{item}</span>
									<img src={section8Images[i]} alt="" />
								</li>
							))}
					</ul>
					<p>{t("crestronIntegration.section8.text")}</p>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					{t("crestronIntegration.section9.heading")}
				</h2>
				<div className="crestron-home-flex-process">
					<div>
						<h3>{t("crestronIntegration.section9.item1.title")}</h3>
						<p>{t("crestronIntegration.section9.item1.description")}</p>
					</div>
					<div>
						<h3>{t("crestronIntegration.section9.item2.title")}</h3>
						<p>{t("crestronIntegration.section9.item2.description")}</p>
					</div>
					<div>
						<h3>{t("crestronIntegration.section9.item3.title")}</h3>
						<p>{t("crestronIntegration.section9.item3.description")}</p>
					</div>
					<div>
						<h3>{t("crestronIntegration.section9.item4.title")}</h3>
						<p>{t("crestronIntegration.section9.item4.description")}</p>
					</div>
					<div>
						<h3>{t("crestronIntegration.section9.item5.title")}</h3>
						<p>{t("crestronIntegration.section9.item5.description")}</p>
					</div>
					<div>
						<h3>{t("crestronIntegration.section9.item6.title")}</h3>
						<p>{t("crestronIntegration.section9.item6.description")}</p>
					</div>
				</div>
			</section>
			<Faqs faqs={"crestronIntegration.faqs"} />
		</main>
	);
}
