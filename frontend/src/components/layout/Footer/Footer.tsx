"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import technologies from "@/data/technologies.json";
import navLinks from "@/data/nav-links.json";
import { TransitionLink } from "@/components/TransitionLink";
import CopyBtn from "@/components/CopyBtn/CopyBtn";
import socials from "@/data/socials.json";
import "./Footer.scss";

const Footer = () => {
	const t = useTranslations();

	const pathname = usePathname();

	return (
		<footer className="footer">
			<div className="footer__inner">
				<nav className="footer__nav">
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
						<p style={{ marginBottom: 10 }}>{t("nav.partners")}</p>
						<ul>
							<li>
								<TransitionLink
									className={`footer-nav__link ${pathname === "/crestron-integration" ? "footer-nav__link--active" : ""}`}
									href="/crestron-integration"
								>
									Crestron
								</TransitionLink>
							</li>
							<li>
								<TransitionLink
									className={`footer-nav__link ${pathname === "/loxone-smart-home" ? "footer-nav__link--active" : ""}`}
									href="/loxone-smart-home"
								>
									Loxone
								</TransitionLink>
							</li>
						</ul>
					</div>
					<div>
						<p style={{ marginBottom: 10 }}>{t("footer.solutions")}</p>
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
						<p style={{ marginBottom: 10 }}>{t("footer.followUs")}</p>
						<ul>
							{socials.map((s, i) => {
								return (
									<li key={i}>
										<a
											className="link"
											href={s.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											{s.label}
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				</nav>
				<div className="footer__divider"></div>
				<div className="footer__bottom">
					<p>&copy; {new Date().getFullYear()} P&A Vision s.r.o.</p>
					<p>{t("footer.allRightsReserved")}</p>
					<TransitionLink
						className={`footer-nav__link ${pathname === "/privacy-policy" ? "footer-nav__link--active" : ""}`}
						href="/privacy-policy"
					>
						{t("footer.privacyPolicy")}
					</TransitionLink>
					<p style={{ marginLeft: "auto" }}>
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
			</div>
			<TransitionLink className="footer__logo" href="/">
				<img src="/footer-logo.svg" alt="P&A Vision s.r.o. logo" />
			</TransitionLink>
		</footer>
	);
};

export default Footer;
