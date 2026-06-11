"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import Lng from "@/components/Lng/Lng";
import navLinks from "@/data/nav-links.json";
import { TransitionLink } from "@/components/TransitionLink";
import PersonIcon from "@/components/icons/PersonIcon";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import "./Header.scss";
import PersonFillIcon from "@/components/icons/PersonFillIcon";
import ChevronIcon from "@/components/icons/ChevronIcon";
import ArrowRightUpIcon from "@/components/icons/ArrowRightUpIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";

const Header = () => {
	const t = useTranslations();

	const [calcRotation, setCalRotation] = useState(0);
	const [headerExpanded, setHeaderExpanded] = useState(false);
	const [menuExpanded, setMenuExpanded] = useState(false);

	const pathname = usePathname();

	useEffect(() => {
		// const changeHeader = () => {
		// 	const scrollY = window.scrollY;
		// 	const windowY = window.innerHeight;
		// 	setHeaderActive(scrollY >= windowY);
		// };
		// const calculateLogoRotation = () => {
		// 	const scrollY = window.scrollY;
		// 	setCalRotation(scrollY / 10);
		// };
		// const handleScroll = () => {
		// 	changeHeader();
		// 	calculateLogoRotation();
		// };
		// window.addEventListener("scroll", handleScroll);
		// return () => window.removeEventListener("scroll", handleScroll);
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

	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => setUser(data.user));

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	const headerBottomRef = useRef<HTMLDivElement | null>(null);
	const btnRef = useRef<HTMLButtonElement | null>(null);
	const menuBottomRef = useRef<HTMLDivElement | null>(null);
	const menubtnRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			const insideDropdown = headerBottomRef.current?.contains(target);
			const insideBtn = btnRef.current?.contains(target);

			if (insideBtn) return; // let the button handle itself
			if (!insideDropdown) setHeaderExpanded(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			const insideDropdown = menuBottomRef.current?.contains(target);
			const insideBtn = menubtnRef.current?.contains(target);

			if (insideBtn) return; // let the button handle itself
			if (!insideDropdown) setMenuExpanded(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<>
			<header
				className={`header ${menuOpen ? "header--active" : headerExpanded ? "header--expanded" : ""}`}
			>
				<div className="header-top">
					<TransitionLink className="header__logo" href="/">
						{/* <svg
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
						</svg> */}
						<img src="/logo.svg" width={100} alt="" />
						{/* <span style={{ lineHeight: "1" }}>
							P&A
							<br />
							Vision
						</span> */}
					</TransitionLink>
					<nav className="header-nav">
						{navLinks.map((navLink, i) => {
							return (
								<TransitionLink
									key={i}
									className={`header-nav__link ${pathname === navLink.path ? "header-nav__link--active" : ""}`}
									href={navLink.path}
								>
									{t(navLink.label)}
								</TransitionLink>
							);
						})}
						<button
							ref={btnRef}
							onClick={() => setHeaderExpanded((prev) => !prev)}
							className={`header-nav__link-btn ${headerExpanded ? "header-nav__link-btn--active" : ""}`}
						>
							Brands
						</button>
					</nav>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							gap: 20,
						}}
					>
						<TransitionLink href={user ? "/my-profile" : "/login"}>
							{user ? <PersonFillIcon size={32} /> : <PersonIcon size={32} />}
						</TransitionLink>
						<Lng />
						<TransitionLink
							className={`header-nav__link header__link ${pathname === "/appointment" ? "header-nav__link--active" : ""}`}
							href="/appointment"
						>
							Domluvit schůzku
						</TransitionLink>
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

				<div
					ref={headerBottomRef}
					className={`header-bottom ${headerExpanded ? "header-bottom--expanded" : ""}`}
				>
					<div className="header-bottom-inner">
						<TransitionLink
							onClick={() => setHeaderExpanded(false)}
							className={`header-bottom__link ${headerExpanded ? "header-bottom__link--visible" : ""}`}
							href="/loxone-smart-home"
						>
							<span
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "100%",
								}}
							>
								<span>Loxone</span>
								<ChevronRightIcon size={24} />
							</span>
						</TransitionLink>
						<TransitionLink
							onClick={() => setHeaderExpanded(false)}
							className={`header-bottom__link ${headerExpanded ? "header-bottom__link--visible" : ""}`}
							href="/crestron-home"
						>
							<span
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "100%",
								}}
							>
								<span>Crestrone</span>
								<ChevronRightIcon size={24} />
							</span>
						</TransitionLink>
					</div>
				</div>
				<div className={`menu ${menuOpen ? "menu--active" : ""}`}>
					<div className="menu-inner">
						<nav className="menu-nav">
							{navLinks.map((navLink, i) => {
								return (
									<div key={i} className="menu-nav__link-wrapper">
										<TransitionLink
											onClick={() => setMenuOpen(false)}
											// TODO: learn this
											style={
												menuOpen
													? {
															transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + i * 0.05}s`,
														}
													: undefined
											}
											className={`menu-nav__link ${pathname === navLink.path ? "menu-nav__link--active" : ""} ${menuOpen ? "menu-nav__link--visible" : ""}`}
											href={navLink.path}
										>
											{t(navLink.label)}
										</TransitionLink>
									</div>
								);
							})}
							<div className="menu-nav__link-wrapper">
								<button
									ref={menubtnRef}
									onClick={() => setMenuExpanded((prev) => !prev)}
									style={
										menuOpen
											? {
													transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s`,
												}
											: undefined
									}
									className={`menu-nav__link-btn  ${menuOpen ? "menu-nav__link-btn--visible" : ""} ${menuExpanded ? "menu-nav__link-btn--active" : ""}`}
								>
									Brands
								</button>
							</div>
							<div ref={menuBottomRef} className="menu-bottom-inner">
								<TransitionLink
									onClick={() => {
										setMenuOpen(false);
										setMenuExpanded(false);
									}}
									className={`header-bottom__link ${menuExpanded ? "header-bottom__link--visible" : ""}`}
									href="/loxone-smart-home"
								>
									<span
										style={{
											display: "flex",
											justifyContent: "space-between",
											width: "100%",
										}}
									>
										<span>Loxone</span>
										<ChevronRightIcon size={24} />
									</span>
								</TransitionLink>
								<TransitionLink
									onClick={() => {
										setMenuOpen(false);
										setMenuExpanded(false);
									}}
									className={`header-bottom__link ${menuExpanded ? "header-bottom__link--visible" : ""}`}
									href="/crestron-home"
								>
									<span
										style={{
											display: "flex",
											justifyContent: "space-between",
											width: "100%",
										}}
									>
										<span>Crestrone</span>
										<ChevronRightIcon size={24} />
									</span>
								</TransitionLink>
							</div>
						</nav>
						<div className="footer__divider"></div>

						<div>
							<div
								style={{
									overflow: "hidden",
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<a
									style={
										menuOpen
											? {
													transition: `color 0.24s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s`,
												}
											: undefined
									}
									className={`menu__link ${menuOpen ? "menu__link--visible" : ""}`}
									href="https://www.instagram.com/pa_vision.cz"
									target="_blank"
								>
									Instagram
								</a>
								<TransitionLink
									onClick={() => setMenuOpen(false)}
									// TODO: learn this
									style={
										menuOpen
											? {
													transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s`,
												}
											: undefined
									}
									className={`menu__link ${pathname === "/appointment" ? "menu__link--active" : ""} ${menuOpen ? "menu__link--visible" : ""}`}
									href="/appointment"
								>
									Domluvit schůzku
								</TransitionLink>
							</div>
						</div>
					</div>
				</div>
			</header>
			<div
				onClick={() => setMenuOpen(false)}
				className={`curtain ${menuOpen || headerExpanded ? "curtain--active" : ""}`}
			></div>
		</>
	);
};

export default Header;
