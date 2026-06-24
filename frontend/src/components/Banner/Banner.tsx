"use client";

import { useEffect, useState } from "react";
import EnvelopeIcon from "@/components/icons/EnvelopeIcon";
import TelIcon from "@/components/icons/TelIcon";
import "./Banner.scss";

const Banner = () => {
	const [bannerVisible, setBannerVisible] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("banner") === "hidden") return;
		const timeout = setTimeout(() => {
			setBannerVisible(true);
		}, 2000);

		return () => clearTimeout(timeout);
	}, []);

	const hideBanner = () => {
		setBannerVisible(false);
		localStorage.setItem("banner", "hidden");
	};

	return (
		<div className={`banner ${bannerVisible ? "banner--visible" : ""}`}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					width: "100%",
				}}
			>
				<p className="banner__logo">P&A Vision</p>
				<button onClick={hideBanner} className="banner__close-btn">
					Zavřít
				</button>
			</div>
			<p style={{ fontWeight: "500" }}>Kontaktujte nás</p>
			<p>P&A Vision s.r.o.</p>
			<a href="https://maps.app.goo.gl/tmjyrPBdX9Yfte3G8" target="_blank">
				Soběslavova 1381, Kročehlavy, 272 01 Kladno
			</a>
			<p>
				IČO <button>23654341</button>
			</p>
			<p>DIČ CZ23654341</p>
			<a className="banner__link link" href="mailto:info@pavision.cz">
				<EnvelopeIcon />
				<span>info@pavision.cz</span>
			</a>
			<a className="banner__link link" href="tel:+420775632426">
				<TelIcon />
				<span>+420 775 632 426</span>
			</a>
			<a className="banner__link link" href="tel:+420777049617">
				<TelIcon />
				<span>+420 777 049 617</span>
			</a>
		</div>
	);
};

export default Banner;
