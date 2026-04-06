"use client";

import Hero from "../components/Hero/Hero";
import Technologies from "../components/home/Technologies/Technologies";
import OurSolutions from "../components/home/OurSolutions/OurSolutions";
import CrestronApp from "../components/CrestronApp/CrestronApp";
import WhatWeDo from "../components/WhatWeDo/WhatWeDo";
import "./Home.scss";

const brands = [
	"Crestron",
	"Loxone",
	"Lutron",
	"Denon",
	"Marantz",
	"LG",
	"Sonos",
	"Bowers & Wilkins",
	"Ubiquiti",
	"MicroTik",
	"Cisco",
	"Jablotron",
	"Paradox",
	"Risco",
];

export default function HomeClient() {
	return (
		<main>
			<Hero />
			<OurSolutions />
			<CrestronApp />
			<WhatWeDo />
			<Technologies />
			<section className="section">
				<h2 className="section__title">Trusted Brands. Smarter Homes.</h2>
				<div className="brands">
					{brands.map((brand, i) => {
						return <div key={i}>{brand}</div>;
					})}
				</div>
			</section>
		</main>
	);
}
