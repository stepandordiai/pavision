import "./styles/App.scss";
import Footer from "./components/layout/Footer/Footer";
import Header from "./components/layout/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import TrashIcon from "./components/icons/TrashIcon";
import PencilIcon from "./components/icons/PencilIcon";
import CheckIcon from "./components/icons/CheckIcon";
import SpinLoading from "./components/SpinLoading/SpinLoading";
import SwitchBtn from "./components/SwitchBtn/SwitchBtn";

// const products = [
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// 	{
// 		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-keypads-1b.png",
// 		name: "Loxone",
// 		createdAt: new Date(),
// 		isActive: true,
// 	},
// ];

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

	const [products, setProducts] = useState<Product[]>([]);
	const [formData, setFormData] = useState({
		img: "",
		name: "",
		type: [] as string[],
		technology: "",
		brand: "",
	});
	const [img, setImg] = useState("");
	const [name, setName] = useState("");
	const [type, setType] = useState<string[]>([]);
	const [technology, setTechnology] = useState("");
	const [brand, setBrand] = useState("");
	const [isActive, setIsActive] = useState<boolean | null>(null);
	// const [isActive, setIsActive] = useState(false);

	const toggleIsActive = () => {
		setIsActive((prev) => !prev);
	};

	const handleFormData = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const createTodo = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name) {
			return;
		}

		try {
			const res = await axios.post(
				// FIXME:
				"https://pavision-backend.onrender.com/products",
				{
					...formData,
					type,
				},
			);

			setProducts((prev) => [...prev, res.data]);
			setBannerVisible(false);

			setFormData({
				img: "",
				name: "",
				type: [],
				technology: "",
				brand: "",
			});
			setType([]);
		} catch (err) {
		} finally {
		}
	};

	const handleEditTodo = (id: number) => {
		setProductEditable(true);
		setProductId(id);

		const product = products.find((product) => product.id === id);

		if (!product) return;

		setImg(product.img);
		setName(product.name);
		setType(product.type);
		setTechnology(product.technology);
		setBrand(product.brand);
		setIsActive(product.is_active);
	};

	const editTodo = async (id: number) => {
		try {
			const res = await axios.put(
				`https://pavision-backend.onrender.com/products/${id}`,
				{
					img,
					name,
					type,
					technology,
					brand,
					isActive,
				},
			);

			setProducts((prev) =>
				prev.map((todo) => (todo.id === id ? res.data : todo)),
			);
			setProductEditable(false);
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

	useEffect(() => {
		const getProducts = async () => {
			try {
				const res = await axios.get(
					"https://pavision-backend.onrender.com/products",
				);
				setProducts(res.data);
			} catch (error) {
			} finally {
			}
		};
		getProducts();
	}, []);

	const [typeInput, setTypeInput] = useState("");

	const uniqueProductTypes = [...new Set(products.flatMap((p) => p.type))];

	const addType = (value: string) => {
		if (!value || type.includes(value)) return;
		setType((prev) => [...prev, value]);
		setTypeInput("");
	};

	const removeType = (value: string) => {
		setType((prev) => prev.filter((t) => t !== value));
	};

	// filtered options — exclude already selected
	const availableTypes = uniqueProductTypes.filter((t) => !type.includes(t));

	return (
		<>
			<div className={`banner ${bannerVisible ? "banner--visible" : ""}`}>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<p>Add new product</p>
					<button className="close-btn" onClick={() => setBannerVisible(false)}>
						Close
					</button>
				</div>
				<form className="form" onSubmit={createTodo}>
					<div>
						<label htmlFor="">Image</label>
						<input
							className="input"
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.img}
							name="img"
							type="text"
							placeholder="image"
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
						<select onChange={(e) => addType(e.target.value)} value="">
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
						/>
					</div>
					<button className="form__submit-btn" type="submit">
						Create
					</button>
				</form>
			</div>
			<div
				className={`curtain ${bannerVisible ? "curtain--active" : ""}`}
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
							<th>Type</th>
							<th>Technology</th>
							<th>Brand</th>
							<th>isActive</th>
							<th>Created At</th>
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
											{productEditable && productId === product.id ? (
												<input
													type="text"
													onChange={(e) => setImg(e.target.value)}
													value={img}
												/>
											) : (
												<img src={product.img} width={40} alt="" />
											)}
										</td>
										<td style={{ width: "99%" }}>
											{productEditable && productId === product.id ? (
												<input
													type="text"
													onChange={(e) => setName(e.target.value)}
													value={name}
												/>
											) : (
												<span>{product.name}</span>
											)}
										</td>
										<td>
											{productEditable && productId === product.id ? (
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
											) : (
												<span>{product.type.join(", ")}</span>
											)}
										</td>
										<td>
											{productEditable && productId === product.id ? (
												<input
													type="text"
													onChange={(e) => setTechnology(e.target.value)}
													value={technology}
												/>
											) : (
												<span>{product.technology}</span>
											)}
										</td>
										<td>
											{productEditable && productId === product.id ? (
												<input
													type="text"
													onChange={(e) => setBrand(e.target.value)}
													value={brand}
												/>
											) : (
												<span>{product.brand}</span>
											)}
										</td>
										<td>
											<SwitchBtn
												toggleIsActive={() => toggleIsActive()}
												isActive={
													productId === product.id
														? isActive
														: product.is_active
												}
												disabled={!productEditable || productId !== product.id}
											/>
										</td>
										<td>{product.created_at?.split("T")[0]}</td>
										<td>
											{productEditable && productId === product.id ? (
												<button
													className="save-btn"
													onClick={() => editTodo(product.id)}
												>
													<CheckIcon />
												</button>
											) : (
												<button
													className="edit-btn"
													onClick={() => handleEditTodo(product.id)}
												>
													<PencilIcon />
												</button>
											)}
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
