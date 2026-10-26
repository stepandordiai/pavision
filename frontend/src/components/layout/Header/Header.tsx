"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import Lng from "@/components/Lng/Lng";
import navLinks from "@/data/nav-links.json";
import { TransitionLink } from "@/components/TransitionLink";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import solutions from "@/data/technologies.json";
import "./Header.scss";

const Header = () => {
	const t = useTranslations();

	const [partnersExpanded, setPartnersExpanded] = useState(false);
	const [solutionsExpanded, setSolutionsExpanded] = useState(false);
	const [menuPartnersExpanded, setMenuPartnersExpanded] = useState(false);
	const [menuSolutionsExpanded, setMenuSolutionsExpanded] = useState(false);

	const pathname = usePathname();

	// at the top of the component
	const activeIndex = Math.max(
		0,
		solutions.findIndex((s) => s.path === pathname), // start on the current page's image
	);
	const [hovered, setHovered] = useState<number | null>(null);
	const shown = hovered ?? activeIndex;

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
	const headerBottomRef2 = useRef<HTMLDivElement | null>(null);
	const btnRef = useRef<HTMLButtonElement | null>(null);
	const btnRef2 = useRef<HTMLButtonElement | null>(null);
	const menuBottomRef = useRef<HTMLDivElement | null>(null);
	const menuBottomRef2 = useRef<HTMLDivElement | null>(null);
	const menubtnRef = useRef<HTMLButtonElement | null>(null);
	const menubtnRef2 = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			const insideDropdown = headerBottomRef.current?.contains(target);
			const insideDropdown2 = headerBottomRef2.current?.contains(target);
			const insideBtn = btnRef.current?.contains(target);
			const insideBtn2 = btnRef2.current?.contains(target);

			if (insideBtn || insideBtn2) return; // let the button handle itself
			if (!insideDropdown) setPartnersExpanded(false);
			if (!insideDropdown2) setSolutionsExpanded(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			const insideDropdown = menuBottomRef.current?.contains(target);
			const insideDropdown2 = menuBottomRef2.current?.contains(target);
			const insideBtn = menubtnRef.current?.contains(target);
			const insideBtn2 = menubtnRef2.current?.contains(target);

			if (insideBtn || insideBtn2) return; // let the button handle itself
			if (!insideDropdown) setMenuPartnersExpanded(false);
			if (!insideDropdown2) setMenuSolutionsExpanded(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<>
			<header
				className={`header ${menuOpen ? "header--active" : partnersExpanded || solutionsExpanded ? "header--expanded" : ""}`}
			>
				<div className="header-top">
					<TransitionLink className="header__logo" href="/">
						<img src="/logo.svg" width={32} alt="" />
					</TransitionLink>
					<nav className="header-nav">
						<TransitionLink
							className={`header-nav__link ${pathname === "/" ? "header-nav__link--active" : ""}`}
							href="/"
						>
							{t("nav.home")}
						</TransitionLink>
						<TransitionLink
							className={`header-nav__link ${pathname === "/about-us" ? "header-nav__link--active" : ""}`}
							href="/about-us"
						>
							{t("nav.aboutUs")}
						</TransitionLink>
						<button
							ref={btnRef2}
							onClick={() => {
								setSolutionsExpanded((prev) => !prev);
								setPartnersExpanded(false);
							}}
							className={`header-nav__link-btn ${solutionsExpanded ? "header-nav__link-btn--active" : ""}`}
						>
							Solutions
						</button>
						<TransitionLink
							className={`header-nav__link ${pathname === "/for-developers" ? "header-nav__link--active" : ""}`}
							href="/for-developers"
						>
							{t("nav.forDevs")}
						</TransitionLink>
						<TransitionLink
							className={`header-nav__link ${pathname === "/for-architects" ? "header-nav__link--active" : ""}`}
							href="/for-architects"
						>
							{t("nav.forArchitects")}
						</TransitionLink>
						<button
							ref={btnRef}
							onClick={() => {
								setPartnersExpanded((prev) => !prev);
								setSolutionsExpanded(false);
							}}
							className={`header-nav__link-btn ${partnersExpanded ? "header-nav__link-btn--active" : ""}`}
						>
							{t("nav.partners")}
						</button>
						<TransitionLink
							className={`header-nav__link ${pathname === "/products" ? "header-nav__link--active" : ""}`}
							href="/products"
						>
							{t("nav.products")}
						</TransitionLink>
						<TransitionLink
							className={`header-nav__link ${pathname === "/contacts" ? "header-nav__link--active" : ""}`}
							href="/contacts"
						>
							{t("nav.contacts")}
						</TransitionLink>
					</nav>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							gap: 20,
						}}
					>
						{/* <TransitionLink href={user ? "/my-profile" : "/login"}>
							{user ? <PersonFillIcon size={32} /> : <PersonIcon size={32} />}
						</TransitionLink> */}
						<Lng />
						<TransitionLink
							className={`header-nav__link header__link ${pathname === "/appointment" ? "header-nav__link--active" : ""}`}
							href="/appointment"
						>
							{t("nav.bookAConsultation")}
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
					className={`header-bottom ${partnersExpanded ? "header-bottom--expanded" : ""}`}
				>
					<div className="header-bottom-inner">
						<TransitionLink
							onClick={() => setPartnersExpanded(false)}
							className={`header-bottom__link ${partnersExpanded ? "header-bottom__link--visible" : ""}`}
							href="/crestron-integration"
						>
							<div className="header-bottom__link-content">
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										width: "100%",
										marginTop: "auto",
									}}
								>
									<span>Crestron</span>
									<ChevronRightIcon size={24} />
								</div>
							</div>
							<div className="header-bottom__link-img-wrapper">
								<img src="/services-crestron.jpg" alt="" />
							</div>
						</TransitionLink>
						<TransitionLink
							onClick={() => setPartnersExpanded(false)}
							className={`header-bottom__link ${partnersExpanded ? "header-bottom__link--visible" : ""}`}
							href="/loxone-smart-home"
						>
							<div className="header-bottom__link-content">
								<img
									src="/loxone-partner-logo.svg"
									width={200}
									alt="P&A Vision s.r.o. - certified Loxone silver partner"
								/>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										width: "100%",
									}}
								>
									<span>Loxone</span>
									<ChevronRightIcon size={24} />
								</div>
							</div>
							<div className="header-bottom__link-img-wrapper">
								<img src="/services-loxone.jpg" alt="" />
							</div>
						</TransitionLink>
					</div>
				</div>
				<div
					ref={headerBottomRef2}
					className={`header-bottom ${solutionsExpanded ? "header-bottom--expanded" : ""}`}
				>
					<div className="header-bottom-inner__solutions">
						<div onMouseLeave={() => setHovered(null)}>
							{solutions.map((navLink, i) => {
								return (
									<div key={i} className="menu-nav__link-wrapper">
										<TransitionLink
											onClick={() => setSolutionsExpanded(false)}
											onMouseEnter={() => setHovered(i)}
											onFocus={() => setHovered(i)} // keyboard users get it too
											style={
												solutionsExpanded
													? {
															transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + i * 0.05}s`,
														}
													: undefined
											}
											className={`menu-nav__link ${pathname === navLink.path ? "menu-nav__link--active" : ""} ${solutionsExpanded ? "menu-nav__link--visible" : ""}`}
											href={navLink.path}
										>
											{t(navLink.title)}
										</TransitionLink>
									</div>
								);
							})}
						</div>
						<div
							className={`header-bottom__solution-img-container ${solutionsExpanded ? "header-bottom__solution-img-container--visible" : ""}`}
							style={{
								position: "relative",
								width: "500px",
								overflow: "hidden",
								borderRadius: "10px",
							}}
						>
							{solutions.map((navLink, i) => (
								<img
									key={navLink.path}
									src={navLink.img}
									alt=""
									style={{
										position: "absolute",
										inset: 0,
										width: "100%",
										height: "100%",
										objectFit: "cover",
										objectPosition: "center",
										opacity: i === shown ? 1 : 0,
										transform: i === shown ? "scale(1)" : "scale(1.04)",
										transition: "opacity 0.4s ease, transform 0.8s ease",
									}}
								/>
							))}
						</div>
					</div>
				</div>
				<div className={`menu ${menuOpen ? "menu--active" : ""}`}>
					<div className="menu-inner">
						<div
							style={{
								overflowY: "scroll",
								height: "calc(100dvh - 74px)",
								scrollbarWidth: "none",
								display: "flex",
								flexDirection: "column",
								gap: "12px",
							}}
						>
							<nav className="menu-nav">
								<div className="menu-nav__link-wrapper">
									<TransitionLink
										onClick={() => setMenuOpen(false)}
										// TODO: learn this
										style={
											menuOpen
												? {
														transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + 0 * 0.05}s`,
													}
												: undefined
										}
										className={`menu-nav__link ${pathname === "/" ? "menu-nav__link--active" : ""} ${menuOpen ? "menu-nav__link--visible" : ""}`}
										href="/"
									>
										{t("nav.home")}
									</TransitionLink>
								</div>
								<div className="menu-nav__link-wrapper">
									<TransitionLink
										onClick={() => setMenuOpen(false)}
										// TODO: learn this
										style={
											menuOpen
												? {
														transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + 1 * 0.05}s`,
													}
												: undefined
										}
										className={`menu-nav__link ${pathname === "/about-us" ? "menu-nav__link--active" : ""} ${menuOpen ? "menu-nav__link--visible" : ""}`}
										href="/about-us"
									>
										{t("nav.aboutUs")}
									</TransitionLink>
								</div>
								<div className="menu-nav__link-wrapper">
									<button
										ref={menubtnRef2}
										onClick={() => setMenuSolutionsExpanded((prev) => !prev)}
										style={
											menuOpen
												? {
														transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + 2 * 0.05}s`,
													}
												: undefined
										}
										className={`menu-nav__link-btn  ${menuOpen ? "menu-nav__link-btn--visible" : ""} ${menuSolutionsExpanded ? "menu-nav__link-btn--active" : ""}`}
									>
										Solutions
									</button>
								</div>
								<div
									ref={menuBottomRef2}
									className={`menu-bottom__solutions ${menuSolutionsExpanded ? "menu-bottom__solutions--visible" : ""}`}
								>
									<div className="menu-bottom-inner__solutions">
										{solutions.map((s, i) => {
											return (
												<div key={i} className="menu-nav__link-wrapper">
													<TransitionLink
														onClick={() => {
															setSolutionsExpanded(false);
															setMenuOpen(false);
														}}
														// TODO: learn this
														style={
															menuSolutionsExpanded
																? {
																		transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + i * 0.05}s`,
																	}
																: undefined
														}
														className={`menu-nav__link ${pathname === s.path ? "menu-nav__link--active" : ""} ${menuSolutionsExpanded ? "menu-nav__link--visible" : ""}`}
														href={s.path}
													>
														{t(s.title)}
													</TransitionLink>
												</div>
											);
										})}
									</div>
								</div>
								<div className="menu-nav__link-wrapper">
									<TransitionLink
										onClick={() => setMenuOpen(false)}
										// TODO: learn this
										style={
											menuOpen
												? {
														transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + 3 * 0.05}s`,
													}
												: undefined
										}
										className={`menu-nav__link ${pathname === "/for-developers" ? "menu-nav__link--active" : ""} ${menuOpen ? "menu-nav__link--visible" : ""}`}
										href="/for-developers"
									>
										{t("nav.forDevs")}
									</TransitionLink>
								</div>
								<div className="menu-nav__link-wrapper">
									<TransitionLink
										onClick={() => setMenuOpen(false)}
										// TODO: learn this
										style={
											menuOpen
												? {
														transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + 4 * 0.05}s`,
													}
												: undefined
										}
										className={`menu-nav__link ${pathname === "/for-architects" ? "menu-nav__link--active" : ""} ${menuOpen ? "menu-nav__link--visible" : ""}`}
										href="/for-architects"
									>
										{t("nav.forArchitects")}
									</TransitionLink>
								</div>
								<div className="menu-nav__link-wrapper">
									<button
										ref={menubtnRef}
										onClick={() => setMenuPartnersExpanded((prev) => !prev)}
										style={
											menuOpen
												? {
														transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + 5 * 0.05}s`,
													}
												: undefined
										}
										className={`menu-nav__link-btn  ${menuOpen ? "menu-nav__link-btn--visible" : ""} ${menuPartnersExpanded ? "menu-nav__link-btn--active" : ""}`}
									>
										{t("nav.partners")}
									</button>
								</div>
								<div
									ref={menuBottomRef}
									className={`menu-bottom ${menuPartnersExpanded ? "menu-bottom--visible" : ""}`}
								>
									<div className="menu-bottom-inner">
										<TransitionLink
											onClick={() => {
												setMenuOpen(false);
												setMenuPartnersExpanded(false);
											}}
											className={`header-bottom__link ${menuPartnersExpanded ? "header-bottom__link--visible" : ""}`}
											href="/crestron-integration"
										>
											<div className="header-bottom__link-content">
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
														width: "100%",
														marginTop: "auto",
													}}
												>
													<span>Crestron</span>
													<ChevronRightIcon size={24} />
												</div>
											</div>
											<div className="header-bottom__link-img-wrapper">
												<img src="/services-crestron.jpg" alt="" />
											</div>
										</TransitionLink>
										<TransitionLink
											onClick={() => {
												setMenuOpen(false);
												setMenuPartnersExpanded(false);
											}}
											className={`header-bottom__link ${menuPartnersExpanded ? "header-bottom__link--visible" : ""}`}
											href="/loxone-smart-home"
										>
											<div className="header-bottom__link-content">
												<img
													src="/loxone-partner-logo.svg"
													width={200}
													alt="P&A Vision s.r.o. - certified Loxone silver partner"
												/>
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
														width: "100%",
													}}
												>
													<span>Loxone</span>
													<ChevronRightIcon size={24} />
												</div>
											</div>
											<div className="header-bottom__link-img-wrapper">
												<img src="/services-loxone.jpg" alt="" />
											</div>
										</TransitionLink>
									</div>
								</div>
								<div className="menu-nav__link-wrapper">
									<TransitionLink
										onClick={() => setMenuOpen(false)}
										// TODO: learn this
										style={
											menuOpen
												? {
														transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + 6 * 0.05}s`,
													}
												: undefined
										}
										className={`menu-nav__link ${pathname === "/products" ? "menu-nav__link--active" : ""} ${menuOpen ? "menu-nav__link--visible" : ""}`}
										href="/products"
									>
										{t("nav.products")}
									</TransitionLink>
								</div>
								<div className="menu-nav__link-wrapper">
									<TransitionLink
										onClick={() => setMenuOpen(false)}
										// TODO: learn this
										style={
											menuOpen
												? {
														transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + 7 * 0.05}s`,
													}
												: undefined
										}
										className={`menu-nav__link ${pathname === "/contacts" ? "menu-nav__link--active" : ""} ${menuOpen ? "menu-nav__link--visible" : ""}`}
										href="/contacts"
									>
										{t("nav.contacts")}
									</TransitionLink>
								</div>
							</nav>
							<div>
								<div
									style={{
										overflow: "hidden",
										display: "flex",
										columnGap: "10px",
									}}
								>
									<a
										style={
											menuOpen
												? {
														transition: `color 0.24s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + 8 * 0.05}s`,
													}
												: undefined
										}
										className={`menu__link ${menuOpen ? "menu__link--visible" : ""}`}
										href="https://www.instagram.com/pa_vision.cz"
										target="_blank"
										rel="noopener noreferrer"
									>
										Instagram
									</a>
									<a
										style={
											menuOpen
												? {
														transition: `color 0.24s, transform 1s cubic-bezier(0.16, 1, 0.3, 1)  ${0.25 + 9 * 0.05}s`,
													}
												: undefined
										}
										className={`menu__link ${menuOpen ? "menu__link--visible" : ""}`}
										href="https://www.facebook.com/profile.php?id=61581254326915"
										target="_blank"
										rel="noopener noreferrer"
									>
										Facebook
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
			<div
				onClick={() => setMenuOpen(false)}
				className={`curtain ${menuOpen || partnersExpanded ? "curtain--active" : ""}`}
			></div>
		</>
	);
};

export default Header;
