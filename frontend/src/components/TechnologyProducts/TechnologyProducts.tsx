"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/products";
import technologies from "@/data/technologies.json";
import "./styles.scss";
import ProductCard from "../ProductCard/ProductCard";

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
						<p>{technology}</p>
					</div>
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
								<ProductCard key={i} product={product} />
							</SwiperSlide>
						);
					})}
			</Swiper>
		</section>
	);
};

export default TechnologyProducts;
