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
