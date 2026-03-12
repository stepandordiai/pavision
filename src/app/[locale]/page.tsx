"use client";

import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import Hero from "../components/Hero/Hero";
import "./Home.scss";

// import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Pagination } from "swiper/modules";

// export const metadata: Metadata = {
// 	title: "P&A Vision | Kvalita, design a technologie v dokonalé rovnováze",
// 	description:
// 		"Tvoříme chytré domy, audio & video systémy, automatizaci a energeticky efektivní řešení.",
// };

const whatWeDo = [
	{
		title: "home.whatWeDo.title1",
		desc: "home.whatWeDo.desc1",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/control-touch-screens.jpg",
		icon: "/technology.png",
	},
	{
		title: "home.whatWeDo.title2",
		desc: "home.whatWeDo.desc2",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-video-consoles.jpg",
		icon: "/sound-wave.png",
	},

	{
		title: "home.whatWeDo.title3",
		desc: "home.whatWeDo.desc3",
		img: "https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg",
		icon: "/wifi.png",
	},
	{
		title: "home.whatWeDo.title4",
		desc: "home.whatWeDo.desc2",
		img: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg",
		icon: "/electric-panel.png",
	},
];

const technologies = [
	{
		title: "Lightning",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-dimmer-3.jpg",
		icon: "light-bulb.png",
	},
	{
		title: "Shading",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-roller.jpg",
		icon: "blinds.png",
	},
	{
		title: "Audio",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/audio-products-speakers-image.jpg",
		icon: "light-bulb.png",
	},
	{
		title: "Video",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-video-hero.jpg",
		icon: "blinds.png",
	},
	{
		title: "Home access",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/partner%20pages/integrated%20partners/2n/photo1_desktop.png",
		icon: "light-bulb.png",
	},
	{
		title: "Thermostats",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostat-thumn.jpg",
		icon: "blinds.png",
	},
];

export default function Home() {
	const t = useTranslations();

	const handleSlideChange = (swiper: any) => {
		const bullets = document.querySelectorAll(
			".custom-bullet",
		) as NodeListOf<HTMLSpanElement>;
		bullets.forEach((bullet, i) => {
			if (i < swiper.realIndex) {
				bullet.classList.add("custom-bullet--filled");
				bullet.classList.remove("custom-bullet--animating");
			} else if (i > swiper.realIndex) {
				// Future bullets — fully reset
				bullet.classList.remove("custom-bullet--filled");
				bullet.classList.remove("custom-bullet--animating");
			} else {
				// Current — restart animation
				bullet.classList.remove("custom-bullet--filled");
				bullet.classList.remove("custom-bullet--animating");

				// Force reflow then re-add
				void bullet.offsetWidth;
				bullet.classList.add("custom-bullet--animating");
			}
		});
	};

	return (
		<main>
			<Hero />
			<section className="section">
				<h2 className="section__title" id="who-we-are">
					{t("home.whoWeAreTitle")}
				</h2>
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
				<h2 style={{ position: "sticky", top: 75 }} className="section__title">
					{t("home.whatWeDoTitle")}
				</h2>
				<div className="what-we-do">
					{whatWeDo.map((item, i) => {
						return (
							<div key={i} className="what-we-do-container">
								<div style={{ width: "100%" }}>
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
			<section style={{ overflow: "hidden" }} className="section">
				<h2 className="section__title">{t("home.technologies")}</h2>
				<div className="technologies">
					<Swiper
						breakpoints={{
							0: {
								slidesPerView: 1.25, // mobile
							},
							768: {
								slidesPerView: 3.25, // tablet+
							},
						}}
						spaceBetween={10}
						pagination={{
							clickable: true,
							renderBullet: (index, className) => {
								return `<span key={${index} class="${className} custom-bullet"></span>`;
							},
						}}
						speed={1000}
						autoplay={{
							delay: 5000,
							disableOnInteraction: false,
						}}
						modules={[Pagination, Autoplay]}
						className="mySwiper"
						onSlideChange={handleSlideChange}
					>
						{technologies.map((technology, i) => {
							return (
								<SwiperSlide>
									<div key={i} className="technology">
										<div className="technology__img-wrapper">
											<img src={technology.img} alt="" />
										</div>
										<div className="technology__title">
											<div className="technology__icon-container">
												{/* <LightbulbIcon size={24} /> */}
												<img
													src={technology.icon}
													width={24}
													height={24}
													alt=""
												/>
											</div>
											<h3>{technology.title}</h3>
										</div>
									</div>
								</SwiperSlide>
							);
						})}
					</Swiper>
				</div>
			</section>
		</main>
	);
}
