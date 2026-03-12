"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import "./Footer.scss";

const navLinks = [
	{
		label: "homeTitle",
		path: "/",
	},
	{
		label: "aboutUsTitle",
		path: "/o-nas",
	},
	{
		label: "productsTitle",
		path: "/produkty",
	},
	{
		label: "contactsTitle",
		path: "/kontakty",
	},
];

const technologies = [
	{
		title: "Lightning",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-lighting-dimmer-3.jpg",
		icon: "light-bulb.png",
	},
	{
		title: "Shading",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-roller.jpg",
		icon: "blinds.png",
	},
	{
		title: "Audio",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/audio-products-speakers-image.jpg",
		icon: "light-bulb.png",
	},
	{
		title: "Video",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-video-hero.jpg",
		icon: "blinds.png",
	},
	{
		title: "Home access",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/partner%20pages/integrated%20partners/2n/photo1_desktop.png",
		icon: "light-bulb.png",
	},
	{
		title: "Thermostats",
		img: "https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostat-thumn.jpg",
		icon: "blinds.png",
	},
];

const Footer = () => {
	const t = useTranslations();

	const pathname = usePathname();

	return (
		<footer className="footer">
			<Link className="footer__logo" href="/">
				<svg
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
				<span>P&A Vision</span>
			</Link>
			<div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
				<div>
					<p style={{ marginBottom: 10 }}>{t("navigation")}</p>
					<ul>
						{navLinks.map((navLink, i) => {
							return (
								<li key={i}>
									<Link
										className={`footer-nav__link ${pathname === navLink.path ? "footer-nav__link--active" : ""}`}
										href={navLink.path}
									>
										{t(navLink.label)}
									</Link>
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
									<Link
										className={`footer-nav__link ${pathname === "/audio" ? "footer-nav__link--active" : ""}`}
										href="/"
									>
										{technology.title}
									</Link>
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
								className="footer__link"
								href="https://maps.app.goo.gl/s5ke4cSpSFbSJHpWA"
								target="_blank"
							>
								Soběslavova 1381, Kročehlavy, 272 01 Kladno
							</a>
						</li>
						<li>IČO 23654341</li>
						<li>
							<a className="footer__link" href="tel:+420775632426">
								+420 775 632 426
							</a>
						</li>
						<li>
							<a className="footer__link" href="tel:+420777049617">
								+420 777 049 617
							</a>
						</li>
						<li>
							<a className="footer__link" href="mailto:info@pavision.cz">
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
					<a
						className="footer__link"
						href="https://www.heeeyooo.studio/cs"
						target="_blank"
					>
						heeeyooo studio
					</a>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
