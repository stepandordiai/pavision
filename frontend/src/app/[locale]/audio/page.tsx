import HeroParallax from "@/components/HeroParallax/HeroParallax";
// import CrestronApp from "@/components/CrestronApp/CrestronApp";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import "./styles.scss";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "audio.meta" });
	const page = "audio";
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${page}`]),
	);

	return {
		title: t("title"),
		description: t("desc"),
		alternates: {
			canonical: `/${locale}/${page}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${page}`,
			},
		},
	};
}

export default async function Audio() {
	const t = await getTranslations();

	return (
		<main style={{ overflow: "hidden" }}>
			<HeroParallax
				heading={t("audio.title")}
				subheading={t("audio.subtitle")}
				imgSrc="https://www.bowerswilkins.com/on/demandware.static/-/Sites-master-catalog-soundunited/default/dw0b413071/bowers/Rich-Content/bandw_formationbar_be_desktop.jpg"
				secondaryBtnTxt="Explore Audio Solutions"
			/>
			<section className="technology-section" id="section">
				<h2 className="section__title">| Soothing sounds</h2>
				<div className="technology-section-container">
					<p>
						With a Crestron audio system, every room of your home can be filled
						with the sounds of nature. This can help reduce anxiety, blood
						pressure, and pain, as well as improve focus and promote restorative
						sleep.
					</p>
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-audio-hero.jpg"
						alt=""
					/>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">
					Listen passively or take control of your musical experience.
				</h2>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(1, 1fr)",
						gap: 20,
					}}
				>
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-audio-sonos.jpg"
						alt=""
					/>
					<p>
						If you have Sonos® devices, you can access and control your system
						within Crestron Home. For power-users, the full Sonos S2 app can run
						natively on our touch screens.
					</p>
				</div>
			</section>
			<TechnologyProducts technology="Audio" />
			{/* <CrestronApp /> */}
		</main>
	);
}
