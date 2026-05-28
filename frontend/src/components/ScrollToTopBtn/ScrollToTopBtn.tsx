"use client";

import { useState, useEffect } from "react";
import ArrowUpIcon from "../icons/ArrowUpIcon";
import "./styles.scss";

export default function ScrollToTopBtn() {
	const [visible, setVisible] = useState(false);

	const handleScrollToTop = () => {
		window.scrollTo(0, 0);
	};

	useEffect(() => {
		const windowHeight = window.innerHeight;

		const handleOnScroll = () => setVisible(window.scrollY >= windowHeight);

		// TODO: learn { passive: true }
		window.addEventListener("scroll", handleOnScroll, { passive: true });

		return () => window.removeEventListener("scroll", handleOnScroll);
	}, []);

	return (
		<button
			onClick={handleScrollToTop}
			className={`scroll-to-top-btn ${visible ? "scroll-to-top-btn--visible" : ""}`}
			type="button"
		>
			<ArrowUpIcon size={20} />
		</button>
	);
}
