"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import styles from "./Testimonials.module.scss";
import { TransitionLink } from "../TransitionLink";
import getCreatedDate from "@/utils/getCreatedDate";

interface Testimonial {
	id: string;
	author_name: string;
	content: string;
	rating: number;
	created_at: string;
	user_id: string | null;
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

// ─── Stars ───────────────────────────────────────────────────────────────────

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
							fill="currentColor"
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
							fill="currentColor"
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function Testimonials() {
	// Data
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// Modal
	const [modalOpen, setModalOpen] = useState(false);
	const [showAuth, setShowAuth] = useState(false);

	// Testimonial form
	const [content, setContent] = useState("");
	const [rating, setRating] = useState(5);
	const [authorName, setAuthorName] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");

	// ── Fetch ──────────────────────────────────────────────────────────────────

	const fetchTestimonials = useCallback(async () => {
		const { data, error } = await supabase
			.from("testimonials")
			.select("*")
			.order("created_at", { ascending: false });

		if (!error && data) setTestimonials(data as Testimonial[]);
		setLoading(false);
	}, [supabase]);

	useEffect(() => {
		fetchTestimonials();

		supabase.auth.getUser().then(({ data }) => setUser(data.user));

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, [supabase, fetchTestimonials]);

	// ── Modal helpers ──────────────────────────────────────────────────────────

	const openModal = () => {
		setContent("");
		setRating(5);
		setAuthorName("");
		setSubmitError("");
		setShowAuth(false);
		setModalOpen(true);
	};

	const closeModal = () => setModalOpen(false);

	// ── Submit testimonial ────────────────────────────────────────────────────

	const handleSubmit = async () => {
		// if (!content.trim()) {
		// 	setSubmitError("Please write something before submitting.");
		// 	return;
		// }

		setSubmitting(true);
		setSubmitError("");

		const displayName = user
			? (user.user_metadata?.full_name as string | undefined) ||
				user.email ||
				"User"
			: authorName.trim() || "Anonymous";

		const { error } = await supabase.from("testimonials").insert({
			content: content.trim(),
			rating,
			author_name: displayName,
			user_id: user?.id ?? null,
		});

		if (error) {
			setSubmitError(error.message);
			setSubmitting(false);
			return;
		}

		closeModal();
		fetchTestimonials();
		setSubmitting(false);
	};

	return (
		<section
			style={{ minHeight: "100svh", background: "#333", padding: 20 }}
			aria-labelledby="testimonials-heading"
		>
			{/* <div className={styles.header}> */}
			<h2 id="testimonials-heading" className="section__title">
				What people say
			</h2>
			{/* <div className={styles.headerActions}> */}
			{/* {user ? (
						<span className={styles.authBadge} title={user.email}>
							{user.user_metadata.full_name}
						</span>
					) : null} */}

			{/* </div> */}
			{/* </div> */}
			<button className={styles.btnPrimary} onClick={openModal}>
				<span>Add testimonial</span>
				<span>+</span>
			</button>
			{/* Cards */}
			{/* {loading ? ( */}
			{/* // <div className={styles.loadingRow}> */}
			{/* // 	{[1, 2, 3].map((i) => ( */}
			{/* // 		<div key={i} className={`${styles.card} ${styles.cardSkeleton}`} /> */}
			{/* // 	))} */}
			{/* // </div> */}
			{/* // ) :  */}
			{testimonials.length === 0 ? (
				<p className={styles.empty}>
					No testimonials yet - be the first to leave one!
				</p>
			) : (
				<div className={styles.grid}>
					{testimonials.map((t) => (
						<article key={t.id} className={styles.card}>
							<div className={styles.cardHeader}>
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										gap: "5px",
									}}
								>
									<div className={styles.avatar} aria-hidden="true">
										{getInitials(t.author_name)}
									</div>
									<p className={styles.authorName}>{t.author_name}</p>
								</div>
								<time className={styles.date} dateTime={t.created_at}>
									{getCreatedDate(t.created_at)}
								</time>
							</div>
							<Stars rating={t.rating} />
							<p className={styles.content}>{t.content}</p>
						</article>
					))}
				</div>
			)}
			{/* Modal */}
			{modalOpen && (
				<div
					className={styles.backdrop}
					onClick={closeModal}
					role="dialog"
					aria-modal="true"
					aria-label={showAuth ? "Sign in" : "Add testimonial"}
				>
					<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
						{/* ── Testimonial form ── */}
						<>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									marginBottom: "20px",
								}}
							>
								<h3 className={styles.modalTitle}>Leave a testimonial</h3>
								<button
									type="button"
									className={styles.modalClose}
									onClick={closeModal}
									aria-label="Close"
								>
									✕
								</button>
							</div>
							{user ? (
								<>
									<p style={{ marginBottom: "5px" }}>Author</p>
									<p className={styles.postingAs}>
										{(user.user_metadata?.full_name as string | undefined) ||
											user.email}
									</p>
								</>
							) : (
								<div className={styles.anonRow}>
									<label htmlFor="">Name</label>
									<input
										className={styles.input}
										type="text"
										placeholder="Your name (leave blank for Anonymous)"
										value={authorName}
										onChange={(e) => setAuthorName(e.target.value)}
										maxLength={60}
									/>
									<TransitionLink
										style={{ alignSelf: "flex-end" }}
										href="/login"
										className="link"
									>
										Sign in instead
									</TransitionLink>
								</div>
							)}

							<label className={styles.label}>Rating</label>
							<div
								style={{
									background: "#fff",
									padding: "10px",
									borderRadius: "10px",
									marginBottom: "10px",
								}}
							>
								<Stars rating={rating} interactive onChange={setRating} />
							</div>
							<label className={styles.label} htmlFor="testimonial-content">
								Your message
							</label>
							<textarea
								id="testimonial-content"
								className={styles.textarea}
								placeholder="Share your experience…"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								rows={4}
								maxLength={600}
							/>
							<span className={styles.charCount}>{content.length} / 600</span>

							{submitError && (
								<p className={styles.errorMsg} role="alert">
									{submitError}
								</p>
							)}

							<button
								type="button"
								className={styles.btnSubmit}
								onClick={handleSubmit}
								disabled={submitting}
							>
								{submitting ? "Posting…" : "Post review"}
							</button>
						</>
					</div>
				</div>
			)}
		</section>
	);
}
