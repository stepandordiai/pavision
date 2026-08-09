import HeroParallax from "@/components/HeroParallax/HeroParallax";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";
import "./styles.scss";

const PAGE = "video";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "video.meta" });
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
			images: [{ url: "/pavision-og.png", width: 1200, height: 630 }],
		},
	};
}

export default async function Video({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale });

	return (
		<main>
			<HeroParallax
				heading={t("video.title")}
				subheading={t("video.subtitle")}
				imgSrc="https://images.pexels.com/photos/27562214/pexels-photo-27562214.png"
				secondaryBtnTxt="Explore Cinema Experiences"
				imgAlt="Luxury smart home cinema and video entertainment system"
				currentPage="Video"
				locale={locale}
			/>
			<section className="section" id="section">
				<h2 className="section__title">
					Video is rapidly evolving, and with every new update simply watching
					TV or playing a video game becomes increasingly complicated.
				</h2>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(2, 1fr)",
						gap: 40,
					}}
				>
					<p>
						The stack of boxes and the web of wires at the TV, plus the multiple
						remotes and apps needed to control everything is frustrating.
						Crestron DigitalMedia™ technology cleans up that mess and ensures
						that everything simply works. It’s the gold standard video
						processing and distribution platform, delivering the very best video
						quality, smoothest channel and source selection, and field-tested
						reliability.
					</p>
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://images.pexels.com/photos/4009398/pexels-photo-4009398.jpeg"
						alt=""
					/>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Watch any content anywhere.</h2>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(2, 1fr)",
						gap: 40,
					}}
				>
					<p>
						In full 4K without any special wiring. Plus, everyone gets their own
						favorite pre-set channels.
					</p>
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://images.pexels.com/photos/4009398/pexels-photo-4009398.jpeg"
						alt=""
					/>
				</div>
			</section>
			<TechnologyProducts technology="Video" />
		</main>
	);
}
