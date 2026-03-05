"use client";

import { useEffect, useState } from "react";
import "./Header.scss";
import Image from "next/image";
import Link from "next/link";

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

	// menu-btn

	const [menuOpen, setMenuOpen] = useState(false);

	function toggleMenu() {
		setMenuOpen((prev) => !prev);
	}

	return (
		<header className={`header ${menuOpen ? "header--active" : ""}`}>
			<div className="header-inner">
				<a className="header__logo" href="">
					<svg
						width="30"
						height="30"
						viewBox="0 0 256 256"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						style={{
							transform: `rotate(${calcRotation}deg)`,
						}}
					>
						<path
							d="M128.001 0C139.977 64.8783 191.122 116.025 256 128.001C191.123 139.978 139.978 191.123 128.001 256C116.025 191.122 64.8783 139.977 0 128.001C64.8791 116.026 116.026 64.8791 128.001 0Z"
							fill="currentColor"
						/>
					</svg>
					<span>P&A Vision</span>
				</a>
				<nav className="header-nav">
					<Link className="header-nav__link" href="/">
						Ůvod
					</Link>
					<Link className="header-nav__link" href="/o-nas">
						O nás
					</Link>
					<Link className="header-nav__link" href="/sluzby">
						Služby
					</Link>
					<Link className="header-nav__link" href="/kontakt">
						Kontakt
					</Link>
				</nav>
				<a className="header__link" href="">
					+420722001016
				</a>
				<button
					onClick={toggleMenu}
					className={`menu-btn ${menuOpen ? "menu-btn--active" : ""}`}
				>
					<span
						className={`menu-btn__center-line ${menuOpen ? "menu-btn__center-line--active" : ""}`}
					></span>
				</button>
			</div>
			<div className={`menu ${menuOpen ? "menu--active" : ""}`}>
				<nav className="menu-nav">
					<Link className="menu-nav__link" href="/">
						Ůvod
					</Link>
					<Link className="menu-nav__link" href="/o-nas">
						O nás
					</Link>
					<Link className="menu-nav__link" href="/sluzby">
						Služby
					</Link>
					<Link className="menu-nav__link" href="/kontakt">
						Kontakt
					</Link>
				</nav>
			</div>
		</header>
	);
};

export default Header;
