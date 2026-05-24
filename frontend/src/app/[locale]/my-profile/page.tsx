"use client";

import "./styles.scss";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Testimonial = {
	id: string;
	content: string;
	rating: number;
	created_at: string;
};

export default function MyProfile() {
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
		<main className="main">
			<h1>My account</h1>
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
					<p>{user.user_metadata.full_name}</p>
					<button
						type="button"
						onClick={() => {
							setNameValue(user.user_metadata.full_name ?? "");
							setEditingName(true);
						}}
					>
						Edit name
					</button>
				</>
			)}
			<p>{user.email}</p>
			<button type="button" onClick={handleSignOut}>
				Sign out
			</button>
			<section>
				<h2>My testimonials</h2>

				{testimonials.length === 0 && (
					<p>You haven't posted any testimonials yet.</p>
				)}

				{testimonials.map((t) => (
					<div key={t.id} className="testimonial-item">
						{editingId === t.id ? (
							<>
								<textarea
									value={editContent}
									onChange={(e) => setEditContent(e.target.value)}
								/>
								<select
									value={editRating}
									onChange={(e) => setEditRating(Number(e.target.value))}
								>
									{[1, 2, 3, 4, 5].map((n) => (
										<option key={n} value={n}>
											{n}
										</option>
									))}
								</select>
								<button type="button" onClick={() => handleSave(t.id)}>
									Save
								</button>
								<button type="button" onClick={() => setEditingId(null)}>
									Cancel
								</button>
							</>
						) : (
							<>
								<p>{t.content}</p>
								<span>Rating: {t.rating}/5</span>
								<button type="button" onClick={() => handleEdit(t)}>
									Edit
								</button>
								<button type="button" onClick={() => handleDelete(t.id)}>
									Delete
								</button>
							</>
						)}
					</div>
				))}
			</section>
		</main>
	);
}
