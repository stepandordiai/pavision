"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/products";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslations } from "next-intl";
import "./styles.scss";

interface Product {
	id: number;
	img: string;
	name: string;
	category: string;
	technology: string;
	brand: string;
}

type TechnologyProductsProps = {
	category: string;
};

const RelatedProducts = ({ category }: TechnologyProductsProps) => {
	const t = useTranslations();

	const [products, setProducts] = useState<Product[]>([]);

	// TODO: learn this
	useEffect(() => {
		getProducts().then(({ data }) => setProducts(data ?? []));
	}, []);

	return (
		<section style={{ background: "#333" }}>
			<div className="technology-products-container">
				<span
					style={{
						background: "#000",
						padding: "10px",
						borderRadius: "10px",
					}}
				>
					{category}
				</span>
				<h2 className="related-products__heading">
					{t("products.relatedProducts")}
				</h2>
			</div>
			<Swiper
				breakpoints={{
					0: {
						slidesPerView: 1, // mobile
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
					.filter((p) => p.category === category)
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

export default RelatedProducts;
