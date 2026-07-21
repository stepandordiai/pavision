"use client";

import { useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "@/components/Testimonials/Testimonials.module.scss";
import getCreatedDate from "@/utils/getCreatedDate";
import Breadcrumbs from "@/components/common/Breadcrumbs/Breadcrumbs";
import "./styles.scss";

type Testimonial = {
	id: string;
	content: string;
	rating: number;
	created_at: string;
};

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

interface StarsProps {
	rating: number;
	interactive?: boolean;
	onChange?: (value: number) => void;
}

function Stars({ rating, interactive = false, onChange }: StarsProps) {
	const [hovered, setHovered] = useState(0);
	const display = interactive && hovered ? hovered : rating;

	return (
		<div
			className={`${styles.stars} ${interactive ? styles.starsInteractive : ""}`}
		>
			{[1, 2, 3, 4, 5].map((i) => (
				<button
					key={i}
					type="button"
					className={`${styles.star} ${i <= display ? styles.starFilled : ""}`}
					onClick={interactive && onChange ? () => onChange(i) : undefined}
					onMouseEnter={interactive ? () => setHovered(i) : undefined}
					onMouseLeave={interactive ? () => setHovered(0) : undefined}
					tabIndex={interactive ? 0 : -1}
					aria-label={
						interactive ? `Rate ${i} star${i !== 1 ? "s" : ""}` : undefined
					}
				>
					{i <= display ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="white"
							className="bi bi-star-fill"
							viewBox="0 0 16 16"
						>
							<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="white"
							className="bi bi-star"
							viewBox="0 0 16 16"
						>
							<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
						</svg>
					)}
				</button>
			))}
		</div>
	);
}

export default function MyProfile() {
	const locale = useLocale();
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editContent, setEditContent] = useState("");
	const [editRating, setEditRating] = useState(5);
	const [editingName, setEditingName] = useState(false);
	const [nameValue, setNameValue] = useState("");

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.replace("/login");
	};

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			if (!data.user) {
				router.replace("/login");
			} else {
				setUser(data.user);
				fetchTestimonials(data.user.id);
			}
		});
	}, []);

	const fetchTestimonials = async (userId: string) => {
		const { data } = await supabase
			.from("testimonials")
			.select("id, content, rating, created_at")
			.eq("user_id", userId)
			.order("created_at", { ascending: false });

		setTestimonials(data ?? []);
	};

	const handleEdit = (t: Testimonial) => {
		setEditingId(t.id);
		setEditContent(t.content);
		setEditRating(t.rating);
	};

	const handleSave = async (id: string) => {
		await supabase
			.from("testimonials")
			.update({ content: editContent, rating: editRating })
			.eq("id", id);

		setTestimonials((prev) =>
			prev.map((t) =>
				t.id === id ? { ...t, content: editContent, rating: editRating } : t,
			),
		);
		setEditingId(null);
	};

	const handleDelete = async (id: string) => {
		await supabase.from("testimonials").delete().eq("id", id);
		setTestimonials((prev) => prev.filter((t) => t.id !== id));
	};

	const handleSaveName = async () => {
		const { data, error } = await supabase.auth.updateUser({
			data: { full_name: nameValue },
		});

		if (!error) {
			setUser(data.user);
			setEditingName(false);
		}
	};

	if (!user) return null;

	return (
		<main
			style={{ display: "flex", flexDirection: "column", gap: "20px" }}
			className="my-account"
		>
			<Breadcrumbs links={[{ label: "My Account" }]} locale={locale} />
			<div style={{ padding: "0 20px 20px" }}>
				<h1 className="main__title">My account</h1>
				{editingName ? (
					<>
						<input
							value={nameValue}
							onChange={(e) => setNameValue(e.target.value)}
						/>
						<button type="button" onClick={handleSaveName}>
							Save
						</button>
						<button type="button" onClick={() => setEditingName(false)}>
							Cancel
						</button>
					</>
				) : (
					<>
						<p style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>
							Welcome, {user.user_metadata.full_name}
						</p>
						{/* <button
						className="edit-btn"
						type="button"
						onClick={() => {
							setNameValue(user.user_metadata.full_name ?? "");
							setEditingName(true);
						}}
					>
						<PencilIcon />
					</button> */}
					</>
				)}
				<div>
					<span style={{ marginBottom: "5px", display: "block" }}>Email</span>
					<p>{user.email}</p>
				</div>

				<section>
					<h2 className="section__title">My testimonials</h2>

					{testimonials.length === 0 && (
						<p>You haven't posted any testimonials yet.</p>
					)}
					{testimonials.map((t) => (
						<div key={t.id} className="testimonial-item">
							{editingId === t.id ? (
								<>
									<textarea
										style={{
											width: "100%",
											background: "#000",
											padding: "10px",
											borderRadius: "10px",
										}}
										value={editContent}
										onChange={(e) => setEditContent(e.target.value)}
									/>
									<div
										style={{
											width: "100%",
											background: "#000",
											padding: "10px",
											borderRadius: "10px",
										}}
									>
										<Stars
											rating={editRating}
											interactive
											onChange={setEditRating}
										/>
									</div>
									<div style={{ display: "flex", gap: "5px" }}>
										<button
											className="save-btn"
											type="button"
											onClick={() => handleSave(t.id)}
										>
											Save
										</button>
										<button
											className="edit-btn"
											type="button"
											onClick={() => setEditingId(null)}
										>
											Cancel
										</button>
									</div>
								</>
							) : (
								<>
									<p
										style={{ alignSelf: "flex-end", color: "hsl(0, 0%, 50%)" }}
									>
										{getCreatedDate(t.created_at)}
									</p>
									<p>{t.content}</p>
									<Stars rating={t.rating} />
									<div style={{ display: "flex", gap: "5px" }}>
										<button
											className="edit-btn"
											type="button"
											onClick={() => handleEdit(t)}
										>
											Edit
										</button>
										<button
											className="delete-btn"
											type="button"
											onClick={() => handleDelete(t.id)}
										>
											Delete
										</button>
									</div>
								</>
							)}
						</div>
					))}
				</section>
				<button className="sign-out-btn" type="button" onClick={handleSignOut}>
					Sign out
				</button>
			</div>
		</main>
	);
}
