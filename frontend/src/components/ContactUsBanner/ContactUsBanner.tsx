"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useTranslations } from "next-intl";
import "./styles.scss";

const INIT_FORM = {
	name: "",
	tel: "",
	email: "",
	message: "",
};

export default function ContactUsBanner() {
	const t = useTranslations();

	const [formError, setFormError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [form, setForm] = useState(INIT_FORM);

	const handleForm = (name: string, value: string) => {
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// TODO: LEARN THIS
	// Supabase
	const createClient = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setFormError(null);
		setLoading(true);

		const { error } = await supabase.from("clients").insert([form]);
		if (error) {
			if (error.code !== "23505") {
				setFormError(error.message);
				console.error("Insert error:", error.message);
				setLoading(false);
				return;
			}
		}

		// TODO: LEARN THIS
		fetch("/api/notify-lead", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		}).catch(() => {});

		setLoading(false);
		setSuccess(true);

		setTimeout(() => {
			setSuccess(false);
			setForm(INIT_FORM);
		}, 3000);
	};

	return (
		<section className="contact-us-banner">
			<div>
				<h2 className="contact-us-banner__heading">
					{t("contactUsBanner.heading")}
				</h2>
				<p>
					{t("contactUsBanner.description")}{" "}
					<a className="link" href="mailto:info@pavision.cz">
						info@pavision.cz
					</a>
					.
				</p>
			</div>
			<div>
				<form onSubmit={createClient} className="form">
					<h2 style={{ fontSize: "22px", fontWeight: 500 }}>
						{t("contacts.title")}
					</h2>
					{formError && <span style={{ color: "red" }}>{formError}</span>}
					<div
						className={`input-container ${form.name !== "" ? "input-container--active" : ""}`}
					>
						<label htmlFor="name">
							{t("contacts.name")} ({t("contacts.required")})
						</label>
						<input
							onChange={(e) => handleForm(e.target.name, e.target.value)}
							value={form.name}
							name="name"
							type="text"
							id="name"
							autoComplete="name"
							disabled={success}
							required
						/>
					</div>
					<div
						className={`input-container ${form.tel !== "" ? "input-container--active" : ""}`}
					>
						<label htmlFor="tel">
							{t("contacts.tel")} ({t("contacts.required")})
						</label>
						<input
							onChange={(e) => handleForm(e.target.name, e.target.value)}
							value={form.tel}
							name="tel"
							type="text"
							id="tel"
							autoComplete="tel"
							disabled={success}
							required
						/>
					</div>
					<div
						style={{ height: "100%" }}
						className={`input-container ${form.message !== "" ? "input-container--active" : ""}`}
					>
						<label htmlFor="message">{t("contacts.message")}</label>
						<textarea
							onChange={(e) => handleForm(e.target.name, e.target.value)}
							value={form.message}
							name="message"
							className="textarea"
							id="message"
							disabled={success}
						></textarea>
					</div>
					<button className="form__btn" type="submit" disabled={success}>
						{loading
							? t("contacts.loading")
							: success
								? t("contacts.success")
								: t("contacts.submit")}
					</button>
				</form>
			</div>
		</section>
	);
}
