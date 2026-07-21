"use client";

import { useState } from "react";

const data = [
	{
		state: "Večeře",
		imgSrc:
			"https://www.loxone.com/dede/wp-content/uploads/sites/2/2026/03/PH-lighting-scene-2.jpg",
	},
	{
		state: "Vaření",
		imgSrc:
			"https://www.loxone.com/dede/wp-content/uploads/sites/2/2026/03/PH-lighting-scene-5.jpg",
	},
	{
		state: "Párty",
		imgSrc:
			"https://www.loxone.com/dede/wp-content/uploads/sites/2/2026/03/PH-lighting-scene-3.jpg",
	},
	{
		state: "Relax",
		imgSrc:
			"https://www.loxone.com/dede/wp-content/uploads/sites/2/2026/03/PH-lighting-scene-4.jpg",
	},
	{
		state: "Noc",
		imgSrc:
			"https://www.loxone.com/dede/wp-content/uploads/sites/2/2026/03/PH-lighting-scene-1.jpg",
	},
];

export default function LightingClient() {
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
