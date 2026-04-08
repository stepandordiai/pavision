import HeroParallax from "@/components/HeroParallax/HeroParallax";
import CrestronApp from "@/components/CrestronApp/CrestronApp";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import "./styles.scss";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "lightning.meta" });
	const page = "/lightning";
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

export default function Lightning() {
	return (
		<main>
			<HeroParallax
				heading="Lightning"
				subheading="Technology"
				imgSrc="/07.jpg"
			/>
			<section className="section">
				<h2 className="section__title">Peace of mind.</h2>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(2, 1fr)",
						gap: 40,
					}}
				>
					<p>
						The greatest stress reliever is knowing your home is safe and secure
						for you and your loved ones. Crestron Home unifies the technologies
						that make it a reality, from security systems to power and energy
						management that prevents service disruption. No matter what happens
						– storms, heat waves, equipment failures – your home will work
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
			<section style={{ minHeight: "100svh", background: "#333", padding: 20 }}>
				<div className="technology__title">
					<div className="technology__icon-container">
						<img src="/home-access.png" width={24} height={24} alt="" />
					</div>
					<p>Home Access</p>
				</div>
				<p style={{ fontSize: "2rem" }}>Products</p>
			</section>
			<CrestronApp />
		</main>
	);
}
