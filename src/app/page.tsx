"use client";

import { useState } from "react";
import "./Home.scss";

export default function Home() {
	const [garageOpen, setGarageOpen] = useState(false);
	const [interiorLight, setInteriorLight] = useState(false);
	const [exteriorLight, setExteriorLight] = useState(false);

	return (
		<main>
			<section className="hero">
				<div className="hero-container">
					<h1 className="hero__title">
						Kvalita, design a technologie v dokonalé rovnováze.
					</h1>
					<p className="hero__desc">
						Tvoříme chytré domy, audio & video systémy, automatizaci a
						energeticky efektivní řešení.
					</p>
				</div>

				{/* ── 3D Platform ── */}
				<div className="sh-plat-wrap">
					<div className="sh-plat-3d" />
				</div>

				<div className="house">
					<div className="left-side">
						<div className="interior-btn-wrapper">
							<button
								onClick={() => setInteriorLight((prev) => !prev)}
								className="garage-btn"
							>
								<span></span>
							</button>
							<div>
								Interior lights (Status:{" "}
								{interiorLight ? "turned on" : "turned off"})
							</div>
						</div>
						<div className="exterior-btn-wrapper">
							<button
								onClick={() => setExteriorLight((prev) => !prev)}
								className="garage-btn"
							>
								<span></span>
							</button>
							<div>
								Exterior lights (Status:{" "}
								{exteriorLight ? "turned on" : "turned off"})
							</div>
						</div>
						<div
							className={`left-wall ${exteriorLight ? "left-wall--on" : ""}`}
						></div>
						<div className="top-wall"></div>
						<div className="window">
							<div
								className={`window-light ${interiorLight ? "window-light--on" : ""}`}
							></div>
						</div>
						<div className="door">
							<div
								className={`door-light ${interiorLight ? "door-light--on" : ""}`}
							></div>
							{Array.from({ length: 9 }).map((_, i) => (
								<div key={i} className="door-panel"></div>
							))}
						</div>
					</div>
					<div
						className={`right-side ${exteriorLight ? "right-side--on" : ""}`}
					>
						<div className="garage-btn-wrapper">
							<button
								onClick={() => setGarageOpen((prev) => !prev)}
								className="garage-btn"
							>
								<span></span>
							</button>
							<div>
								Garage door (Status: {garageOpen ? "opened" : "closed"})
							</div>
						</div>
						<div className="garage">
							<div
								className={`garage-door ${garageOpen ? "garage-door--open" : ""}`}
							>
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className="garage-panel"></div>
								))}
							</div>
						</div>
					</div>
				</div>

				<p className="hero-scroll">Scroll to exlore more</p>
			</section>
			<section className="section">
				<h2>About us</h2>
			</section>
			<section className="section">
				<h2>What we do</h2>
			</section>
			<section className="section">
				<h2>Technologies</h2>
			</section>
			<section className="section">
				<h2>Products</h2>
			</section>
		</main>
	);
}
