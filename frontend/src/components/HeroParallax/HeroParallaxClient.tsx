"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HeroParallaxClientProps = {
	imgSrc: string;
	imgAlt?: string;
};

export default function HeroParallaxClient({
	imgSrc,
	imgAlt = "",
}: HeroParallaxClientProps) {
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
		<>
			<Image
				onLoad={() => setShowImg(true)}
				className={`hero-parallax__img ${showImg ? "hero-parallax__img--visible" : ""}`}
				style={{ transform: `translateY(${parallax}px)` }}
				src={imgSrc}
				alt={imgAlt}
				fill
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
		</>
	);
}
