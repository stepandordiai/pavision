"use client";

import products from "@/data/products.json";
import ArrowRightUpIcon from "@/components/icons/ArrowRightUpIcon";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

export default function AudioClient() {
	return (
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
	);
}
