"use client";

import ArrowRightUpIcon from "@/components/icons/ArrowRightUpIcon";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.scss";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/products";

type TechnologyProductsProps = {
	technology: string;
};

const TechnologyProducts = ({ technology }: TechnologyProductsProps) => {
	interface Product {
		id: number;
		img: string;
		name: string;
		type: string;
		technology: string;
		brand: string;
	}

	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		getProducts().then(setProducts);
	}, []);

	return (
		<section style={{ minHeight: "100svh", background: "#333", padding: 20 }}>
			<div className="technology__title">
				<div className="technology__icon-container">
					<img src="/audio.png" width={24} height={24} alt="" />
				</div>
				<p>{technology}</p>
			</div>
			<p style={{ fontSize: "2rem" }}>Products</p>
			<Swiper
				breakpoints={{
					0: {
						slidesPerView: 1.5, // mobile
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
					.filter((p) => p.technology === technology)
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
};

export default TechnologyProducts;
