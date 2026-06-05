import Sidebar from "./components/layout/Sidebar/Sidebar";
import Clients from "./pages/Clients/Clients";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Header from "./components/layout/Header/Header";
import type { Product } from "./interfaces/product";
import Login from "./pages/Login/Login";
import "./styles/App.scss";

function App() {
	const [products, setProducts] = useState<Product[]>([]);
	const [session, setSession] = useState<Session | null>(null);
	const [authLoading, setAuthLoading] = useState(true);

	// TODO: LEARN THIS
	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setAuthLoading(false);
		});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
			},
		);

		return () => listener.subscription.unsubscribe();
	}, []);

	const getAll = async () => supabase.from("products").select("*");
	// .order("created_at", { ascending: false });

	const load = async () => {
		const { data } = await getAll();
		setProducts(data ?? []);
	};

	useEffect(() => {
		if (session) load();
	}, [session]);

	// TODO: learn this
	if (authLoading) return null; // or a spinner
	if (!session) return <Login />;

	return (
		<Router>
			<div className="layout">
				<Sidebar />
				<main className="main">
					<Header />
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
