import Sidebar from "./components/layout/Sidebar/Sidebar";
import Clients from "./pages/Clients/Clients";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";
import "./styles/App.scss";

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

function App() {
	const [products, setProducts] = useState<Product[]>([]);

	const getAll = async () => supabase.from("products").select("*");
	// .order("created_at", { ascending: false });

	const load = async () => {
		const { data } = await getAll();
		setProducts(data ?? []);
	};

	useEffect(() => {
		load();
	}, []);

	return (
		<Router>
			<div className="layout">
				<Sidebar />
				<main className="main">
					{/* <Header /> */}
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							path="/products"
							element={
								<Products
									products={products}
									setProducts={setProducts}
									load={load}
								/>
							}
						/>
						<Route path="/clients" element={<Clients />} />
					</Routes>
					{/* <Footer /> */}
				</main>
			</div>
		</Router>
	);
}

export default App;
