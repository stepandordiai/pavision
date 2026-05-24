"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import technologies from "@/data/technologies.json";
import navLinks from "@/data/nav-links.json";
import { TransitionLink } from "@/components/TransitionLink";
import CopyBtn from "@/components/CopyBtn/CopyBtn";
import "./Footer.scss";

const Footer = () => {
	const t = useTranslations();

	const pathname = usePathname();

	return (
		<footer className="footer">
			<TransitionLink className="footer__logo" href="/">
				{/* <svg
					width="30"
					height="30"
					viewBox="0 0 256 256"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M128.001 0C139.977 64.8783 191.122 116.025 256 128.001C191.123 139.978 139.978 191.123 128.001 256C116.025 191.122 64.8783 139.977 0 128.001C64.8791 116.026 116.026 64.8791 128.001 0Z"
						fill="currentColor"
					/>
				</svg>
				<span>P&A Vision</span> */}
				<img src="/logo-4.png" width={200} alt="" />
			</TransitionLink>
			<div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
				<div>
					<p style={{ marginBottom: 10 }}>{t("navigation")}</p>
					<ul>
						{navLinks.map((navLink, i) => {
							return (
								<li key={i}>
									<TransitionLink
										className={`footer-nav__link ${pathname === navLink.path ? "footer-nav__link--active" : ""}`}
										href={navLink.path}
									>
										{t(navLink.label)}
									</TransitionLink>
								</li>
							);
						})}
					</ul>
				</div>
				<div>
					<p style={{ marginBottom: 10 }}>{t("home.technologies")}</p>
					<ul>
						{technologies.map((technology, i) => {
							return (
								<li key={i}>
									<TransitionLink
										className={`footer-nav__link ${pathname === technology.path ? "footer-nav__link--active" : ""}`}
										href={technology.path}
									>
										{technology.title}
									</TransitionLink>
								</li>
							);
						})}
					</ul>
				</div>
				<div>
					<p style={{ marginBottom: 10 }}>{t("contactUs")}</p>
					<ul>
						<li>P&A Vision s.r.o.</li>
						<li>
							<a
								className="link"
								href="https://maps.app.goo.gl/s5ke4cSpSFbSJHpWA"
								target="_blank"
							>
								Soběslavova 1381, Kročehlavy, 272 01 Kladno
							</a>
						</li>
						<li>
							IČO <CopyBtn txt="23654341" />
						</li>
						<li>
							DIČ <CopyBtn txt="CZ23654341" />
						</li>
						<li>
							<a className="link" href="tel:+420775632426">
								+420 775 632 426
							</a>
						</li>
						<li>
							<a className="link" href="tel:+420777049617">
								+420 777 049 617
							</a>
						</li>
						<li>
							<a className="link" href="mailto:info@pavision.cz">
								info@pavision.cz
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="footer__author">
				<p>&copy; 2026 P&A Vision s.r.o. Všechna práva vyhrazena.</p>
				<p>
					Website created by{" "}
					<a className="link" href="https://www.heeeyooo.com" target="_blank">
						heeeyooo studio
					</a>
				</p>
			</div>
			<div className="footer__divider"></div>
			<div style={{ display: "flex", gap: 10 }}>
				<TransitionLink
					className={`footer-nav__link ${pathname === "/privacy-policy" ? "footer-nav__link--active" : ""}`}
					href="/privacy-policy"
				>
					Privacy Policy
				</TransitionLink>
				<a
					className="footer-nav__link"
					href="https://vimeo.com/showcase/6204726"
					target="_blank"
				>
					How to Videos
				</a>
			</div>
		</footer>
	);
};

export default Footer;
