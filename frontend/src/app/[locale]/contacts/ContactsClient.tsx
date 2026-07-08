"use client";

import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface Client {
	name: string;
	tel: string;
	email: string;
	message: string;
}

const INIT_FORM = {
	name: "",
	tel: "",
	email: "",
	message: "",
};

export default function ContactsClient() {
	const t = useTranslations("contacts");

	const [formError, setFormError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [form, setForm] = useState(INIT_FORM);

	const handleForm = (name: string, value: string) => {
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// TODO: LEARN THIS
	// Supabase
	const insertClient = async (data: Client) => {
		setFormError(null);
		setLoading(true);

		const { error } = await supabase.from("clients").insert([data]);
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
		<form
			// TODO: learn this
			onSubmit={async (e) => {
				e.preventDefault();
				await insertClient(form);
			}}
			className="form"
		>
			<h2 style={{ fontSize: "22px", fontWeight: 500 }}>{t("title")}</h2>
			{formError && <span style={{ color: "red" }}>{formError}</span>}
			<div
				className={`input-container ${form.name !== "" ? "input-container--active" : ""}`}
			>
				<label htmlFor="name">
					{t("name")} ({t("required")})
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
					{t("tel")} ({t("required")})
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
				className={`input-container ${form.email !== "" ? "input-container--active" : ""}`}
			>
				<label htmlFor="email">Email ({t("required")})</label>
				<input
					onChange={(e) => handleForm(e.target.name, e.target.value)}
					value={form.email}
					name="email"
					type="email"
					id="email"
					autoComplete="email"
					disabled={success}
					required
				/>
			</div>
			<div
				style={{ height: "100%" }}
				className={`input-container ${form.message !== "" ? "input-container--active" : ""}`}
			>
				<label htmlFor="message">{t("message")}</label>
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
				{loading ? t("loading") : success ? t("success") : t("submit")}
			</button>
		</form>
	);
}
