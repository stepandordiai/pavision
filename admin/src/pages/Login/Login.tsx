import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import "./styles.scss";

interface LoginProps {
	isRecovery?: boolean;
	onRecoveryDone?: () => void;
}

const Login = ({ isRecovery, onRecoveryDone }: LoginProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [authError, setAuthError] = useState("");
	const [authLoading, setAuthLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [mode, setMode] = useState<"login" | "forgot" | "reset">(
		isRecovery ? "reset" : "login",
	);

	// detect if user landed here via reset link
	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY") setMode("reset");
		});
		return () => subscription.unsubscribe();
	}, []);

	// TODO: LEARN THIS
	const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setAuthLoading(true);
		setAuthError("");

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) setAuthError(error.message);
		setAuthLoading(false);
	};

	const handleForgot = async () => {
		if (!email) {
			setMessage("Please enter your email.");
			return;
		}
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/login`,
		});
		if (error) setMessage(error.message);
		else setMessage("Check your email for a reset link.");
	};

	const handleReset = async () => {
		const { error } = await supabase.auth.updateUser({ password });
		if (error) {
			setMessage(error.message);
			return;
		}
		onRecoveryDone?.();
	};

	if (mode === "reset")
		return (
			<div>
				<h2>Set new password</h2>
				<input
					type="password"
					placeholder="New password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{message && <p>{message}</p>}
				<button onClick={handleReset}>Update password</button>
			</div>
		);

	if (mode === "forgot")
		return (
			<div>
				<h2>Reset password</h2>
				<input
					type="email"
					placeholder="Your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				{message && <p>{message}</p>}
				<button onClick={handleForgot}>Send reset link</button>
				<button onClick={() => setMode("login")}>Back to login</button>
			</div>
		);

	return (
		<main className="login-main">
			<h1 style={{ fontSize: "2rem" }}>P&A Vision (admin)</h1>
			<p>Please enter credentials to get access</p>
			{authError && <strong style={{ color: "red" }}>Access denied</strong>}
			<form className="login-form" onSubmit={handleAuth}>
				<div className="login-input-container">
					<label htmlFor="">Email</label>
					<input
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						type="email"
					/>
				</div>
				<div className="login-input-container">
					<label htmlFor="">Password</label>
					<input
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						type="password"
					/>
				</div>
				<button className="login-submit-btn" type="submit">
					{authLoading ? "Please wait..." : "Sign in"}
				</button>
			</form>
			<button onClick={() => setMode("forgot")}>Forgot password?</button>
		</main>
	);
};

export default Login;
