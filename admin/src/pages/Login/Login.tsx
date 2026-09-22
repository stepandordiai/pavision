import { supabase } from "../../lib/supabase";
import { useState } from "react";
import "./styles.scss";
import { NavLink } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [authError, setAuthError] = useState("");
	const [authLoading, setAuthLoading] = useState(false);
	const [forgotPassword, setForgotPassword] = useState(false);

	// TODO: LEARN THIS
	const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setAuthError("");
		setAuthLoading(true);

		try {
			if (forgotPassword) {
				const { error } = await supabase.auth.resetPasswordForEmail(email, {
					redirectTo: `${window.location.origin}/reset-password`,
				});

				if (error) throw error;
				setForgotPassword(false);
				return;
			}

			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;
		} catch (error: any) {
			setAuthError(error.message);
		} finally {
			setAuthLoading(false);
		}
	};

	return (
		<main className="login-main">
			<NavLink to="/" style={{ fontSize: "2rem" }}>
				P&A Vision (admin)
			</NavLink>
			{authError && <strong style={{ color: "red" }}>Access denied</strong>}
			<form className="login-form" onSubmit={handleAuth}>
				<h1>{forgotPassword ? "Forgot password" : "Login"}</h1>
				<div className="login-input-container">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						type="email"
						required
					/>
				</div>
				{!forgotPassword && (
					<div className="login-input-container">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							type="password"
							required
						/>
					</div>
				)}

				<button className="login-submit-btn" type="submit">
					{/* TODO: learn this */}
					{forgotPassword
						? authLoading
							? "Recovering..."
							: "Recover password"
						: authLoading
							? "Wait..."
							: "Login"}
				</button>
				<button
					type="button"
					onClick={() => setForgotPassword((prev) => !prev)}
				>
					{forgotPassword ? "Login" : "Forgot password?"}
				</button>
			</form>
			<p>
				Created by{" "}
				<a
					href="https://www.heeeyooo.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					heeeyooo studio
				</a>
			</p>
		</main>
	);
};

export default Login;
