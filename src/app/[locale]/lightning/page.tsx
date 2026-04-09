"use client";

import HeroParallax from "@/components/HeroParallax/HeroParallax";
import CrestronApp from "@/components/CrestronApp/CrestronApp";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import "./styles.scss";
import { useState } from "react";
import ArrowRightUpIcon from "@/components/icons/ArrowRightUpIcon";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// export async function generateMetadata({
// 	params,
// }: {
// 	params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
// 	const { locale } = await params;
// 	const t = await getTranslations({ locale, namespace: "lightning.meta" });
// 	const page = "/lightning";
// 	const languages = Object.fromEntries(
// 		routing.locales.map((l) => [l, `/${l}/${page}`]),
// 	);

// 	return {
// 		title: t("title"),
// 		description: t("desc"),
// 		alternates: {
// 			canonical: `/${locale}/${page}`,
// 			languages: {
// 				...languages,
// 				"x-default": `/${routing.defaultLocale}/${page}`,
// 			},
// 		},
// 	};
// }

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

const products = [
	{
		name: "Horizon ™",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
		type: "Klávesnice",
		technology: "Lightning",
		brand: "Crestron",
	},
	{
		name: "Cameo ®",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-3.png",
		type: "Klávesnice",
		technology: "Lightning",
		brand: "Crestron",
	},
	{
		name: "Vitrea",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-4.jpg",
		type: "Klávesnice",
		technology: "Lightning",
		brand: "Crestron",
	},
	{
		name: "Rhombus",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-5.jpg",
		type: "Klávesnice",
		technology: "Lightning",
		brand: "Crestron",
	},
	{
		name: "Black Nova",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-6.jpg",
		type: "Klávesnice",
		technology: "Lightning",
		brand: "Crestron",
	},
	{
		name: "Tyba",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-7.jpg",
		type: "Klávesnice",
		technology: "Lightning",
		brand: "Crestron",
	},
	{
		name: "Horizon ™",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-dimmer-1b.png",
		type: "Stmívače a vypínače",
		technology: "Lightning",
		brand: "Crestron",
	},
	{
		name: "Cameo ®",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-dimmer-3.png",
		type: "Stmívače a vypínače",
		technology: "Lightning",
		brand: "Crestron",
	},
	{
		name: "Horizon ™",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostat-tile.png",
		type: "Thermostats",
		technology: "Thermostats",
		brand: "Crestron",
	},
	{
		name: "Horizon ®",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-horizon-edition3.png",
		type: "Keypads, Dimmers, Switches",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "Cameo ®",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-cameo-edition3.png",
		type: "Keypads, Dimmers, Switches",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "7” Tabletop",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-7-tabletop2.png",
		type: "Touch Screens",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "7” Desktop with Conferencing",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-7-desktop3.png",
		type: "Touch Screens",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "10” Tabletop",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-10-tabletop2.png",
		type: "Touch Screens",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "5” Wall",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-5-wall2.png",
		type: "Touch Screens",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "7” Wall",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-7-wall2.png",
		type: "Touch Screens",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "10” Wall",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-10-wall2.png",
		type: "Touch Screens",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "Roller",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-roller.jpg",
		type: "Shades",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "Horizontal Sheer",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-horizontal-sheer.jpg",
		type: "Shades",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "Drapery",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-drapery.jpg",
		type: "Shades",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "Roman",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-roman.jpg",
		type: "Shades",
		technology: "Shades",
		brand: "Crestron",
	},
	{
		name: "Reference",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/audio-product-speaker-reference.png",
		type: "Speakers",
		technology: "Audio",
		brand: "Crestron",
	},
	{
		name: "Ultimate",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/audio-product-speaker-ultimate.png",
		type: "Speakers",
		technology: "Audio",
		brand: "Crestron",
	},
	{
		name: "DM NAX™ 8-zone streaming amplifier",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/audio-product-amps-dmnax.png",
		type: "Amps",
		technology: "Audio",
		brand: "Crestron",
	},
	{
		name: "Yale",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-home-access-locks-yale.png",
		type: "Locks",
		technology: "Home access",
		brand: "Crestron",
	},
	{
		name: "2N",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-home-access-itercoms-2n.png",
		type: "Intercoms and door stations",
		technology: "Home access",
		brand: "Crestron",
	},
	{
		name: "eKey",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-home-access-itercoms-ekey.png",
		type: "Intercoms and door stations",
		technology: "Home access",
		brand: "Crestron",
	},
	{
		name: "AVLINKPRO",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/home-access-product-avlinkpro.png",
		type: "Intercoms and door stations",
		technology: "Home access",
		brand: "Crestron",
	},
	{
		name: "LED Ceiling Spot RGBW Tree White",
		img: "https://pim.loxone.com//01%20Product%20Data/01%20Products/Lighting/100503%20-%20LED%20Aufbauspot%20RGBW%20Tree%20Wei%C3%9F/Images/ph-shop-100503-led-spot-tree-white-03.jpg",
		type: "Ceiling Spot",
		technology: "Lightning",
		brand: "Loxone",
	},
];

export default function Lightning() {
	const [interiorState, setInteriorState] = useState(data[0]);
	const [productBrand, setProductBrand] = useState("Crestron");

	return (
		<main>
			<HeroParallax
				heading="Lightning"
				subheading="Technology"
				imgSrc="/07.jpg"
			/>
			<section className="section">
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
			<section style={{ minHeight: "100svh", background: "#333", padding: 20 }}>
				<div className="technology__title">
					<div className="technology__icon-container">
						<img src="/lightning.png" width={24} height={24} alt="" />
					</div>
					<p>Lightning</p>
				</div>
				<p style={{ fontSize: "2rem" }}>Products</p>
				<div
					style={{
						display: "flex",
						gap: 5,
						flexWrap: "wrap",
						marginTop: 10,
						marginBottom: 10,
					}}
				>
					{["Crestron", "Loxone"].map((el, i) => {
						return (
							<button
								onClick={() => setProductBrand(el)}
								className={`btn ${productBrand === el ? "btn--active" : ""}`}
								key={i}
							>
								{el}
							</button>
						);
					})}
				</div>
				<Swiper
					breakpoints={{
						0: {
							slidesPerView: 2.25, // mobile
						},
						768: {
							slidesPerView: 4.25, // tablet+
						},
					}}
					spaceBetween={10}
					className="mySwiper"
				>
					{products
						.filter(
							(p) => p.technology === "Lightning" && p.brand === productBrand,
						)
						.map((product, i) => {
							return (
								<SwiperSlide>
									<div key={i} className="product-container">
										<p className="product__title">{product.name}</p>
										<img src={product.img} alt="" />
										<p
											style={{
												display: "flex",
												justifyContent: "flex-end",
												alignItems: "center",
												gap: 5,
											}}
										>
											<span>Zjistěte více</span>
											<span className="product-icon-wrapper">
												<ArrowRightUpIcon />
											</span>
										</p>
									</div>
								</SwiperSlide>
							);
						})}
				</Swiper>
			</section>
			<CrestronApp />
		</main>
	);
}
