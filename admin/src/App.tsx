import "./styles/App.scss";
import Footer from "./components/layout/Footer/Footer";
import Header from "./components/layout/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import TrashIcon from "./components/icons/TrashIcon";
import PencilIcon from "./components/icons/PencilIcon";
import SpinLoading from "./components/SpinLoading/SpinLoading";
import SwitchBtn from "./components/SwitchBtn/SwitchBtn";
import { supabase } from "./lib/supabase";

function App() {
	const [visibleLength, setVisibleLength] = useState(10);
	const [bannerVisible, setBannerVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [productEditable, setProductEditable] = useState(false);
	const [productId, setProductId] = useState<number | null>(null);

	interface Product {
		id: number;
		img: string;
		name: string;
		is_active: boolean;
		created_at: string;
		type: string[];
		technology: string;
		brand: string;
	}

	// TODO: LEARN THIS
	// Supabase
	const getAll = async () => supabase.from("products").select("*");
	// .order("created_at", { ascending: false });

	const load = async () => {
		const { data } = await getAll();
		setProducts(data ?? []);
	};

	useEffect(() => {
		load();
	}, []);

	const [products, setProducts] = useState<Product[]>([]);
	const [formData, setFormData] = useState({
		img: "",
		name: "",
		type: [] as string[],
		technology: "",
		brand: "",
		isActive: true,
	});
	const toggleIsActive = () => {
		setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
	};

	const handleFormData = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleForm = (e: React.FormEvent) => {
		e.preventDefault();

		if (productEditable && productId) {
			editTodo(productId);
		} else {
			createTodo();
		}
	};

	const createTodo = async () => {
		if (!formData.name) {
			return;
		}

		try {
			const res = await axios.post(
				"https://pavision-backend.onrender.com/products",
				formData,
			);

			setProducts((prev) => [...prev, res.data]);
			setBannerVisible(false);

			setFormData({
				img: "",
				name: "",
				type: [],
				technology: "",
				brand: "",
				isActive: true,
			});
		} catch (err) {
		} finally {
		}
	};

	const handleEditTodo = (product: Product) => {
		setProductEditable(true);
		setProductId(product.id);

		setFormData({
			img: product.img,
			name: product.name,
			type: product.type,
			technology: product.technology,
			brand: product.brand,
			isActive: product.is_active,
		});
	};

	const editTodo = async (id: number) => {
		try {
			const res = await axios.put(
				`https://pavision-backend.onrender.com/products/${id}`,
				formData,
			);

			setProducts((prev) =>
				prev.map((todo) => (todo.id === id ? res.data : todo)),
			);
			setProductEditable(false);
			setProductId(null);
		} catch (error) {
		} finally {
		}
	};

	const deleteTodo = async (id: number) => {
		setProductId(id);
		setLoading(true);
		try {
			await axios.delete(
				`https://pavision-backend.onrender.com/products/${id}`,
			);

			setProducts((prev) => prev.filter((todo) => todo.id !== id));
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	// useEffect(() => {
	// 	const getProducts = async () => {
	// 		try {
	// 			const res = await axios.get(
	// 				"https://pavision-backend.onrender.com/products",
	// 			);
	// 			setProducts(res.data);
	// 		} catch (error) {
	// 		} finally {
	// 		}
	// 	};
	// 	getProducts();
	// }, []);

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

	// filtered options — exclude already selected
	const availableTypes = uniqueProductTypes.filter(
		(t) => !formData.type.includes(t),
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
					<div>
						<label htmlFor="">Status</label>
						<SwitchBtn
							toggleIsActive={() => toggleIsActive()}
							isActive={formData.isActive}
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
			<Header
				productsLength={products.length}
				setBannerVisible={setBannerVisible}
			/>
			<main className="main">
				<table className="table">
					<thead>
						<tr>
							<th>#</th>
							<th>Image</th>
							<th>Name</th>
							<th className="hide">Type</th>
							<th className="hide">Technology</th>
							<th className="hide">Brand</th>
							<th>
								<span>Status </span>
								<span
									style={{
										padding: "5px",
										background: "#000",
										color: "#fff",
									}}
									title="Active products can be visible on the website, other products will act like archived"
								>
									i
								</span>
							</th>
							{/* <th>Created At</th> */}
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{[...products]
							.reverse()
							.slice(0, visibleLength)
							.map((product, i) => {
								return (
									<tr key={product.id}>
										<td>{i + 1}</td>
										<td style={{ width: "1%" }}>
											<img src={product.img} width={40} alt="" />
										</td>
										<td style={{ width: "99%" }}>
											<span>{product.name}</span>
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
											{product.is_active ? (
												<span
													style={{
														color: "rgb(110, 150, 0)",
														background: "rgb(218, 249, 159)",
														padding: "5px",
														borderRadius: "5px",
													}}
												>
													Active
												</span>
											) : (
												<span
													style={{
														color: "rgb(255, 75, 75)",
														background: "rgb(255, 221, 214)",
														padding: "5px",
														borderRadius: "5px",
													}}
												>
													Inactive
												</span>
											)}
										</td>
										{/* <td>{product.created_at?.split("T")[0]}</td> */}
										<td>
											<button
												className="edit-btn"
												onClick={() => handleEditTodo(product)}
											>
												<PencilIcon />
											</button>
										</td>
										<td>
											<button
												className="delete-btn"
												onClick={() => deleteTodo(product.id)}
											>
												{loading && productId === product.id ? (
													<SpinLoading />
												) : (
													<TrashIcon />
												)}
											</button>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</main>
			<Footer
				visibleLength={visibleLength}
				setVisibleLength={setVisibleLength}
				productsLength={products.length}
			/>
		</>
	);
}

export default App;
