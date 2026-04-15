"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import products from "@/data/products.json";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import ArrowRightUpIcon from "@/components/icons/ArrowRightUpIcon";

export default function ShadesClient() {
	return (
		<Swiper
			breakpoints={{
				0: {
					slidesPerView: 1.25, // mobile
				},
				600: {
					slidesPerView: 2.25, // tablet+
				},
				900: {
					slidesPerView: 3.25, // tablet+
				},
			}}
			spaceBetween={10}
			className="mySwiper"
		>
			{products
				.filter((p) => p.technology === "Shades")
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
	);
}
