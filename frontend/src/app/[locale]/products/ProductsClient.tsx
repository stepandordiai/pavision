"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/products";
import ProductCard from "@/components/ProductCard/ProductCard";
import classNames from "classnames";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";

interface Product {
	id: number;
	img: string;
	name: string;
	category: string;
	technology: string;
	brand: string;
}

const initFilter = {
	brand: "",
	category: "",
};

export default function ProductsClient() {
	const [products, setProducts] = useState<Product[]>([]);
	const [filterVisible, setFilterVisible] = useState(false);
	const [filter, setFilter] = useState(initFilter);

	useEffect(() => {
		getProducts().then(({ data }) => setProducts(data ?? []));
	}, []);

	const uniqueTechnologies = [
		...new Set(products.map((product) => product.technology)),
	];

	const uniqueBrands = [...new Set(products.map((product) => product.brand))];

	const uniqueTypes = [...new Set(products.map((p) => p.category))];

	const [activeTechnology, setActiveTechnology] = useState<string | null>(
		uniqueTechnologies[0],
	);

	useEffect(() => {
		if (products.length > 0) {
			setActiveTechnology(uniqueTechnologies[0]);
		}
	}, [products]);

	// const filteredProducts = products.filter(
	// 	(product) => !filter || product.brand === filter,
	// );

	const filteredProducts = products.filter((product) => {
		const filteredBrand = !filter.brand || product.brand === filter.brand;
		const filteredCategory =
			!filter.category || product.category === filter.category;

		return filteredBrand && filteredCategory;
	});

	const handleFilter = (name: string, value: string) => {
		setFilter((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<>
			<div
				style={{
					background: "var(--secondary-clr)",
					padding: "10px",
					borderRadius: "10px",
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<p>Bundles</p>
				<div className="products-grid">
					{products
						.filter((p) => p.category === "Bundles")
						// .filter((product) => product.type.includes(type))
						.map((product, i) => {
							return <ProductCard key={i} product={product} />;
						})}
				</div>
			</div>
			<div
				style={{
					background: "var(--primary-clr)",
					padding: "10px",
					borderRadius: "10px",
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<p>Program modules</p>
				<div className="products-grid">
					{products
						.filter((p) => p.category === "Program modules")
						// .filter((product) => product.type.includes(type))
						.map((product, i) => {
							return <ProductCard key={i} product={product} />;
						})}
				</div>
			</div>
			<div
				className={classNames("products__filter", {
					"products__filter--visible": filterVisible,
				})}
			>
				<div
					onClick={() => setFilterVisible((prev) => !prev)}
					className="filter__header"
				>
					<p style={{ fontSize: "18px", fontWeight: "500" }}>Filter</p>
					<span
						className={`filter__icon ${filterVisible ? "filter__icon--active" : ""}`}
					>
						<ChevronDownIcon size={18} />
					</span>
				</div>

				<div
					className={classNames("products__filter-inner-parent", {
						"products__filter-inner-parent--visible": filterVisible,
					})}
				>
					<div className="products__filter-inner-child">
						<div style={{ display: "flex", flexDirection: "column" }}>
							<label htmlFor="">Brand</label>
							<div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
								<button
									className="products__filter-btn"
									onClick={() => handleFilter("brand", "")}
									disabled={"" === filter.brand}
								>
									All
								</button>
								{uniqueBrands.map((brand) => {
									return (
										<button
											key={brand}
											className="products__filter-btn"
											onClick={() => handleFilter("brand", brand)}
											disabled={brand === filter.brand}
										>
											{brand}
										</button>
									);
								})}
							</div>
							{/* <select
						name=""
						id=""
						value={filter.brand}
						onChange={(e) => handleFilter("brand", e.target.value)}
					>
						<option value="">All</option>
					
					</select> */}
						</div>
						<div style={{ display: "flex", flexDirection: "column" }}>
							<label htmlFor="">Category</label>
							<div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
								<button
									className="products__filter-btn"
									onClick={() => handleFilter("category", "")}
									disabled={"" === filter.category}
								>
									All
								</button>
								{uniqueTypes.map((c) => {
									return (
										<button
											key={c}
											className="products__filter-btn"
											onClick={() => handleFilter("category", c)}
											disabled={c === filter.category}
										>
											{c}
										</button>
									);
								})}
							</div>
						</div>
						<div className="filter__btn-container">
							<button
								className="filter__reset-btn"
								onClick={() => setFilter(initFilter)}
							>
								Reset filters
							</button>
							<button
								className="filter__close-btn"
								onClick={() => setFilterVisible(false)}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* <button
				onClick={() => setActiveTechnology("Bundle/kit")}
				className="bundle-btn"
			>
				<img src="/bundle.png" alt="" />
				<span>Bundle/kit</span>
			</button> */}
			{/* <div className="btn-container">
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
			</div> */}
			{/* {uniqueTypes.map((type, i) => {
				return (
					<div key={i}>
						<p style={{ marginBottom: 20 }}>{type}</p> */}
			{!filteredProducts.length ? (
				<p>Žádné produkty neodpovídají zvoleným filtrům.</p>
			) : (
				<>
					<p>All products</p>
					<div className="products-grid">
						{filteredProducts
							// .filter((product) => product.type.includes(type))
							.map((product, i) => {
								return <ProductCard key={i} product={product} />;
							})}
					</div>
				</>
			)}

			{/* </div> */}
			{/* ); */}
			{/* })} */}
		</>
	);
}
