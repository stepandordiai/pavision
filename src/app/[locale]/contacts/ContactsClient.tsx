"use client";

import { useState } from "react";

export default function ContactsClient() {
	const [form, setForm] = useState({
		name: "",
		tel: "",
		email: "",
		message: "",
	});

	const handleForm = (name: string, value: string) => {
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<form action="mailto:info@pavision.cz" className="form">
			<h2 style={{ fontSize: "22px", fontWeight: 500 }}>Kontakt formular</h2>
			<div
				className={`input-container ${form.name !== "" ? "input-container--active" : ""}`}
			>
				<label htmlFor="name">Jmeno a prijmeni</label>
				<input
					onChange={(e) => handleForm(e.target.name, e.target.value)}
					name="name"
					className={`input ${form.name !== "" ? "input--active" : ""}`}
					type="text"
					id="name"
					autoComplete="name"
				/>
			</div>
			<div
				className={`input-container ${form.tel !== "" ? "input-container--active" : ""}`}
			>
				<label htmlFor="tel">Telefon (required)</label>
				<input
					onChange={(e) => handleForm(e.target.name, e.target.value)}
					name="tel"
					className="input"
					type="text"
					id="tel"
					autoComplete="name"
				/>
			</div>
			<div
				className={`input-container ${form.email !== "" ? "input-container--active" : ""}`}
			>
				<label htmlFor="email">Email</label>
				<input
					onChange={(e) => handleForm(e.target.name, e.target.value)}
					name="email"
					className="input"
					type="text"
					id="email"
					autoComplete="name"
				/>
			</div>
			<div
				style={{ height: "100%" }}
				className={`input-container ${form.message !== "" ? "input-container--active" : ""}`}
			>
				<label htmlFor="message">Dopis</label>
				<textarea
					onChange={(e) => handleForm(e.target.name, e.target.value)}
					name="message"
					className="textarea input"
					id="message"
				></textarea>
			</div>
			<button className="form__btn" type="submit">
				Poslat
			</button>
		</form>
	);
}
