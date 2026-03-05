"use client";

import { useEffect, useState } from "react";
import "./Banner.scss";
import EnvelopeIcon from "@/app/icons/EnvelopeIcon";
import TelIcon from "@/app/icons/TelIcon";

const Banner = () => {
	const [bannerVisible, setBannerVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setBannerVisible(true);
		}, 2000);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<div className={`banner ${bannerVisible ? "banner--visible" : ""}`}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<p className="banner__logo">
					<svg
						width="22"
						height="22"
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
				</p>
				<button
					onClick={() => setBannerVisible(false)}
					className="banner__close-btn"
				>
					Zavřít
				</button>
			</div>
			<p style={{ fontSize: "18px", fontWeight: "600" }}>
				Tato stránka se právě připravuje...
			</p>
			<p style={{ fontWeight: "500" }}>Kontaktujte nás</p>
			<p>P&A Vision s.r.o.</p>
			<a href="https://maps.app.goo.gl/tmjyrPBdX9Yfte3G8" target="_blank">
				Soběslavova 1381, Kročehlavy, 272 01 Kladno
			</a>
			<p>
				IČO <button>23654341</button>
			</p>
			<a className="banner__link" href="mailto:info@pavision.cz">
				<EnvelopeIcon />
				<span>info@pavision.cz</span>
			</a>
			<a className="banner__link" href="tel:+420775632426">
				<TelIcon />
				<span>+420 775 632 426</span>
			</a>
			<a className="banner__link" href="tel:+420777049617">
				<TelIcon />
				<span>+420 777 049 617</span>
			</a>
		</div>
	);
};

export default Banner;
