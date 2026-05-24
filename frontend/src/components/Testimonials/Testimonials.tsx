"use client";

import { useState, useEffect, useCallback } from "react";
// import { createClient } from '@/lib/supabase/client'; // adjust to your path
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import styles from "./Testimonials.module.scss";
import { TransitionLink } from "../TransitionLink";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Testimonial {
	id: string;
	author_name: string;
	content: string;
	rating: number;
	created_at: string;
	user_id: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
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
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill={i <= display ? "currentColor" : "none"}
						stroke="currentColor"
						strokeWidth="1.8"
						aria-hidden="true"
					>
						<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
					</svg>
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
					No testimonials yet — be the first to leave one!
				</p>
			) : (
				<div className={styles.grid}>
					{testimonials.map((t) => (
						<article key={t.id} className={styles.card}>
							<div className={styles.cardHeader}>
								<div className={styles.avatar} aria-hidden="true">
									{getInitials(t.author_name)}
								</div>
								<div className={styles.meta}>
									<p className={styles.authorName}>{t.author_name}</p>
									<time className={styles.date} dateTime={t.created_at}>
										{formatDate(t.created_at)}
									</time>
								</div>
								<div className={styles.cardStars}>
									<Stars rating={t.rating} />
								</div>
							</div>
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
								// FIXME:
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
										href={"/login"}
										className="link"
									>
										Sign in instead
									</TransitionLink>
								</div>
							)}

							<label className={styles.label}>Rating</label>
							<Stars rating={rating} interactive onChange={setRating} />

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
