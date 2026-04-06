"use client";

import { useState } from "react";
import ArrowRightUpIcon from "@/components/icons/ArrowRightUpIcon";
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
	{
		name: "Horizon ®",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-horizon-edition3.png",
		type: "Keypads, Dimmers, Switches",
		technology: "Shades",
	},
	{
		name: "Cameo ®",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-cameo-edition3.png",
		type: "Keypads, Dimmers, Switches",
		technology: "Shades",
	},
	{
		name: "7” Tabletop",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-7-tabletop2.png",
		type: "Touch Screens",
		technology: "Shades",
	},
	{
		name: "7” Desktop with Conferencing",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-7-desktop3.png",
		type: "Touch Screens",
		technology: "Shades",
	},
	{
		name: "10” Tabletop",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-10-tabletop2.png",
		type: "Touch Screens",
		technology: "Shades",
	},
	{
		name: "5” Wall",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-5-wall2.png",
		type: "Touch Screens",
		technology: "Shades",
	},
	{
		name: "7” Wall",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-7-wall2.png",
		type: "Touch Screens",
		technology: "Shades",
	},
	{
		name: "10” Wall",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-10-wall2.png",
		type: "Touch Screens",
		technology: "Shades",
	},
	{
		name: "Roller",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-roller.jpg",
		type: "Shades",
		technology: "Shades",
	},
	{
		name: "Horizontal Sheer",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-horizontal-sheer.jpg",
		type: "Shades",
		technology: "Shades",
	},
	{
		name: "Drapery",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-drapery.jpg",
		type: "Shades",
		technology: "Shades",
	},
	{
		name: "Roman",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-roman.jpg",
		type: "Shades",
		technology: "Shades",
	},
	{
		name: "Reference",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/audio-product-speaker-reference.png",
		type: "Speakers",
		technology: "Audio",
	},
	{
		name: "Ultimate",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/audio-product-speaker-ultimate.png",
		type: "Speakers",
		technology: "Audio",
	},
	{
		name: "DM NAX™ 8-zone streaming amplifier",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/audio-product-amps-dmnax.png",
		type: "Amps",
		technology: "Audio",
	},
	{
		name: "Yale",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-home-access-locks-yale.png",
		type: "Locks",
		technology: "Home access",
	},
	{
		name: "2N",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-home-access-itercoms-2n.png",
		type: "Intercoms and door stations",
		technology: "Home access",
	},
	{
		name: "eKey",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-home-access-itercoms-ekey.png",
		type: "Intercoms and door stations",
		technology: "Home access",
	},
	{
		name: "AVLINKPRO",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/home-access-product-avlinkpro.png",
		type: "Intercoms and door stations",
		technology: "Home access",
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
