import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import CrestronApp from "@/components/CrestronApp/CrestronApp";
import "./styles.scss";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "security.meta" });
	const page = "security";
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

export default async function Security() {
	const t = await getTranslations();

	return (
		<main>
			<HeroParallax
				heading={t("security.title")}
				subheading={t("security.subtitle")}
				imgSrc="https://images.pexels.com/photos/35361412/pexels-photo-35361412.jpeg"
			/>
			<section className="technology-section" id="section">
				<h2 className="section__title">
					Keep an eye on what is most precious from wherever you are.
				</h2>
				<div className="technology-section-container">
					<p>
						Crestron Home works with the most popular security cameras. Select
						and view any camera in real-time from any Crestron Home touch screen
						throughout the home, or remotely from mobile devices. You can even
						control PTZ (pan, tilt, zoom) cameras.
					</p>
					<img
						style={{
							borderRadius: 10,
							maxHeight: "100svh",
						}}
						src="https://images.pexels.com/photos/12713156/pexels-photo-12713156.jpeg"
						alt=""
					/>
				</div>
			</section>
			<section className="technology-section">
				<h2 className="section__title">
					Zabezpečení není doplněk. Jde o součást systému.
				</h2>
				<div className="technology-section-container">
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://images.pexels.com/photos/8134817/pexels-photo-8134817.jpeg"
						alt=""
					/>
					<p>
						Napříč osvětlením, přístupem, stíněním i energií – vše spolupracuje
						a chrání vaši budovu.
					</p>
				</div>
			</section>
			<TechnologyProducts technology="Security" />
			<CrestronApp />
		</main>
	);
}
