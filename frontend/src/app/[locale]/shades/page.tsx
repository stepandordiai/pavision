import { getTranslations } from "next-intl/server";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";
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
	const t = await getTranslations({ locale });

	return (
		<main style={{ overflow: "hidden" }}>
			<HeroParallax
				heading={t("shades.title")}
				subheading={t("shades.subtitle")}
				imgSrc="https://images.pexels.com/photos/36353407/pexels-photo-36353407.png"
				secondaryBtnTxt="Explore Automated Shades"
				imgAlt="Luxury bedroom with smart motorized shades and automated blinds"
				currentPage="Shades"
				locale={locale}
			/>
			<section className="section" id="section">
				<h2 className="section__title">Get closer to nature</h2>
				<div className="shades-section-container">
					<p>
						Being in nature feels good. Crestron automated shades can work in
						concert with our lighting solutions to help you control light in
						your home in a way that mimics the patterns of nature and uses
						natural light to awaken your senses.
					</p>
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
				<h2 className="section__title">
					Flexibilní ochrana před sluncem pro všechny potřeby
				</h2>
				<div className="shades-section-container">
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-reliable.jpg"
						alt=""
					/>
					<p>
						Ať už jde o žaluzie, rolety, markýzy nebo plisé – jakýkoli typ
						stínění lze snadno integrovat do celého systému. Řešení na míru se
						flexibilně přizpůsobí architektuře budovy, jejímu využití i
						individuálním požadavkům. Právě tak mohou fungovat nejen automatické
						venkovní žaluzie.
					</p>
				</div>
			</section>
			<TechnologyProducts technology="Shades" />
		</main>
	);
}
