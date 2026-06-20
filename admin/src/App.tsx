import Sidebar from "./components/layout/Sidebar/Sidebar";
import Clients from "./pages/Clients/Clients";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Header from "./components/layout/Header/Header";
import type { Product } from "./interfaces/product";
import type { Client } from "./interfaces/client";
import Login from "./pages/Login/Login";
import Bookings from "./pages/Bookings/Bookings";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import "./styles/App.scss";

function App() {
	const [products, setProducts] = useState<Product[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
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

	const loadProducts = async () => {
		const { data } = await supabase.from("products").select("*");
		setProducts(data ?? []);
	};
	const loadClients = async () => {
		const { data } = await supabase.from("clients").select("*");
		setClients(data ?? []);
	};

	useEffect(() => {
		if (session) {
			loadProducts();
			loadClients();
		}
	}, [session]);

	// TODO: learn this
	if (authLoading) return null;

	return (
		<Router>
			<Routes>
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route
					path="/login"
					element={!session ? <Login /> : <Navigate to="/" replace />}
				/>
				<Route
					path="/*"
					element={
						!session ? (
							<Navigate to="/login" replace />
						) : (
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
										<Route path="/bookings" element={<Bookings />} />
									</Routes>

									{/* <Footer /> */}
								</main>
							</div>
						)
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
