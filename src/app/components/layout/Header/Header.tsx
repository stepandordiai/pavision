"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Header.scss";

const Header = () => {
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
					<Link
						className={`header-nav__link ${pathname === "/" ? "header-nav__link--active" : ""}`}
						href="/"
					>
						Ůvod
					</Link>
					<Link
						className={`header-nav__link ${pathname === "/o-nas" ? "header-nav__link--active" : ""}`}
						href="/o-nas"
					>
						O nás
					</Link>
					<Link
						className={`header-nav__link ${pathname === "/sluzby" ? "header-nav__link--active" : ""}`}
						href="/sluzby"
					>
						Služby
					</Link>
					<Link
						className={`header-nav__link ${pathname === "/kontakty" ? "header-nav__link--active" : ""}`}
						href="/kontakty"
					>
						Kontakt
					</Link>
				</nav>
				<a className="header__link" href="tel:+420775632426">
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
			<div className={`menu ${menuOpen ? "menu--active" : ""}`}>
				<nav className="menu-nav">
					<Link
						onClick={() => setMenuOpen(false)}
						className={`menu-nav__link ${pathname === "/" ? "menu-nav__link--active" : ""}`}
						href="/"
					>
						Ůvod
					</Link>
					<Link
						onClick={() => setMenuOpen(false)}
						className={`menu-nav__link ${pathname === "/o-nas" ? "menu-nav__link--active" : ""}`}
						href="/o-nas"
					>
						O nás
					</Link>
					<Link
						onClick={() => setMenuOpen(false)}
						className={`menu-nav__link ${pathname === "/sluzby" ? "menu-nav__link--active" : ""}`}
						href="/sluzby"
					>
						Služby
					</Link>
					<Link
						onClick={() => setMenuOpen(false)}
						className={`menu-nav__link ${pathname === "/kontakty" ? "menu-nav__link--active" : ""}`}
						href="/kontakty"
					>
						Kontakt
					</Link>
				</nav>
			</div>
		</header>
	);
};

export default Header;
