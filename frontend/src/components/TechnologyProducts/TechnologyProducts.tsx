"use client";

import ArrowRightUpIcon from "@/components/icons/ArrowRightUpIcon";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/products";
import technologies from "@/data/technologies.json";
import "./styles.scss";

type TechnologyProductsProps = {
	technology: string;
	sectionTitle?: string;
};

const TechnologyProducts = ({
	technology,
	sectionTitle = "Products",
}: TechnologyProductsProps) => {
	interface Product {
		id: number;
		img: string;
		name: string;
		type: string;
		technology: string;
		brand: string;
	}

	const [products, setProducts] = useState<Product[]>([]);

	// TODO: learn this
	useEffect(() => {
		getProducts().then(({ data }) => setProducts(data ?? []));
	}, []);

	return (
		<section style={{ background: "#333" }}>
			<div className="technology-products-container">
				<div className="technology__title">
					<div className="technology__icon-container">
						{technologies.find((t) => t.title === technology)?.icon && (
							<img
								src="/technology-icons/lighting.png"
								width={24}
								height={24}
								alt=""
							/>
						)}
					</div>
					<p>{technology}</p>
				</div>
				<h2 style={{ fontSize: "2rem" }}>{sectionTitle}</h2>
			</div>
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
				className="technology-products-swiper"
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
