import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { NavLink, useNavigate } from "react-router-dom";
import "./styles.scss";

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);
		setError("");

		try {
			const { error } = await supabase.auth.updateUser({
				password,
			});

			if (error) throw error;
			await supabase.auth.signOut();
			navigate("/login", { replace: true });
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Помилка відновлення пароля",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="reset-password">
			<NavLink to="/" style={{ fontSize: "2rem" }}>
				P&A Vision (admin)
			</NavLink>
			<form className="reset-password-container" onSubmit={handleResetPassword}>
				<h1 style={{ textAlign: "center", fontSize: "1.5rem" }}>
					Reset password
				</h1>
				{error && <p>{error}</p>}
				<div className="reset-password-input-container">
					<label htmlFor="">New password</label>
					<input
						className=""
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button className="primary-btn" type="submit">
					{loading ? "Saving..." : "Save"}
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

export default ResetPassword;
