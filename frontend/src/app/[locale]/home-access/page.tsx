// import CrestronApp from "@/components/CrestronApp/CrestronApp";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";
import "./styles.scss";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "homeAccess.meta" });
	const page = "home-access";
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

export default async function HomeAccess() {
	const t = await getTranslations();

	return (
		<main style={{ overflow: "hidden" }}>
			<HeroParallax
				heading={t("homeAccess.title")}
				subheading={t("homeAccess.subtitle")}
				imgSrc="/home-access/01-c.png"
				secondaryBtnTxt="Explore Smart Access"
				imgAlt="Luxury smart home entrance with automated access control system"
			/>
			<section className="technology-section" id="section">
				<h2 className="section__title">Peace of mind.</h2>
				<div className="technology-section-container">
					<p>
						The greatest stress reliever is knowing your home is safe and secure
						for you and your loved ones. Crestron Home unifies the technologies
						that make it a reality, from security systems to power and energy
						management that prevents service disruption. No matter what happens
						- storms, heat waves, equipment failures - your home will work
						exactly as it was designed to.
					</p>
					<img
						style={{
							borderRadius: 10,
						}}
						src="/05.jpg"
						alt=""
					/>
				</div>
			</section>
			<section className="technology-section" id="section">
				<h2 className="section__title">Touch screens</h2>
				<div className="technology-section-container">
					<img
						style={{
							borderRadius: 10,
							maxHeight: "100svh",
						}}
						src="/home-access/02-c.png"
						alt=""
					/>
					<p>
						Phones and tablets are personal devices, rather than dedicated home
						devices. These screens are purpose-built and never leave the room or
						the house. They are extremely responsive, reliable, and provide a
						high-resolution, intuitive display that makes it easy to control
						everything in the home.
					</p>
				</div>
			</section>
			<TechnologyProducts technology="Home Access" />
			{/* <CrestronApp /> */}
		</main>
	);
}
