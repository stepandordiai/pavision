import type { Metadata } from "next";
import Hero from "./components/Hero/Hero";
import "./Home.scss";

export const metadata: Metadata = {
	title: "P&A Vision | Kvalita, design a technologie v dokonalé rovnováze",
	description:
		"Tvoříme chytré domy, audio & video systémy, automatizaci a energeticky efektivní řešení.",
};

export default function Home() {
	return (
		<main>
			<Hero />
			<section className="section">
				<h2>Kdo jsme</h2>
				<div className="img-wrapper">
					<img
						className="img"
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-health.jpg"
						width={500}
						alt=""
					/>
				</div>
				<p>
					Máme 15 let zkušeností (montáže v Británii, automatizace, AV
					instalace). Zabezpečením se zabýváme komplexně. Nabízíme zabezpečovací
					systémy od značek Jablotron, Paradox a Risco, přístupové systémy jako
					Salto, a kamerové i přístupové systémy od Ubiquiti. Díky tomu
					poskytujeme bezpečnostní řešení na míru s flexibilními a ověřenými
					technologiemi.
				</p>
			</section>
			<section className="section">
				<h2>Co děláme</h2>
			</section>
			<section className="section">
				<h2>Technologie</h2>
			</section>
			<section className="section">
				<h2>Produkty</h2>
			</section>
		</main>
	);
}
