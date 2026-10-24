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
		title: "home.whatWeDo.automation.title",
		desc: "home.whatWeDo.automation.paragraphs",
		icon: <LightingIcon size={20} />,
		lightning: true,
	},
	{
		title: "home.whatWeDo.av.title",
		desc: "home.whatWeDo.av.paragraphs",
		icon: <SoundwaveIcon size={20} />,
		audio: true,
	},

	{
		title: "home.whatWeDo.network.title",
		desc: "home.whatWeDo.network.paragraphs",
		icon: <WifiIcon size={20} />,
		video: "/what-we-do-unifi-1.mp4",
		video1: "/what-we-do-unifi-2.mp4",
	},
];

const base: React.CSSProperties = {
	position: "absolute",
	inset: 0,
	width: "100%",
	height: "100%",
	objectFit: "cover",
	objectPosition: "center",
	transition: "opacity 0.3s",
};

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

	const loopRef = useRef<HTMLVideoElement>(null);
	const [introDone, setIntroDone] = useState(false);

	const handleIntroEnded = () => {
		loopRef.current
			?.play()
			.then(() => setIntroDone(true))
			.catch(() => setIntroDone(true));
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
			<h2 className="section__title what-we-do__heading">
				{t("home.whatWeDo.heading")}
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
											background: "#fff",
											padding: 10,
											borderRadius: 10,
											color: "#000",
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
								<div className="what-we-do__container-desc">
									{(t.raw(item.desc) as string[]).map((p, i) => (
										<p key={i}>{p}</p>
									))}
								</div>
							</div>
							{item.lightning && (
								<div
									style={{
										width: "100%",
										display: "flex",
										flexDirection: "column",
										gap: "10px",
									}}
								>
									<div
										style={{
											flex: "1",
										}}
									>
										<p
											style={{
												marginBottom: "10px",
											}}
										>
											{t("home.whatWeDo.lightingScenes")}
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
									<div
										style={{
											overflow: "hidden",
											borderRadius: 10,
										}}
									>
										<img
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												objectPosition: "center",
											}}
											src={interiorState.imgSrc}
											alt=""
										/>
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
										backgroundImage: "url('/what-we-do-av.jpg')",
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
							{item.video && (
								<div
									style={{
										height: "100%",
										width: "100%",
										position: "relative",
										overflow: "hidden",
										borderRadius: "10px",
									}}
								>
									{/* Loop video: preloaded, starts when the intro ends */}
									<video
										ref={loopRef}
										src={item.video1}
										style={{ ...base, opacity: introDone ? 1 : 0 }}
										muted
										loop
										playsInline
										preload="auto"
									/>
									{/* Intro video: plays once */}
									<video
										src={item.video}
										style={{ ...base, opacity: introDone ? 0 : 1 }}
										autoPlay
										muted
										playsInline
										onEnded={handleIntroEnded}
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
