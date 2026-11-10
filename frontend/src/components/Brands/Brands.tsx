import { getTranslations } from "next-intl/server";
import "./styles.scss";

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
	"MikroTik",
	"Cisco",
	"Jablotron",
	"Paradox",
	"Risco",
];

export default async function Brands() {
	const t = await getTranslations("brands");

	return (
		<section className="section">
			<h2 className="section__title">{t("heading")}</h2>
			{/* TODO: learn this */}
			{[0, 1].map((row) => (
				<div key={row} className="brands__marquee">
					<div className="brands__marquee-inner">
						{[0, 1].map((copy) => (
							<div
								key={copy}
								className="brands__marquee__list"
								aria-hidden={copy > 0 || undefined}
							>
								{brands.map((brand) => (
									<span key={brand} className="brands__marquee__item">
										{brand}
									</span>
								))}
							</div>
						))}
					</div>
				</div>
			))}
		</section>
	);
}
