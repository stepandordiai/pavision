import { getTranslations } from "next-intl/server";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import { TransitionLink } from "../TransitionLink";
import RoomAutomation from "./RoomAutomation";
import { Link } from "@/i18n/navigation";
import "./Hero.scss";

export default async function Hero() {
	const t = await getTranslations();

	return (
		<section className="hero">
			<div className="hero__room">
				<RoomAutomation />
			</div>
			<div className="hero-container">
				<h1 className="hero__title">{t("hero.title")}</h1>
				<p className="hero__desc">{t("hero.subtitle")}</p>
				{/* <img
					src="/loxone-partner.svg"
					width={300}
					alt="Loxone Silver Partner"
				/> */}
				<div
					style={{
						display: "flex",
						gap: "10px",
						flexWrap: "wrap",
						marginTop: "20px",
						marginBottom: "100px",
					}}
				>
					<Link href="/#our-solutions" className="hero-sec-btn">
						{t("hero.ourSolutions")}
					</Link>
					<TransitionLink href="/appointment" className="hero-btn">
						<span>{t("nav.bookAConsultation")}</span>
						<span>
							<ChevronRightIcon />
						</span>
					</TransitionLink>
				</div>
			</div>
		</section>
	);
}
