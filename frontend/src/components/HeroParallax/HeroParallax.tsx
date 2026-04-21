"use client";

import { useEffect, useState } from "react";
import "./styles.scss";
import Image from "next/image";

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

	const [showImg, setShowImg] = useState(false);

	return (
		<section className="home-access-hero">
			<div className="hero-parallax-container">
				<div>
					<p className="main__subtitle">{subheading}</p>
					<h1 className="main-heading">{heading}</h1>
				</div>
				<div className="footer__divider"></div>
				<a className="header-nav__link" href="#section">
					Scroll to explore
				</a>
			</div>
			{/* <img
				onLoad={() => setShowImg(true)}
				className={`hero-parallax__img ${showImg ? "hero-parallax__img--visible" : ""}`}
				style={{ transform: `translateY(${parallax}px)` }}
				src={imgSrc}
				alt=""
			/> */}
			<Image
				onLoad={() => setShowImg(true)}
				className={`hero-parallax__img ${showImg ? "hero-parallax__img--visible" : ""}`}
				style={{ transform: `translateY(${parallax}px)` }}
				src={imgSrc}
				alt=""
				fill // or width/height
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
