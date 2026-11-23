"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";

export default function LightingClient() {
	const t = useTranslations();

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
		<div className="lightning-section-container">
			<div>
				<p>
					Your body runs on a 24-hour cycle called a circadian rhythm. Lighting
					affects one major aspect of it: your sleep-wake cycle. Replicating
					natural light provided by the cycles of the sun with artificial light
					can improve your mood, concentration, creativity, and energy levels,
					as well as promote better sleep. This can be accomplished using
					tunable LED light fixtures and technology such as the Crestron
					SolarSync® photosensor.
				</p>
				<div
					style={{
						display: "flex",
						gap: 5,
						flexWrap: "wrap",
						marginTop: 10,
					}}
				>
					{data.map((el, i) => {
						return (
							<button
								key={i}
								onClick={() => setInteriorState(el)}
								className={`btn ${interiorState.state === el.state ? "btn--active" : ""}`}
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
				}}
				src={interiorState.imgSrc}
				alt=""
			/>
		</div>
	);
}
