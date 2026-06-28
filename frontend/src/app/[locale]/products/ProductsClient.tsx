"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/products";
import Breadcrumbs from "@/components/common/Breadcrumbs/Breadcrumbs";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useTranslations } from "next-intl";

interface Product {
	id: number;
	img: string;
	name: string;
	type: string;
	technology: string;
	brand: string;
}

export default function ProductsClient() {
	const t = useTranslations();

	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		getProducts().then(({ data }) => setProducts(data ?? []));
	}, []);

	const uniqueTechnologies = [
		...new Set(products.map((product) => product.technology)),
	];

	const [activeTechnology, setActiveTechnology] = useState<string | null>(
		uniqueTechnologies[0],
	);

	useEffect(() => {
		if (products.length > 0) {
			setActiveTechnology(uniqueTechnologies[0]);
		}
	}, [products]);

	const filteredProducts = products.filter(
		(product) => product.technology === activeTechnology,
	);

	const uniqueTypes = [...new Set(filteredProducts.flatMap((p) => p.type))];

	return (
		<main className="products">
			<Breadcrumbs links={[{ label: t("nav.products") }]} />
			<div className="products-inner">
				<h1 className="main__title">Produkty</h1>
				<button
					onClick={() => setActiveTechnology("Bundle/kit")}
					className="bundle-btn"
				>
					<img src="/bundle.png" alt="" />
					<span>Bundle/kit</span>
				</button>
				<div className="btn-container">
					{uniqueTechnologies.map((technology, i) => {
						return (
							<button
								key={i}
								onClick={() => setActiveTechnology(technology)}
								className={`btn ${technology === activeTechnology ? "btn--active" : ""}`}
							>
								{technology}
							</button>
						);
					})}
				</div>
				{uniqueTypes.map((type, i) => {
					return (
						<div key={i}>
							<p style={{ marginBottom: 20 }}>{type}</p>
							<div className="products-grid">
								{filteredProducts
									.filter((product) => product.type.includes(type))
									.map((product, i) => {
										return <ProductCard key={i} product={product} />;
									})}
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
}
