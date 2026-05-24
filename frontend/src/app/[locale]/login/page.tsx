"use client";

import styles from "./../../../components/Testimonials/Testimonials.module.scss";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import "./styles.scss";

export default function LoginPage() {
	const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [authError, setAuthError] = useState("");
	const [authLoading, setAuthLoading] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	const router = useRouter();

	// ── Auth ──────────────────────────────────────────────────────────────────

	const handleAuth = async () => {
		setAuthLoading(true);
		setAuthError("");

		const { error } =
			authMode === "signin"
				? await supabase.auth.signInWithPassword({ email, password })
				: await supabase.auth.signUp({
						email,
						password,
						options: { data: { full_name: name } },
					});

		if (error) {
			setAuthError(error.message);
		} else {
			router.push("/my-profile");
		}

		setAuthLoading(false);
	};

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => setUser(data.user));

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	return (
		<main
			className="main"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div className="auth-container">
				<div>
					<h3 className="auth__title">
						{authMode === "signin" ? "Sign in" : "Create account"}
					</h3>
					<p>
						{authMode === "signin"
							? "Sign in to post reviews under your name. More features coming soon!"
							: "Create a free account to post reviews under your name. More features coming soon!"}
					</p>
				</div>
				{authMode === "signup" && (
					<div className="input-container">
						<label className="auth-label" htmlFor="auth-name">
							Name
						</label>
						<input
							className="auth-input"
							id="auth-name"
							type="text"
							placeholder="Your name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							autoComplete="name"
						/>
					</div>
				)}
				<div className="input-container">
					<label className="auth-label" htmlFor="auth-email">
						Email
					</label>
					<input
						className="auth-input"
						id="auth-email"
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
					/>
				</div>
				<div className="input-container">
					<label className="auth-label" htmlFor="auth-password">
						Password
					</label>
					<input
						className="auth-input"
						id="auth-password"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete={
							authMode === "signin" ? "current-password" : "new-password"
						}
					/>
				</div>
				{authError && (
					<p className={styles.errorMsg} role="alert">
						{authError}
					</p>
				)}

				<button
					type="button"
					className={styles.btnSubmit}
					onClick={handleAuth}
					disabled={authLoading}
				>
					{authLoading
						? "Please wait…"
						: authMode === "signin"
							? "Sign in"
							: "Create account"}
				</button>

				<div style={{ alignSelf: "flex-end" }}>
					{authMode === "signin" ? (
						<span>
							No account?{" "}
							<button
								type="button"
								className="link"
								onClick={() => {
									setAuthMode("signup");
									setAuthError("");
								}}
							>
								Sign up
							</button>
						</span>
					) : (
						<span>
							Have an account?{" "}
							<button
								type="button"
								className="link"
								onClick={() => {
									setAuthMode("signin");
									setAuthError("");
								}}
							>
								Sign in
							</button>
						</span>
					)}
				</div>
			</div>
		</main>
	);
}
