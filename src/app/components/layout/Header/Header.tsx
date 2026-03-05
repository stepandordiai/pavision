"use client";

import { useEffect, useState } from "react";
import "./Header.scss";
import Image from "next/image";

const Header = () => {
	const [calcRotation, setCalRotation] = useState(0);
	const [headerActive, setHeaderActive] = useState(false);

	useEffect(() => {
		const changeHeader = () => {
			const scrollY = window.scrollY;
			const windowY = window.innerHeight;

			setHeaderActive(scrollY >= windowY);
		};

		const calculateLogoRotation = () => {
			const scrollY = window.scrollY;
			setCalRotation(scrollY / 10);
		};

		const handleScroll = () => {
			changeHeader();
			calculateLogoRotation();
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header className={`header ${headerActive ? "header--active" : ""}`}>
			<a className="header__logo" href="">
				<svg
					width="32"
					height="32"
					viewBox="0 0 256 256"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{
						transform: `rotate(${calcRotation}deg)`,
						color: headerActive ? "#000" : "#fff",
					}}
				>
					<path
						d="M128.001 0C139.977 64.8783 191.122 116.025 256 128.001C191.123 139.978 139.978 191.123 128.001 256C116.025 191.122 64.8783 139.977 0 128.001C64.8791 116.026 116.026 64.8791 128.001 0Z"
						fill="currentColor"
					/>
				</svg>
				<span>P&A Vision</span>
			</a>
			{/* <nav className="header-nav">
				<a href="">Ůvod</a>
				<a href="">O nás</a>
				<a href="">Služby</a>
				<a href="">Kontakt</a>
			</nav>
			<button className="header__btn">Order now</button> */}
		</header>
	);
};

export default Header;
