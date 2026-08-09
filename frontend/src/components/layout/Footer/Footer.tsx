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
				<img src="/logo.svg" width={200} alt="" />
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
										{t(technology.title)}
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
				<div>
					<p style={{ marginBottom: 10 }}>Follow us</p>
					<ul>
						<li>
							<a
								className="link"
								href="https://www.instagram.com/pa_vision.cz"
								target="_blank"
							>
								Instagram
							</a>
						</li>
						<li>
							<a
								className="link"
								href="https://www.facebook.com/profile.php?id=61581254326915"
								target="_blank"
							>
								Facebook
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="footer__bottom">
				<p>
					&copy; {new Date().getFullYear()} P&A Vision s.r.o. Všechna práva
					vyhrazena.
				</p>
				<p>
					Website created by{" "}
					<a
						className="link"
						href="https://www.heeeyooo.com"
						target="_blank"
						rel="noopener noreferrer"
					>
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
			</div>
		</footer>
	);
};

export default Footer;
