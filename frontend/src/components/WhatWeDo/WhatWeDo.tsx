"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import PlayIcon from "@/components/icons/PlayIcon";
import PauseIcon from "@/components/icons/PauseIcon";
import SoundwaveIcon from "../icons/SoundwaveIcon";
import LightingIcon from "../icons/LightingIcon";
import WifiIcon from "../icons/WifiIcon";
import "./styles.scss";

const whatWeDo = [
	{
		title: "home.whatWeDo.title1",
		desc: "home.whatWeDo.desc1",
		brands: ["Crestron", "Loxone", "Lutron"],
		icon: <LightingIcon size={20} />,
		lightning: true,
	},
	{
		title: "home.whatWeDo.title2",
		desc: "home.whatWeDo.desc2",
		brands: ["Denon", "Marantz", "LG", "Sonos", "Bowers & Wilkins"],
		icon: <SoundwaveIcon size={20} />,
		audio: true,
	},

	{
		title: "home.whatWeDo.title3",
		desc: "home.whatWeDo.desc3",
		brands: ["Ubiquiti", "MikroTik", "Cisco"],
		icon: <WifiIcon size={20} />,
		img: "/sitova-infrastruktura.png",
	},
];

const WhatWeDo = () => {
	const t = useTranslations();

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

	const data = [
		{
			state: t("home.whatWeDo.scenes.relax"),
			imgSrc: "/what-we-do/scenes/relax-scene.png",
		},
		{
			state: t("home.whatWeDo.scenes.cooking"),

			imgSrc: "/what-we-do/scenes/cooking-scene.png",
		},
		{
			state: t("home.whatWeDo.scenes.dinner"),

			imgSrc: "/what-we-do/scenes/dinner-scene.png",
		},
		{
			state: t("home.whatWeDo.scenes.party"),

			imgSrc: "/what-we-do/scenes/party-scene.png",
		},
		{
			state: t("home.whatWeDo.scenes.night"),

			imgSrc: "/what-we-do/scenes/night-scene.png",
		},
	];

	const [interiorState, setInteriorState] = useState(data[0]);

	return (
		<section className="section">
			<h2
				className="home__section-title"
				style={{
					position: "sticky",
					top: "70px",
					background: "#000",
					padding: "0 10px",
					borderRadius: "10px",
					width: "max-content",
					height: "40px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					marginBottom: "10px",
				}}
			>
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
											color: "#fff",
											width: "40px",
											height: "40px",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										{item.icon && item.icon}
									</div>
									<h3 style={{ fontSize: "18px" }}>{t(item.title)}</h3>
								</div>
								<p>{t(item.desc)}</p>
							</div>
							{item.lightning && (
								<div
									style={{
										width: "100%",
										height: "100%",
										display: "flex",
										flexDirection: "column",
										gap: "10px",
									}}
								>
									<div>
										<p
											style={{
												marginBottom: "10px",
											}}
										>
											Lighting Scenes
										</p>
										<div
											style={{
												display: "flex",
												gap: 5,
												flexWrap: "wrap",
											}}
										>
											{data.map((el, i) => {
												return (
													<button
														key={i}
														onClick={() => setInteriorState(el)}
														className={`what-we-do__scene-btn ${interiorState.state === el.state ? "what-we-do__scene-btn--active" : ""}`}
													>
														{el.state}
													</button>
												);
											})}
										</div>
									</div>
									<img
										style={{
											borderRadius: 10,
											flex: 1,
											objectFit: "cover",
											objectPosition: "center",
										}}
										src={interiorState.imgSrc}
										alt=""
									/>
									<p>
										Each scene adjusts lighting, shading, and room temperature
										at a single touch.
									</p>
								</div>
							)}
							{item.audio && (
								<div
									style={{
										position: "relative",
										height: "100%",
										width: "100%",
										borderRadius: 10,
										background:
											"url(https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/16015943/80143397_7FF2_4584_809D_08E74930277C.jpeg?quality=90&strip=all&crop=0%2C5.5555555555556%2C100%2C88.888888888889&w=2400)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "cover",
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
									<audio preload="auto" ref={audioRef} src="/intro.mp3"></audio>
								</div>
							)}
							{item.img && (
								<div style={{ height: "100%", width: "100%" }}>
									<img
										src={item.img}
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
											borderRadius: "10px",
										}}
										alt=""
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default WhatWeDo;
