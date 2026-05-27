"use client";

import { useTranslations } from "next-intl";
import { TransitionLink } from "@/components/TransitionLink";
import { AnimatedImage } from "@/components/AnimatedImg";

const OurSolutions = () => {
	const t = useTranslations();

	return (
		<section className="section" id="our-solutions">
			<h2 className="section__title">{t("ourSolutions.title")}</h2>
			<div className="our-solutions">
				<div className="our-solutions-container">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 20,
						}}
					>
						<h3
							style={{
								background: "#000",
								padding: 10,
								borderRadius: 10,
								width: "max-content",
							}}
						>
							{t("ourSolutions.security.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>
							{t("ourSolutions.security.subtitle")}
						</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{t
								.raw("ourSolutions.security.description")
								?.map((txt: string, i: number) => (
									<p key={i}>{txt}</p>
								))}
						</div>
						<div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
							<TransitionLink
								className="our-solutions__link"
								href="/home-access"
							>
								<span>
									<img
										src="/technology-icons/home-access.png"
										width={22}
										alt=""
									/>
								</span>
								<span>{t("homeAccess.heading")}</span>
							</TransitionLink>
							<TransitionLink className="our-solutions__link" href="/security">
								<span>
									<img src="/technology-icons/security.png" width={22} alt="" />
								</span>
								<span>{t("security.heading")}</span>
							</TransitionLink>
						</div>
					</div>
					<div style={{ position: "relative", alignSelf: "flex-start" }}>
						<img className="our-solutions__ss" src="/01.png" alt="" />
						<AnimatedImage src="/01.jpg" alt="" />
					</div>
				</div>
				<div className="our-solutions-container">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 20,
						}}
					>
						<h3
							style={{
								background: "#000",
								padding: 10,
								borderRadius: 10,
								width: "max-content",
								marginBottom: "10px",
							}}
						>
							{t("ourSolutions.wellness.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>
							{t("ourSolutions.wellness.subtitle")}
						</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{t
								.raw("ourSolutions.wellness.description")
								?.map((txt: string, i: number) => {
									return <p key={i}>{txt}</p>;
								})}
						</div>
						<div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
							<TransitionLink href="/lighting" className="our-solutions__link">
								<span>
									<img src="/technology-icons/lighting.png" width={22} alt="" />
								</span>
								<span>{t("lighting.heading")}</span>
							</TransitionLink>
							<TransitionLink href="/audio" className="our-solutions__link">
								<span>
									<img src="/technology-icons/audio.png" width={22} alt="" />
								</span>
								<span>{t("audio.heading")}</span>
							</TransitionLink>
							<TransitionLink href="/shades" className="our-solutions__link">
								<span>
									<img src="/technology-icons/shades.png" width={22} alt="" />
								</span>
								<span>{t("shades.heading")}</span>
							</TransitionLink>
							<TransitionLink
								href="/thermostat"
								className="our-solutions__link"
							>
								<span>
									<img
										src="/technology-icons/thermostat.png"
										width={22}
										alt=""
									/>
								</span>
								<span>{t("thermostat.heading")}</span>
							</TransitionLink>
						</div>
					</div>
					<div style={{ position: "relative", alignSelf: "flex-start" }}>
						<img className="our-solutions__ss" src="/04.png" alt="" />
						<AnimatedImage src="/02.jpg" alt="" />
					</div>
				</div>
				<div className="our-solutions-container">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 20,
						}}
					>
						<h3
							style={{
								background: "#000",
								padding: 10,
								borderRadius: 10,
								width: "max-content",
							}}
						>
							{t("ourSolutions.comfort.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>
							{t("ourSolutions.comfort.subtitle")}
						</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{/* TODO: learn this */}
							{t
								.raw("ourSolutions.comfort.description")
								?.map((txt: string, i: number) => {
									return <p key={i}>{txt}</p>;
								})}
						</div>
						<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
							<TransitionLink className="our-solutions__link" href="/lighting">
								<span>
									<img src="/technology-icons/lighting.png" width={22} alt="" />
								</span>
								<span>{t("lighting.heading")}</span>
							</TransitionLink>
							<TransitionLink
								href="/thermostat"
								className="our-solutions__link"
							>
								<span>
									<img
										src="/technology-icons/thermostat.png"
										width={22}
										alt=""
									/>
								</span>
								<span>{t("thermostat.heading")}</span>
							</TransitionLink>
						</div>
					</div>
					<div style={{ position: "relative", alignSelf: "flex-start" }}>
						<img className="our-solutions__ss" src="/02.png" alt="" />
						<AnimatedImage src="/lighting/02-c.png" alt="" />
					</div>
				</div>
				<div className="our-solutions-container">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 20,
						}}
					>
						<h3
							style={{
								background: "#000",
								padding: 10,
								borderRadius: 10,
								width: "max-content",
							}}
						>
							{t("ourSolutions.convenience.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>
							{t("ourSolutions.convenience.subtitle")}
						</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{/* TODO: learn this */}
							{t
								.raw("ourSolutions.convenience.description")
								?.map((txt: string, i: number) => {
									return <p key={i}>{txt}</p>;
								})}
						</div>
						<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
							<TransitionLink href="/shades" className="our-solutions__link">
								<span>
									<img src="/technology-icons/shades.png" width={32} alt="" />
								</span>
								<span>{t("shades.heading")}</span>
							</TransitionLink>
							<TransitionLink href="/video" className="our-solutions__link">
								<span>
									<img src="/technology-icons/video.png" width={22} alt="" />
								</span>
								<span>{t("video.heading")}</span>
							</TransitionLink>
							<TransitionLink href="/audio" className="our-solutions__link">
								<span>
									<img src="/technology-icons/audio.png" width={22} alt="" />
								</span>
								<span>{t("audio.heading")}</span>
							</TransitionLink>
						</div>
					</div>
					<div style={{ position: "relative", alignSelf: "flex-start" }}>
						<img className="our-solutions__ss" src="/03.png" alt="" />
						<AnimatedImage
							src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-hero.jpg"
							alt=""
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default OurSolutions;
