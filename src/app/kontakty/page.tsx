"use client";

import { useState } from "react";
import EnvelopeIcon from "../icons/EnvelopeIcon";
import TelIcon from "../icons/TelIcon";
import "./Contacts.scss";

export default function Contacts() {
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
		<main className="contacts">
			<div className="contacts-details">
				<h1 className="contacts__title">
					Rádi s vámi probereme váš projekt – první konzultace je zdarma
				</h1>
				<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							flexDirection: "column",
							gap: 10,
						}}
					>
						<div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 10,
									marginBottom: 10,
								}}
							>
								<TelIcon />
								<h2 style={{ fontSize: "18px", fontWeight: 500 }}>
									Zavolejte nam
								</h2>
							</div>
							<p>
								Zavolejte během pracovní doby a získejte bezplatnou konzultaci.
							</p>
						</div>
						<a className="contacts-details__link" href="tel:+420775632426">
							+420 775 632 426
						</a>
						<a className="contacts-details__link" href="tel:+420777049617">
							+420 777 049 617
						</a>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							flexDirection: "column",
							gap: 10,
						}}
					>
						<div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 10,
									marginBottom: 10,
								}}
							>
								<EnvelopeIcon />
								<h2 style={{ fontSize: "18px", fontWeight: 500 }}>
									Napiste nam
								</h2>
							</div>
							<p>Odpovíme vám do 12 hodin</p>
						</div>
						<a
							className="contacts-details__link"
							href="mailto:info@pavision.cz"
						>
							info@pavision.cz
						</a>
					</div>
				</div>
				<div style={{ marginTop: "auto" }}>
					<h2 style={{ fontSize: "18px", fontWeight: 500 }}>Sledujte nas</h2>
					<div>
						<a
							className="contacts-details__link"
							href="https://www.instagram.com/pa_vision.cz"
							target="_blank"
						>
							Instagram
						</a>
						,
					</div>
				</div>
			</div>
			<div className="contacts-form">
				<form action="mailto:info@pavision.cz" className="form">
					<h2 style={{ fontSize: "22px", fontWeight: 500 }}>
						Kontakt formular
					</h2>
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
			</div>
		</main>
	);
}
