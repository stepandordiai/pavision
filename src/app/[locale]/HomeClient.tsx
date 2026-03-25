"use client";

import { useTranslations } from "next-intl";
import Hero from "../components/Hero/Hero";
import Technologies from "../components/home/Technologies/Technologies";
import { useRef, useState } from "react";
import PlayIcon from "../icons/PlayIcon";
import PauseIcon from "../icons/PauseIcon";
import "./Home.scss";

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

export default function HomeClient() {
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
				<h2 className="section__title">Our solutions with Crestron Home</h2>
				<div className="our-solutions">
					<div className="our-solutions-container">
						<div>
							<h3
								style={{
									background: "#000",
									padding: 10,
									borderRadius: 10,
									width: "max-content",
								}}
							>
								Security
							</h3>
							<p style={{ fontSize: "2rem" }}>Peace of mind for your home</p>
							<br />
							<p>
								You can’t put a price on the peace of mind that comes with
								knowing your loved ones are safe and what’s most precious and
								treasured are secure whether you are at home or away.
							</p>
						</div>
						<div>
							<img src="/01.jpg" alt="" />
							<br />
							<br />
							<p>
								Continuous system feedback on our mobile device confirms the
								status of door locks and alarms, the exact positions of gates
								and garages, and provides real-time views of cameras.
							</p>
						</div>
					</div>
					<div className="our-solutions-container">
						<div>
							<h3
								style={{
									background: "#000",
									padding: 10,
									borderRadius: 10,
									width: "max-content",
								}}
							>
								Wellness
							</h3>
							<p style={{ fontSize: "2rem" }}>
								Yes. Your home can benefit your health
							</p>
							<br />
							<p>
								Your sleep. Your energy. Your mood. Your emotional and physical
								health. A smart home can improve and support these, and other,
								aspects of wellness. Lighting, acoustics, temperature, and water
								quality all play a role. The Crestron Home® OS allows you to
								easily orchestrate your home’s environment, as well as how your
								home interacts with the outside world to create an oasis that
								enhances your life.
							</p>
						</div>
						<div>
							<img src="/02.jpg" alt="" />
						</div>
					</div>
					<div className="our-solutions-container">
						<div>
							<h3
								style={{
									background: "#000",
									padding: 10,
									borderRadius: 10,
									width: "max-content",
								}}
							>
								Comfort
							</h3>
							<p style={{ fontSize: "2rem" }}>Your home is your sanctuary</p>
							<br />
							<p>
								It’s the one place that is truly your own. Everything is
								impeccably suited to you.
							</p>
							<p>
								The cushions are just as soft or firm as you like. The fixtures
								and finishes are carefully selected. The light and temperature
								in every space are always perfectly adjusted for every hour and
								every occasion.
							</p>
						</div>
						<div>
							<img
								src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostat-thumn.jpg"
								alt=""
							/>
						</div>
					</div>
					<div className="our-solutions-container">
						<div>
							<h3
								style={{
									background: "#000",
									padding: 10,
									borderRadius: 10,
									width: "max-content",
								}}
							>
								Convenience
							</h3>
							<p style={{ fontSize: "2rem" }}>
								Your home should work for you, not the other way around
							</p>
							<br />
							<p>
								The Crestron Home® OS makes the complex simple: The monotonous
								automatic; the tedious quick. Whatever you want, wherever you
								are, it’s a tap. Everything simply works the way you want it to
								every time.
							</p>
							<br />
							<p>
								No hoping. No stressing: Watch content and play video games on
								any TV; Listen to your favorite streaming service or playlist
								throughout the house.
							</p>
						</div>
						<div>
							<img
								src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-hero.jpg"
								alt=""
							/>
						</div>
					</div>
				</div>
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
