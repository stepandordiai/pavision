"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "@/i18n/navigation";
import Lng from "@/components/Lng/Lng";
import navLinks from "@/data/nav-links.json";
import "./Header.scss";

const Header = () => {
	const t = useTranslations();

	const [calcRotation, setCalRotation] = useState(0);
	const [headerActive, setHeaderActive] = useState(false);

	const pathname = usePathname();

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

	useEffect(() => {
		const closeMenuOnEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setMenuOpen(false);
			}
		};

		document.addEventListener("keydown", closeMenuOnEsc);

		return () => document.removeEventListener("keydown", closeMenuOnEsc);
	}, []);

	// menu-btn

	const [menuOpen, setMenuOpen] = useState(false);

	function toggleMenu() {
		setMenuOpen((prev) => !prev);
	}

	return (
		<>
			<header className={`header ${menuOpen ? "header--active" : ""}`}>
				<div className="header-inner">
					<Link className="header__logo" href="/">
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
					</Link>
					<nav className="header-nav">
						{navLinks.map((navLink, i) => {
							return (
								<Link
									key={i}
									className={`header-nav__link ${pathname === navLink.path ? "header-nav__link--active" : ""}`}
									href={navLink.path}
								>
									{t(navLink.label)}
								</Link>
							);
						})}
					</nav>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							gap: 20,
						}}
					>
						<Lng />
						<a className="link header__link" href="tel:+420775632426">
							+420 775 632 426
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
				</div>
				<div className={`menu ${menuOpen ? "menu--active" : ""}`}>
					<div className="menu-inner">
						<nav className="menu-nav">
							{navLinks.map((navLink, i) => {
								return (
									<div key={i} className="menu-nav__link-wrapper">
										<Link
											onClick={() => setMenuOpen(false)}
											// TODO: learn this
											style={
												menuOpen
													? {
															transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + i * 0.05}s `,
														}
													: undefined
											}
											className={`menu-nav__link ${pathname === navLink.path ? "menu-nav__link--active" : ""} ${menuOpen ? "menu-nav__link--visible" : ""}`}
											href={navLink.path}
										>
											{t(navLink.label)}
										</Link>
									</div>
								);
							})}
						</nav>
						<div>
							<div style={{ overflow: "hidden" }}>
								<a
									style={
										menuOpen
											? {
													transition: `color 0.24s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s`,
												}
											: undefined
									}
									className={`menu__link ${menuOpen ? "menu__link--active" : ""}`}
									href="https://www.instagram.com/pa_vision.cz"
									target="_blank"
								>
									Instagram
								</a>
							</div>
						</div>
					</div>
				</div>
			</header>
			<div
				onClick={() => setMenuOpen(false)}
				className={`curtain ${menuOpen ? "curtain--active" : ""}`}
			></div>
		</>
	);
};

export default Header;
