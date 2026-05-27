"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TransitionLink } from "../TransitionLink";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import "./styles.scss";

type HeroParallaxProps = {
	heading: string;
	subheading: string;
	imgSrc: string;
	secondaryBtnTxt: string;
	imgAlt?: string;
};

const HeroParallax = ({
	heading,
	subheading,
	imgSrc,
	secondaryBtnTxt,
	imgAlt = "",
}: HeroParallaxProps) => {
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
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}
				>
					<h1 className="main-heading">{heading}</h1>
					<p className="main__subtitle">{subheading}</p>
					<TransitionLink href="/contacts" className="hero-btn">
						<span>Request a quote</span>
						<span>
							<ChevronRightIcon />
						</span>
					</TransitionLink>
				</div>
				<div className="footer__divider"></div>
				<a className="header-nav__link" href="#section">
					{secondaryBtnTxt}
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
				alt={imgAlt}
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
