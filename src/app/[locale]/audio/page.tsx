"use client";

import HeroParallax from "@/components/HeroParallax/HeroParallax";
import CrestronApp from "@/components/CrestronApp/CrestronApp";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.scss";
import products from "@/data/products.json";
import ArrowRightUpIcon from "@/components/icons/ArrowRightUpIcon";

// export async function generateMetadata({
// 	params,
// }: {
// 	params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
// 	const { locale } = await params;
// 	const t = await getTranslations({ locale, namespace: "audio.meta" });
// 	const page = "/audio";
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

export default function Audio() {
	return (
		<main>
			<HeroParallax
				heading="Audio"
				subheading="Technology"
				imgSrc="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/audio-products-speakers-image.jpg"
			/>
			<section className="section">
				<h2 className="section__title">Soothing sounds</h2>
				<div className="audio-section-container">
					<p>
						With a Crestron audio system, every room of your home can be filled
						with the sounds of nature. This can help reduce anxiety, blood
						pressure, and pain, as well as improve focus and promote restorative
						sleep.
					</p>
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-audio-hero.jpg"
						alt=""
					/>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					Listen passively or take control of your musical experience.
				</h2>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(1, 1fr)",
						gap: 40,
					}}
				>
					<img
						style={{
							borderRadius: 10,
						}}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-audio-sonos.jpg"
						alt=""
					/>
					<p>
						If you have Sonos® devices, you can access and control your system
						within Crestron Home. For power-users, the full Sonos S2 app can run
						natively on our touch screens.
					</p>
				</div>
			</section>
			<section style={{ minHeight: "100svh", background: "#333", padding: 20 }}>
				<div className="technology__title">
					<div className="technology__icon-container">
						<img src="/audio.png" width={24} height={24} alt="" />
					</div>
					<p>Audio</p>
				</div>
				<p style={{ fontSize: "2rem" }}>Products</p>
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
						.filter((p) => p.technology === "Audio")
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
