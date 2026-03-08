"use client";

import { useState } from "react";
import ArrowRightUpIcon from "@/app/icons/ArrowRightUpIcon";
import "./Products.scss";

const products = [
	{
		name: "Horizon ™",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
		type: "Klávesnice",
		technology: "Lightning",
	},
	{
		name: "Cameo ®",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-3.png",
		type: "Klávesnice",
		technology: "Lightning",
	},
	{
		name: "Vitrea",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-4.jpg",
		type: "Klávesnice",
		technology: "Lightning",
	},
	{
		name: "Rhombus",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-5.jpg",
		type: "Klávesnice",
		technology: "Lightning",
	},
	{
		name: "Black Nova",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-6.jpg",
		type: "Klávesnice",
		technology: "Lightning",
	},
	{
		name: "Tyba",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-7.jpg",
		type: "Klávesnice",
		technology: "Lightning",
	},
	{
		name: "Horizon ™",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-dimmer-1b.png",
		type: "Stmívače a vypínače",
		technology: "Lightning",
	},
	{
		name: "Cameo ®",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-dimmer-3.png",
		type: "Stmívače a vypínače",
		technology: "Lightning",
	},
	{
		name: "Horizon ™",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostat-tile.png",
		type: "Thermostats",
		technology: "Thermostats",
	},
];

const uniqueTechnologies = [
	...new Set(products.map((product) => product.technology)),
];

export default function Products() {
	const [activeTechnology, setActiveTechnology] = useState(
		uniqueTechnologies[0],
	);

	const filteredProducts = products.filter(
		(product) => product.technology === activeTechnology,
	);

	const uniqueTypes = [...new Set(filteredProducts.map((p) => p.type))];

	return (
		<main className="products">
			<h2 className="section__title">Produkty</h2>
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
								.filter((product) => product.type === type)
								.map((product, i) => {
									return (
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
									);
								})}
						</div>
					</div>
				);
			})}
		</main>
	);
}
