"use client";

// import type { Metadata } from "next";
// import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Hero from "../components/Hero/Hero";
import "./Home.scss";
import Technologies from "../components/home/Technologies/Technologies";
import { useRef, useState } from "react";
import PlayIcon from "../icons/PlayIcon";
import PauseIcon from "../icons/PauseIcon";

// export async function generateMetadata({
// 	params,
// }: {
// 	params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
// 	const { locale } = await params;

// 	return {
// 		title: "P&A Vision | Kvalita, design a technologie v dokonalé rovnováze",
// 		description:
// 			"Tvoříme chytré domy, audio & video systémy, automatizaci a energeticky efektivní řešení.",
// 		alternates: {
// 			canonical: `/${locale}`,
// 			languages: {
// 				cs: "/cs",
// 				en: "/en",
// 				"x-default": "/cs",
// 			},
// 		},
// 	};
// }

const whatWeDo = [
	{
		title: "home.whatWeDo.title1",
		desc: "home.whatWeDo.desc1",
		brands: ["Crestron", "Loxone", "Lutron"],
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/control-touch-screens.jpg",
		icon: "/technology.png",
		lightning: true,
	},
	{
		title: "home.whatWeDo.title2",
		desc: "home.whatWeDo.desc2",
		brands: ["Denon", "Marantz", "LG", "Sonos", "Bowers & Wilkins"],
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-video-consoles.jpg",
		icon: "/sound-wave.png",
		audio: true,
	},

	{
		title: "home.whatWeDo.title3",
		desc: "home.whatWeDo.desc3",
		brands: ["Ubiquiti", "MikroTik", "Cisco"],
		img: "https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg",
		icon: "/wifi.png",
		internet: true,
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

export default function Home() {
	const t = useTranslations();

	const [lightning, setLightning] = useState(false);
	const [lightningIntencity, setLightningIntencity] = useState(50);
	const [playing, setPlaying] = useState(false);

	const audioRef = useRef<HTMLAudioElement>(null);

	const handlePlaying = () => {
		if (!audioRef.current) return;

		if (!playing) {
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}

		setPlaying((prev) => !prev);
	};

	return (
		<main>
			<Hero />
			<section className="section" id="our-solutions">
				<h2 className="section__title">Our solutions</h2>
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
									{item.lightning && (
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: "5px",
												background: "#000",
												padding: 10,
												color: "#fff",
												width: "100%",
												borderRadius: 10,
												marginTop: "auto",
											}}
										>
											<div
												style={{
													display: "flex",
													justifyContent: "space-between",
												}}
											>
												<span>Lightning</span>
												<button
													className={`lightning__btn ${lightning ? "lightning__btn--active" : ""}`}
													onClick={() => setLightning((prev) => !prev)}
												></button>
											</div>
											<div style={{ display: "flex", gap: 5 }}>
												<input
													onChange={(e) =>
														setLightningIntencity(Number(e.target.value))
													}
													className="lightning__range"
													value={lightningIntencity}
													type="range"
													min={0}
													max={100}
													name=""
													id=""
												/>
												<span>{lightningIntencity}%</span>
											</div>
										</div>
									)}

									{/* <div
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
									</div> */}
								</div>
								{item.lightning && (
									<div
										style={{
											height: "100%",
											width: "100%",
											borderRadius: 10,
											overflow: "hidden",
											background: "#333",
										}}
									>
										<div className="lamp">
											<div className="top"></div>
											<div className="base"></div>
											<div className="bottom"></div>
											<div
												style={
													lightning
														? {
																background: `rgb(255, 243, 117)`,
																boxShadow: `0 0 ${lightningIntencity}px rgb(255, 243, 117), 0 0 ${lightningIntencity}px rgb(255, 243, 117), 0 0 ${lightningIntencity}px rgb(255, 243, 117), 0 0 ${lightningIntencity}px rgb(255, 243, 117)`,
															}
														: {}
												}
												className={`bulb ${lightning ? "bulb--active" : ""}`}
											></div>
										</div>
									</div>
								)}
								{item.audio && (
									<div
										style={{
											position: "relative",
											height: "100%",
											width: "100%",
											borderRadius: 10,
											overflow: "hidden",
											background: "#333",
										}}
									>
										<div className="audio">
											<div style={{ display: "flex" }}>
												<span>
													Intro
													<br />
													<span style={{ fontWeight: 600 }}>The xx</span>
												</span>
											</div>
											<button onClick={handlePlaying}>
												{playing ? (
													<PauseIcon size={30} />
												) : (
													<PlayIcon size={30} />
												)}
											</button>
										</div>
										<div className="equalizer">
											{Array.from({ length: 20 }).map((_, i) => {
												return (
													<span
														style={
															playing
																? {
																		animation:
																			"equalize 1.2s ease-in-out infinite",
																	}
																: { animation: "none" }
														}
														key={i}
													></span>
												);
											})}
										</div>
										<audio
											preload="auto"
											ref={audioRef}
											src="/intro.mp3"
										></audio>
									</div>
								)}
								{item.internet && (
									<div
										style={{
											position: "relative",
											height: "100%",
											width: "100%",
											borderRadius: 10,
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<div>
											<div style={{ display: "flex" }}>
												<div className="room1"></div>
												<div className="room2"></div>
											</div>
											<div className="room"></div>
										</div>
									</div>
								)}
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
