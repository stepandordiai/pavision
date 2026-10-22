import { getTranslations } from "next-intl/server";
import { TransitionLink } from "../TransitionLink";
import "./styles.scss";

const services = [
	{
		label: "Crestron",
		img: "/services-crestron.jpg",
	},
	{
		label: "Loxone",
		img: "/services-loxone.jpg",
	},
	{
		label: "Lutron",
		img: "/services-lutron.jpg",
	},
	{
		label: "Data Engineering",
		img: "/services-data-engineering.jpg",
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
						<TransitionLink href="/contacts" className="service" key={i}>
							<p className="service__label">{s.label}</p>
							<img className="service__img" src={s.img} alt="" />
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
