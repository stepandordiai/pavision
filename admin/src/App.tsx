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
import type { Client } from "./interfaces/client";
import Login from "./pages/Login/Login";
import "./styles/App.scss";

function App() {
	const [products, setProducts] = useState<Product[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
	const [session, setSession] = useState<Session | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [isRecovery, setIsRecovery] = useState(false);

	// TODO: LEARN THIS
	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setAuthLoading(false);
		});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setSession(session);
				if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
			},
		);

		return () => listener.subscription.unsubscribe();
	}, []);

	const getProducts = async () => supabase.from("products").select("*");
	const getClients = async () => supabase.from("clients").select("*");
	// .order("created_at", { ascending: false });

	const loadProducts = async () => {
		const { data } = await getProducts();
		setProducts(data ?? []);
	};
	const loadClients = async () => {
		const { data } = await getClients();
		setClients(data ?? []);
	};

	useEffect(() => {
		if (session) {
			loadProducts();
		}
	}, [session]);

	useEffect(() => {
		if (session) {
			loadClients();
		}
	}, [session]);

	// TODO: learn this
	if (authLoading) return null; // or a spinner
	if (!session && !isRecovery) return <Login />;
	if (isRecovery)
		return <Login isRecovery onRecoveryDone={() => setIsRecovery(false)} />;

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
									loadProducts={loadProducts}
								/>
							}
						/>
						<Route
							path="/clients"
							element={
								<Clients
									clients={clients}
									setClients={setClients}
									loadClients={loadClients}
								/>
							}
						/>
					</Routes>
					{/* <Footer /> */}
				</main>
			</div>
		</Router>
	);
}

export default App;
