"use client";

import { useTranslations } from "next-intl";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import CrestronApp from "@/components/CrestronApp/CrestronApp";
import { useState } from "react";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";

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
	const t = useTranslations();

	const [interiorState, setInteriorState] = useState(data[0]);

	return (
		<main style={{ overflow: "hidden" }}>
			<HeroParallax
				heading={t("lighting.title")}
				subheading={t("lighting.subtitle")}
				imgSrc="/lighting/01-c.png"
				secondaryBtnTxt="Explore Lighting Solutions"
			/>
			<section className="section" id="section">
				<h2 className="section__title">
					Lighting is directly linked to physical and emotional well-being
				</h2>
				<div className="lightning-section-container">
					<div>
						<p>
							Your body runs on a 24-hour cycle called a circadian rhythm.
							Lighting affects one major aspect of it: your sleep-wake cycle.
							Replicating natural light provided by the cycles of the sun with
							artificial light can improve your mood, concentration, creativity,
							and energy levels, as well as promote better sleep. This can be
							accomplished using tunable LED light fixtures and technology such
							as the Crestron SolarSync® photosensor.
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
			</section>
			<section className="section" id="section">
				<h2 className="section__title">
					Lighting is directly linked to physical and emotional well-being
				</h2>
				<div className="lightning-section-container">
					<img
						style={{
							borderRadius: 10,
						}}
						src="/lighting/02-c.png"
						alt=""
					/>
					<p>
						Your body runs on a 24-hour cycle called a circadian rhythm.
						Lighting affects one major aspect of it: your sleep-wake cycle.
						Replicating natural light provided by the cycles of the sun with
						artificial light can improve your mood, concentration, creativity,
						and energy levels, as well as promote better sleep. This can be
						accomplished using tunable LED light fixtures and technology such as
						the Crestron SolarSync® photosensor.
					</p>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					At sunrise the lights slowly ramp up and the shades slowly open to
					gently welcome the new day.
				</h2>
				<div className="lightning-section-container">
					<video
						style={{ width: "100%", borderRadius: 10 }}
						autoPlay
						playsInline
						muted
						loop
					>
						<source src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product_lighting_-_os4_update-(1080p).mp4" />
					</video>
					<div>
						<p>
							Set the mood for entertaining, create the perfect atmosphere for
							family movie night; or ensure the optimal setting for a
							professional conference call.
							<br />
							<br />
							Lights automatically turn on when you walk into a room and turn
							off shortly after you leave. At the end of the day, tap
							“Goodnight” from your bed to turn off all the lights and close all
							the shades.
						</p>
					</div>
				</div>
			</section>
			<TechnologyProducts technology="Lighting" />
			<CrestronApp />
		</main>
	);
}
