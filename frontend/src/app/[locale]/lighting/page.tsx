import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LightingClient from "./LightingClient";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";
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

export default async function Lightning({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale });

	return (
		<main style={{ overflow: "hidden" }}>
			<HeroParallax
				heading={t("lighting.title")}
				subheading={t("lighting.subtitle")}
				imgSrc="/lighting/01-c.png"
				secondaryBtnTxt="Explore Lighting Solutions"
				imgAlt="Luxury smart home lighting automation system in modern interior"
				currentPage="Lighting"
				locale={locale}
			/>
			<section className="section" id="section">
				<h2 className="section__title">
					Lighting is directly linked to physical and emotional well-being
				</h2>
				<LightingClient />
			</section>
			<section className="section" id="section">
				<h2 className="section__title">
					Lighting is directly linked to physical and emotional well-being
				</h2>
				<div className="lightning-section-container">
					<img
						style={{
							borderRadius: 10,
						}}
						src="/lighting/02-c.png"
						alt=""
					/>
					<p>
						Your body runs on a 24-hour cycle called a circadian rhythm.
						Lighting affects one major aspect of it: your sleep-wake cycle.
						Replicating natural light provided by the cycles of the sun with
						artificial light can improve your mood, concentration, creativity,
						and energy levels, as well as promote better sleep. This can be
						accomplished using tunable LED light fixtures and technology such as
						the Crestron SolarSync® photosensor.
					</p>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					At sunrise the lights slowly ramp up and the shades slowly open to
					gently welcome the new day.
				</h2>
				<div className="lightning-section-container">
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
						<p>
							Set the mood for entertaining, create the perfect atmosphere for
							family movie night; or ensure the optimal setting for a
							professional conference call.
							<br />
							<br />
							Lights automatically turn on when you walk into a room and turn
							off shortly after you leave. At the end of the day, tap
							“Goodnight” from your bed to turn off all the lights and close all
							the shades.
						</p>
					</div>
				</div>
			</section>
			<TechnologyProducts technology="Lighting" />
		</main>
	);
}
