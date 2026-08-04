import { TransitionLink } from "../TransitionLink";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import HeroParallaxClient from "./HeroParallaxClient";
import { getTranslations } from "next-intl/server";
import "./styles.scss";

type HeroParallaxProps = {
	heading: string;
	subheading: string;
	imgSrc: string;
	secondaryBtnTxt: string;
	imgAlt?: string;
	currentPage: string;
	locale: string;
};

export default async function HeroParallax({
	heading,
	subheading,
	secondaryBtnTxt,
	currentPage,
	imgSrc,
	imgAlt = "",
	locale,
}: HeroParallaxProps) {
	const t = await getTranslations();

	return (
		<section className="home-access-hero">
			<Breadcrumbs links={[{ label: currentPage }]} locale={locale} />
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "20px",
					padding: "0 20px 20px",
				}}
			>
				<h1 className="main-heading">{heading}</h1>
				<p style={{ maxWidth: "1000px" }} className="main__subtitle">
					{subheading}
				</p>
				<TransitionLink href="/contacts" className="hero-btn">
					<span>{t("nav.bookAConsultation")}</span>
					<span>
						<ChevronRightIcon />
					</span>
				</TransitionLink>
				<div className="footer__divider"></div>
				<a className="header-nav__link" href="#section">
					{secondaryBtnTxt}
				</a>
			</div>
			<HeroParallaxClient imgSrc={imgSrc} imgAlt={imgAlt} />
		</section>
	);
}
