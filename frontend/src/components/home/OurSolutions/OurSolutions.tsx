import { getTranslations } from "next-intl/server";
import { TransitionLink } from "@/components/TransitionLink";
import { AnimatedImage } from "@/components/AnimatedImg";
import "./OurSolutions.scss";
import SoundwaveIcon from "@/components/icons/SoundwaveIcon";
import BulbIcon from "@/components/icons/BulbIcon";
import TvIcon from "@/components/icons/TvIcon";
import LockIcon from "@/components/icons/LockIcon";
import CameraIcon from "@/components/icons/CameraIcon";

export default async function OurSolutions() {
	const t = await getTranslations();

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
							{t("ourSolutions.showroom.badge")}
						</h3>
						<p style={{ fontSize: "2rem" }}>
							{t("ourSolutions.showroom.title")}
						</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{/* TODO: learn this */}
							{t
								.raw("ourSolutions.showroom.description")
								?.map((p: string, i: number) => {
									return <p key={i}>{p}</p>;
								})}
						</div>
						<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
							<TransitionLink className="our-solutions__link" href="/lighting">
								<span>
									<BulbIcon size={20} />
								</span>
								<span>{t("lighting.heading")}</span>
							</TransitionLink>
							<TransitionLink className="our-solutions__link" href="/audio">
								<span>
									<SoundwaveIcon size={20} />
								</span>
								<span>{t("audio.heading")}</span>
							</TransitionLink>
							<TransitionLink className="our-solutions__link" href="/video">
								<span>
									<TvIcon size={20} />
								</span>
								<span>{t("video.heading")}</span>
							</TransitionLink>
						</div>
					</div>
					{/* <div style={{ position: "relative", alignSelf: "flex-start" }}>
						<img className="our-solutions__ss" src="/02.png" alt="" />
						<AnimatedImage
							src="https://i.pinimg.com/736x/cc/27/8d/cc278d71b90d9a248bf9329fc4a6ffbe.jpg"
							alt=""
						/>
					</div> */}
					<div style={{ alignSelf: "flex-start" }}>
						<AnimatedImage
							src="https://i.pinimg.com/736x/cc/27/8d/cc278d71b90d9a248bf9329fc4a6ffbe.jpg"
							alt=""
						/>
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
							{t("ourSolutions.office.badge")}
						</h3>
						<p style={{ fontSize: "2rem" }}>{t("ourSolutions.office.title")}</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{t
								.raw("ourSolutions.office.description")
								?.map((txt: string, i: number) => (
									<p key={i}>{txt}</p>
								))}
						</div>
						<div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
							<TransitionLink className="our-solutions__link" href="/lighting">
								<span>
									<BulbIcon size={20} />
								</span>
								<span>{t("lighting.heading")}</span>
							</TransitionLink>
							<TransitionLink className="our-solutions__link" href="/audio">
								<span>
									<SoundwaveIcon size={20} />
								</span>
								<span>{t("audio.heading")}</span>
							</TransitionLink>
						</div>
					</div>
					{/* <div style={{ position: "relative", alignSelf: "flex-start" }}>
						<img className="our-solutions__ss" src="/01.png" alt="" />
						<AnimatedImage
							src="https://www.crestron.com/getattachment/808fa9b1-0916-4f9e-9d55-1fdf2028b562/808fa9b1-0916-4f9e-9d55-1fdf2028b562.aspx"
							alt=""
						/>
					</div> */}
					<div style={{ alignSelf: "flex-start" }}>
						<AnimatedImage
							src="https://www.crestron.com/getattachment/808fa9b1-0916-4f9e-9d55-1fdf2028b562/808fa9b1-0916-4f9e-9d55-1fdf2028b562.aspx"
							alt=""
						/>
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
							{t("ourSolutions.familyHome.badge")}
						</h3>
						<p style={{ fontSize: "2rem" }}>
							{t("ourSolutions.familyHome.title")}
						</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{/* TODO: learn this */}
							{t
								.raw("ourSolutions.familyHome.description")
								?.map((txt: string, i: number) => {
									return <p key={i}>{txt}</p>;
								})}
						</div>
						<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
							<TransitionLink href="/shades" className="our-solutions__link">
								<span>
									<img src="/technology-icons/shades.png" width={20} alt="" />
								</span>
								<span>{t("shades.heading")}</span>
							</TransitionLink>
							<TransitionLink href="/video" className="our-solutions__link">
								<span>
									<TvIcon size={20} />
								</span>
								<span>{t("video.heading")}</span>
							</TransitionLink>
							<TransitionLink href="/audio" className="our-solutions__link">
								<span>
									<SoundwaveIcon size={20} />
								</span>
								<span>{t("audio.heading")}</span>
							</TransitionLink>
							<TransitionLink
								href="/home-access"
								className="our-solutions__link"
							>
								<span>
									<LockIcon size={20} />
								</span>
								<span>{t("homeAccess.heading")}</span>
							</TransitionLink>
							<TransitionLink href="/lighting" className="our-solutions__link">
								<span>
									<BulbIcon size={20} />
								</span>
								<span>{t("lighting.heading")}</span>
							</TransitionLink>
							<TransitionLink href="/security" className="our-solutions__link">
								<span>
									<CameraIcon size={20} />
								</span>
								<span>{t("security.heading")}</span>
							</TransitionLink>
							<TransitionLink
								href="/thermostat"
								className="our-solutions__link"
							>
								<span>
									<img
										src="/technology-icons/thermostat.png"
										width={20}
										alt=""
									/>
								</span>
								<span>{t("thermostat.heading")}</span>
							</TransitionLink>
						</div>
					</div>
					{/* <div style={{ position: "relative", alignSelf: "flex-start" }}>
						<img className="our-solutions__ss" src="/03.png" alt="" />
						<AnimatedImage
							src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-hero.jpg"
							alt=""
						/>
					</div> */}
					<div style={{ alignSelf: "flex-start" }}>
						<AnimatedImage
							src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-shades-hero.jpg"
							alt=""
						/>
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
							{t("ourSolutions.business.badge")}
						</h3>
						<p style={{ fontSize: "2rem" }}>
							{t("ourSolutions.business.title")}
						</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{t
								.raw("ourSolutions.business.description")
								?.map((txt: string, i: number) => {
									return <p key={i}>{txt}</p>;
								})}
						</div>
						<div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
							<TransitionLink href="/lighting" className="our-solutions__link">
								<span>
									<BulbIcon size={20} />
								</span>
								<span>{t("lighting.heading")}</span>
							</TransitionLink>
							<TransitionLink href="/audio" className="our-solutions__link">
								<span>
									<SoundwaveIcon size={20} />
								</span>
								<span>{t("audio.heading")}</span>
							</TransitionLink>
							<TransitionLink
								href="/home-access"
								className="our-solutions__link"
							>
								<span>
									<LockIcon size={20} />
								</span>
								<span>{t("homeAccess.heading")}</span>
							</TransitionLink>
							<TransitionLink href="/security" className="our-solutions__link">
								<span>
									<CameraIcon size={20} />
								</span>
								<span>{t("security.heading")}</span>
							</TransitionLink>
						</div>
					</div>
					{/* <div style={{ position: "relative", alignSelf: "flex-start" }}>
						<img className="our-solutions__ss" src="/04.png" alt="" />
						<AnimatedImage
							src="https://tesonsolutions.com/wp-content/uploads/2019/09/british-columbia-sports-bar-audio-video-services.jpg"
							alt=""
						/>
					</div> */}
					<div style={{ alignSelf: "flex-start" }}>
						{/* <img className="our-solutions__ss" src="/04.png" alt="" /> */}
						<AnimatedImage
							src="https://tesonsolutions.com/wp-content/uploads/2019/09/british-columbia-sports-bar-audio-video-services.jpg"
							alt=""
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
