import { useEffect, useRef, useState } from "react";
import PencilIcon from "../../components/icons/PencilIcon";
import { supabase } from "../../lib/supabase";
import TrashIcon from "../../components/icons/TrashIcon";
import DotsIcon from "../../components/icons/DotsIcon";
import "./styles.scss";

const EMPTY_FORM = {
	img: "",
	name: "",
	type: [] as string[],
	technology: "",
	brand: "",
};

interface Product {
	id: string;
	img: string;
	name: string;
	is_active: boolean;
	created_at: string;
	type: string[];
	technology: string;
	brand: string;
}

interface ProductSave {
	img: string;
	name: string;
	type: string[];
	technology: string;
	brand: string;
}

type ProductsProps = {
	products: Product[];
	setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
	load: () => Promise<void>;
};

export default function Products({
	products,
	setProducts,
	load,
}: ProductsProps) {
	const [visibleLength, setVisibleLength] = useState(10);
	const [bannerVisible, setBannerVisible] = useState(false);
	// const [loading, setLoading] = useState(false);
	const [productEditable, setProductEditable] = useState(false);
	const [productId, setProductId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState(EMPTY_FORM);

	console.log(error);

	// TODO: LEARN THIS
	// Supabase
	const insertOne = async (data: ProductSave) => {
		setError(null);

		const { error } = await supabase.from("products").insert([data]);
		if (error) {
			if (error.code === "23505") setError("Продукт з таким ID вже існує");
			else console.error("Insert error:", error.message);
			return false;
		}
		await load();
		setBannerVisible(false);
		setFormData(EMPTY_FORM);
		return true;
	};

	const deleteOne = async (id: string) => {
		const { error } = await supabase.from("products").delete().eq("id", id);
		if (error) console.error("Delete error:", error.message);
		else load();
	};

	const updateOne = async (id: string, data: Partial<ProductSave>) => {
		setError(null);

		const { error } = await supabase.from("products").update(data).eq("id", id);
		if (error) {
			if (error.code === "23505") setError("Вакансія з таким ID вже існує");
			else console.error("Insert error:", error.message);
			return false;
		}
		await load();
		setBannerVisible(false);
		setFormData(EMPTY_FORM);
		setProductEditable(false);
		setProductId(null);
		return true;
	};

	const toggleActive = async (id: string, value: boolean) =>
		supabase.from("products").update({ is_active: value }).eq("id", id);

	const handleToggle = async (id: string, current: boolean) => {
		await toggleActive(id, !current);
		setProducts((prev) =>
			prev.map((v) => (v.id === id ? { ...v, is_active: !current } : v)),
		);
	};

	const handleFormData = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (productEditable && productId) {
			updateOne(productId, formData);
		} else {
			insertOne(formData);
		}
	};

	const [typeInput, setTypeInput] = useState("");

	const uniqueProductTypes = [...new Set(products.flatMap((p) => p.type))];

	const addType = (value: string) => {
		if (!value || formData.type.includes(value)) return;
		setFormData((prev) => ({ ...prev, type: [...prev.type, value] }));
		setTypeInput("");
	};
	const removeType = (value: string) => {
		setFormData((prev) => ({
			...prev,
			type: prev.type.filter((t) => t !== value),
		}));
	};

	const availableTypes = uniqueProductTypes.filter(
		(t) => !formData.type.includes(t),
	);

	const [detailsVisible, setDetailsVisible] = useState<string | null>(null);

	const handleProductDetails = (id: string) => {
		setDetailsVisible((prev) => (prev === id ? null : id));
	};

	const detailsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const clickedOutsideAll = detailsRef.current.every(
				(ref) => ref && !ref.contains(e.target as Node),
			);
			if (clickedOutsideAll) {
				setDetailsVisible(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const [filter, setFilter] = useState("");

	// TODO: learn this
	const filteredLeads = products.filter((p) =>
		Object.values(p).some((value) =>
			String(value).toLowerCase().includes(filter.toLowerCase()),
		),
	);

	return (
		<>
			<div
				className={`banner ${bannerVisible || productEditable ? "banner--visible" : ""}`}
			>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<p>{productEditable ? "Edit product" : "Add new product"}</p>
					<button
						className="close-btn"
						onClick={() => {
							setProductEditable(false);
							setProductId(null);
							setBannerVisible(false);
						}}
					>
						Close
					</button>
				</div>
				<form className="form" onSubmit={handleForm}>
					<div>
						<label htmlFor="">Image</label>
						<input
							className="input"
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.img}
							name="img"
							type="text"
							placeholder="Enter image url address"
						/>
					</div>
					<div>
						<label htmlFor="">Name</label>
						<input
							className="input"
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.name}
							name="name"
							type="text"
							placeholder="Enter product name"
						/>
					</div>
					<div>
						<label htmlFor="">Type</label>
						<input
							className="input"
							onChange={(e) => setTypeInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addType(typeInput);
								}
							}}
							value={typeInput}
							type="text"
							placeholder="Enter new product type or choose existing"
						/>
						<div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
							{formData.type.map((t) => (
								<span
									key={t}
									style={{
										background: "#e8e8e8",
										padding: "5px",
										borderRadius: "5px",
									}}
								>
									{t}
									<button onClick={() => removeType(t)}>×</button>
								</span>
							))}
						</div>
						<select
							className="input"
							onChange={(e) => addType(e.target.value)}
							value=""
						>
							<option value="">Add</option>
							{availableTypes.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>
					</div>
					<div>
						<label htmlFor="">Technology</label>
						<input
							className="input"
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.technology}
							name="technology"
							type="text"
							placeholder="Enter product technology"
						/>
					</div>
					<div>
						<label htmlFor="">Brand</label>
						<input
							className="input"
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.brand}
							name="brand"
							type="text"
							placeholder="Enter product brand"
						/>
					</div>
					<button className="form__submit-btn" type="submit">
						{productEditable ? "Update" : "Create"}
					</button>
				</form>
			</div>
			<div
				className={`curtain ${bannerVisible || productEditable ? "curtain--active" : ""}`}
			></div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginBottom: "10px",
					}}
				>
					<input
						onChange={(e) => setFilter(e.target.value)}
						className="search-input"
						type="text"
						placeholder="Search..."
					/>
					<button
						className="create-btn"
						onClick={() => {
							setBannerVisible(true);
						}}
					>
						+ Add product
					</button>
				</div>
			</div>

			<table className="table">
				<thead>
					<tr>
						<th>№</th>
						<th>Image</th>
						<th>Name</th>
						<th className="hide">Type</th>
						<th className="hide">Technology</th>
						<th className="hide">Brand</th>
						<th>Status</th>
						<th style={{ width: "1%", whiteSpace: "nowrap" }}>Details</th>
					</tr>
				</thead>
				<tbody>
					{[...filteredLeads]
						.reverse()
						.slice(0, visibleLength)
						.map((product, i) => {
							return (
								<tr key={product.id}>
									<td>{i + 1}</td>
									<td style={{ width: "1%" }}>
										<img src={product.img} width={40} alt="" />
									</td>
									<td style={{ width: "100%", whiteSpace: "wrap" }}>
										{product.name}
									</td>
									<td className="hide">
										{/* {productEditable && productId === product.id ? (
												<>
													<input
														className="input"
														onChange={(e) => setTypeInput(e.target.value)}
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																addType(typeInput);
															}
														}}
														value={typeInput}
														type="text"
														placeholder="New type..."
													/>
													<div>
														{type.map((t) => (
															<span key={t}>
																{t}
																<button onClick={() => removeType(t)}>×</button>
															</span>
														))}
													</div>
													<select
														className="input"
														onChange={(e) => addType(e.target.value)}
														value=""
													>
														<option value="">Add</option>
														{availableTypes.map((t) => (
															<option key={t} value={t}>
																{t}
															</option>
														))}
													</select>
												</>
											) : ( */}
										<span>{product.type.join(", ")}</span>
										{/* )} */}
									</td>
									<td className="hide">
										<span>{product.technology}</span>
									</td>
									<td className="hide">
										<span>{product.brand}</span>
									</td>
									<td>
										<button
											onClick={() =>
												handleToggle(product.id, product.is_active)
											}
											style={
												product.is_active
													? {
															color: "rgb(110, 150, 0)",
															background: "rgb(218, 249, 159)",
															padding: "5px",
															borderRadius: "5px",
														}
													: {
															color: "rgb(255, 75, 75)",
															background: "rgb(255, 221, 214)",
															padding: "5px",
															borderRadius: "5px",
														}
											}
										>
											{product.is_active ? "Active" : "Inactive"}
										</button>
									</td>
									<td
										style={{
											width: "1%",
											whiteSpace: "nowrap",
										}}
									>
										<div
											ref={(el) => {
												detailsRef.current[i] = el;
											}}
											className="details-dd"
										>
											<button
												onClick={() => handleProductDetails(product.id)}
												style={{
													background: "rgba(0,0,0, 0.1)",
													padding: "5px",
													borderRadius: "5px",
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													justifySelf: "flex-end",
												}}
											>
												<DotsIcon />
											</button>
											<div
												className={`details-dd-inner ${detailsVisible === product.id ? "details-dd-inner--visible" : ""}`}
											>
												<button
													className="edit-btn"
													onClick={() => {
														setBannerVisible(true);
														setFormData(product);
														setProductEditable(true);
														setProductId(product.id);
														setDetailsVisible(null);
													}}
												>
													<span>
														<PencilIcon />
													</span>
													<span>Edit</span>
												</button>
												<button
													className="delete-btn"
													onClick={() => {
														deleteOne(product.id);
														setDetailsVisible(null);
													}}
												>
													<span>
														<TrashIcon />
													</span>
													<span>Delete</span>
												</button>
											</div>
										</div>
									</td>
									{/* <td>{product.created_at?.split("T")[0]}</td> */}
									{/* <td>
									
									</td> */}
									{/* <td> */}

									{/* {loading && productId === product.id ? (
												<SpinLoading />
											) : (
												)} */}
									{/* </td> */}
								</tr>
							);
						})}
				</tbody>
			</table>
			<div style={{ marginTop: "auto", paddingTop: "10px" }}>
				<p>
					Products per page{" "}
					<select
						style={{
							border: "2px solid hsl(0, 0%, 90%)",
							padding: "5px",
							borderRadius: "5px",
						}}
						onChange={(e) => setVisibleLength(Number(e.target.value))}
						value={visibleLength}
						name=""
						id=""
					>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>{" "}
					1-
					<span>
						{products.length
							? products.length < visibleLength
								? products.length
								: visibleLength
							: "Loading..."}
					</span>{" "}
					of {products.length ? products.length : "Loading..."}
				</p>
				{/* <div>
				<span>1</span> <span>2</span> <span>3</span> <span>...</span>{" "}
				<span>{products.length < 100 ? visibleLength : 100}</span>
			</div> */}
			</div>
			{/* <Footer
				visibleLength={visibleLength}
				setVisibleLength={setVisibleLength}
				products.length={products.length}
			/> */}
		</>
	);
}
