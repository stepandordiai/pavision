import { getTranslations } from "next-intl/server";
import "./styles.scss";

const brands = [
	{
		name: "Crestron",
		bgImg: "/brands/crestron-integrator.png",
	},
	{
		name: "Loxone",
		bgImg: "/brands/loxone-integrator.png",
	},
	{
		name: "Lutron",
		bgImg: "/brands/lutron-integrator.png",
	},
	{
		name: "Denon",
		bgImg: "/brands/denon-integrator.png",
	},
	{
		name: "Marantz",
		bgImg: "/brands/marantz-integrator.png",
	},
	{
		name: "LG",
		bgImg: "/brands/lg-integrator.png",
	},
	{
		name: "Sonos",
		bgImg: "/brands/sonos-integrator.png",
	},
	{
		name: "Bowers & Wilkins",
		bgImg: "/brands/bowers-wilkins-integrator.png",
	},
	{
		name: "Ubiquiti",
		bgImg: "/brands/ubiquiti-integrator.png",
	},
	{
		name: "MicroTik",
		bgImg: "/brands/microtik-integrator.png",
	},
	{
		name: "Cisco",
		bgImg: "/brands/cisco-integrator.png",
	},
	{
		name: "Jablotron",
		bgImg: "/brands/jablotron-integrator.png",
	},
	{
		name: "Paradox",
		bgImg: "/brands/paradox-integrator.png",
	},
	{
		name: "Risco",
		bgImg: "/brands/risco-integrator.png",
	},
];

export default async function Brands() {
	const t = await getTranslations("brands");

	return (
		<section className="section">
			<h2 className="section__title">{t("heading")}</h2>
			<div className="brands">
				{brands.map((brand, i) => {
					return (
						<div className="brand-container" key={i}>
							<p className="brand-name">{brand?.name}</p>
							<img className="brand-bg" src={brand?.bgImg} alt="" />
						</div>
					);
				})}
			</div>
		</section>
	);
}
