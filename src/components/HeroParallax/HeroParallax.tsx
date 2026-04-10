"use client";

import { useEffect, useState } from "react";
import "./styles.scss";

type HeroParallaxProps = {
	heading: string;
	subheading: string;
	imgSrc: string;
};

const HeroParallax = ({ heading, subheading, imgSrc }: HeroParallaxProps) => {
	const [scrollY, setScrollY] = useState(0);
	const [clientHeight, setClientHeight] = useState(800);

	useEffect(() => {
		setClientHeight(document.documentElement.clientHeight);

		const handleScrollY = () => setScrollY(window.scrollY);

		window.addEventListener("scroll", handleScrollY);

		return () => window.removeEventListener("scroll", handleScrollY);
	}, []);

	const darkness = Math.min(scrollY / clientHeight, 1);

	const parallax = scrollY * 0.5;

	return (
		<section className="home-access-hero">
			<div className="hero-parallax-container">
				<div>
					<p>{subheading}</p>
					<h1 className="main-heading">{heading}</h1>
				</div>
				<span>| Scroll to explore |</span>
			</div>
			<img
				style={{ transform: `translateY(${parallax}px)` }}
				src={imgSrc}
				alt=""
			/>
			{/* darkness overlay */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					zIndex: -1,
					background: "#000",
					opacity: darkness,
					pointerEvents: "none",
				}}
			/>
		</section>
	);
};

export default HeroParallax;
