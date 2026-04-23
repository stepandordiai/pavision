import HeroParallax from "@/components/HeroParallax/HeroParallax";
import CrestronApp from "@/components/CrestronApp/CrestronApp";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import "./styles.scss";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "thermostat.meta" });
	const page = "thermostat";
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

export default async function Thermostat() {
	const t = await getTranslations();

	return (
		<main>
			<HeroParallax
				heading={t("thermostat.title")}
				subheading={t("thermostat.subtitle")}
				imgSrc="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostat-thumn.jpg"
			/>
			<section className="technology-section" id="section">
				<h2 className="section__title">The perfect temperature, always</h2>
				<div className="technology-section-container">
					<p>
						Our bodies have a basic need to maintain a temperature within a
						specific range; if it’s too hot or cold in the home, especially at
						bedtime, this can be challenging. Horizon® smart thermostats, paired
						with multi-zone heating and cooling systems, maintain an optimal
						temperature at all times, improving your comfort and quality of
						sleep.
					</p>
					<div style={{ position: "relative" }}>
						<img
							style={{
								position: "absolute",
								height: "100%",
								bottom: "-25px",
								left: "-10px",
							}}
							src="/05-c.png"
							alt=""
						/>
						<img
							style={{
								borderRadius: 10,
							}}
							src="/05.jpg"
							alt=""
						/>
					</div>
				</div>
			</section>
			<section className="technology-section" id="section">
				<h2 className="section__title">Thoughtfully designed</h2>
				<div className="technology-section-container">
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostats-thoughtfully-designed.jpg"
						alt=""
					/>
					<p>
						Horizon Thermostats feature Wi-Fi® communication, making them
						equally simple to install for new construction or retrofit. There
						are no batteries to change, so you can set it and forget it.
					</p>
				</div>
			</section>
			<section className="technology-section" id="section">
				<h2 className="section__title">Schedule routines</h2>
				<div className="technology-section-container">
					<p>
						Ensure just the right temperature when you wake, to welcome you home
						from work, or for sleep at night
					</p>
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostats-schedule-routine.jpg"
						alt=""
					/>
				</div>
			</section>
			<section className="technology-section" id="section">
				<h2 className="section__title">Controlled Remotely</h2>
				<div className="technology-section-container">
					<img
						style={{
							borderRadius: 10,
						}}
						src="/05.jpg"
						alt=""
					/>
					<p>
						Using remote temperature and humidity sensors, thermostats can be
						hidden in a central closet and controlled remotely from mobile
						devices, multi-function keypads, remotes, and touch screens. Sleek,
						modern Horizon Thermostats complement almost any décor.
					</p>
				</div>
			</section>
			<TechnologyProducts technology="Thermostat" />
			<CrestronApp />
		</main>
	);
}
