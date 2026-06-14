"use client";

import { useEffect, useState } from "react";
import ArrowRightUpIcon from "@/components/icons/ArrowRightUpIcon";
import { getProducts } from "@/lib/api/products";
import Breadcrumbs from "@/components/common/Breadcrumbs/Breadcrumbs";
import { TransitionLink } from "@/components/TransitionLink";

interface Product {
	id: number;
	img: string;
	name: string;
	type: string;
	technology: string;
	brand: string;
}

export default function ProductsClient() {
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
			<Breadcrumbs currentPage="Produkty" />
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
										return (
											<TransitionLink
												href={`/products/${product.id}`}
												key={i}
												className="product-container"
											>
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
											</TransitionLink>
										);
									})}
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
}
