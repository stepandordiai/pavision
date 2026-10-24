import { getTranslations } from "next-intl/server";
import { TransitionLink } from "../TransitionLink";
import "./styles.scss";

const services = [
	{
		label: "Crestron",
		img: "/services-crestron.jpg",
		imgAlt: "Crestron service",
		path: "/crestron-integration",
	},
	{
		label: "Loxone",
		img: "/services-loxone.jpg",
		imgAlt: "Loxone service",
		path: "/loxone-smart-home",
		partnerImg: "/loxone-partner-logo.svg",
	},
	{
		label: "Lutron",
		img: "/services-lutron.jpg",
		imgAlt: "Lutron service",
		path: "/lighting",
	},
	{
		label: "Data Engineering",
		img: "/services-data-engineering.jpg",
		imgAlt: "Data engineering service",
		path: "/contacts",
	},
];

export default async function ProgrammingServices() {
	const t = await getTranslations("programmingServices");
	return (
		<section className="programming-services">
			<h2 className="section__title">{t("title")}</h2>
			<div className="services">
				{services.map((s, i) => {
					return (
						<TransitionLink href={s.path} className="service" key={i}>
							{s.partnerImg && (
								<img
									style={{ position: "absolute", top: "10px" }}
									src={s.partnerImg}
									width={300}
									alt="P&A Vision s.r.o. - certified Loxone partner"
								/>
							)}
							<p className="service__label">{s.label}</p>
							<img className="service__img" src={s.img} alt={s.imgAlt} />
						</TransitionLink>
					);
				})}
			</div>
			<TransitionLink
				className="programming-services__link-btn"
				href="/appointment"
			>
				{t("bookTheProgrammer")}
			</TransitionLink>
		</section>
	);
}
