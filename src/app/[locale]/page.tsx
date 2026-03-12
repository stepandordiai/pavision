import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "../components/Hero/Hero";
import "./Home.scss";
import Technologies from "../components/home/Technologies/Technologies";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;

	return {
		title: "P&A Vision | Kvalita, design a technologie v dokonalé rovnováze",
		description:
			"Tvoříme chytré domy, audio & video systémy, automatizaci a energeticky efektivní řešení.",
		alternates: {
			canonical: `/${locale}`,
			languages: {
				cs: "/cs",
				en: "/en",
				"x-default": "/cs",
			},
		},
	};
}

const whatWeDo = [
	{
		title: "home.whatWeDo.title1",
		desc: "home.whatWeDo.desc1",
		brands: ["Crestron", "Loxone", "Lutron"],
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/control-touch-screens.jpg",
		icon: "/technology.png",
	},
	{
		title: "home.whatWeDo.title2",
		desc: "home.whatWeDo.desc2",
		brands: ["Denon", "Marantz", "LG", "Sonos", "Bowers & Wilkins"],
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-video-consoles.jpg",
		icon: "/sound-wave.png",
	},

	{
		title: "home.whatWeDo.title3",
		desc: "home.whatWeDo.desc3",
		brands: ["Ubiquiti", "MikroTik", "Cisco"],
		img: "https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg",
		icon: "/wifi.png",
	},
	{
		title: "home.whatWeDo.title4",
		desc: "home.whatWeDo.desc4",
		brands: [],
		img: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg",
		icon: "/electric-panel.png",
	},
];

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

export default async function Home() {
	const t = await getTranslations();
	return (
		<main>
			<Hero />
			<section className="section" id="who-we-are">
				<h2 className="section__title">{t("home.whoWeAreTitle")}</h2>
				{/* <div className="img-wrapper">
					<img
						className="img"
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-health.jpg"
						width={500}
						alt=""
					/>
				</div> */}
				<p style={{ textAlign: "center", fontSize: "1.6rem", margin: "auto" }}>
					{t("home.whoWeAreDesc")}
				</p>
			</section>
			<section className="section">
				<h2 style={{ position: "sticky", top: 80 }} className="section__title">
					{t("home.whatWeDoTitle")}
				</h2>
				<div className="what-we-do">
					{whatWeDo.map((item, i) => {
						return (
							<div key={i} className="what-we-do-container">
								<div
									style={{
										width: "100%",
										display: "flex",
										flexDirection: "column",
										height: "100%",
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "flex-start",
											alignItems: "center",
											gap: 5,
											marginBottom: 10,
										}}
									>
										<div
											style={{
												background: "#000",
												padding: 10,
												borderRadius: 10,
											}}
										>
											<img src={item.icon} width={22} alt="" />{" "}
										</div>
										<span style={{ fontSize: "18px" }}>{t(item.title)}</span>
									</div>
									<p>{t(item.desc)}</p>
									<div
										style={{
											display: "flex",
											flexWrap: "wrap",
											gap: 10,
											marginTop: "auto",
										}}
									>
										{item.brands.map((brand, i) => {
											return (
												<span
													style={{
														padding: 10,
														borderRadius: 5,
														background: "rgba(0, 0, 0, 0.05)",
													}}
													key={i}
												>
													{brand}
												</span>
											);
										})}
									</div>
								</div>
								<div
									style={{
										width: "100%",
										borderRadius: 10,
										overflow: "hidden",
									}}
								>
									<img src={item.img} alt="" />
								</div>
							</div>
						);
					})}
				</div>
			</section>
			<Technologies />
			<section className="section">
				<h2 className="section__title">Trusted Brands. Smarter Homes.</h2>
				<div className="brands">
					{brands.map((brand, i) => {
						return <p key={i}>{brand}</p>;
					})}
				</div>
			</section>
		</main>
	);
}
