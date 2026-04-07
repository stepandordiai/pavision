import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const OurSolutions = () => {
	const t = useTranslations("ourSolutions");

	return (
		<section className="section" id="our-solutions">
			<h2 className="section__title">{t("title")}</h2>
			<div className="our-solutions">
				<div className="our-solutions-container">
					<div>
						<h3
							style={{
								background: "#000",
								padding: 10,
								borderRadius: 10,
								width: "max-content",
							}}
						>
							{t("security.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>{t("security.subtitle")}</p>
						<br />
						<p>{t("security.desc")}</p>
						<br />
						<Link className="our-solutions__link" href={"/home-access"}>
							<span
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									background: "#000",
									width: "40px",
									height: "40px",
									borderRadius: 10,
								}}
							>
								<img src="/home-access.png" width={22} alt="" />
							</span>
							<span>Home Access</span>
						</Link>
					</div>
					<div>
						<div style={{ position: "relative" }}>
							<img className="our-solutions__ss" src="/01.png" alt="" />
							<img src="/01.jpg" alt="" />
						</div>
						<br />
						<br />
						<p>{t("security.desc1")}</p>
					</div>
				</div>
				<div className="our-solutions-container">
					<div>
						<h3
							style={{
								background: "#000",
								padding: 10,
								borderRadius: 10,
								width: "max-content",
							}}
						>
							{t("wellness.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>{t("wellness.subtitle")}</p>
						<br />
						<p>{t("wellness.desc")}</p>
						<br />
						<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
							<Link href="/lightning" className="our-solutions__link">
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										background: "#000",
										width: "40px",
										height: "40px",
										borderRadius: 10,
									}}
								>
									<img src="/lightning.png" width={22} alt="" />
								</div>
								<span>Lightning</span>
							</Link>
							<Link href="/audio" className="our-solutions__link">
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										background: "#000",
										width: "40px",
										height: "40px",
										borderRadius: 10,
									}}
								>
									<img src="/audio.png" width={22} alt="" />
								</div>
								<span>Audio</span>
							</Link>
							<Link href="/shades" className="our-solutions__link">
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										background: "#000",
										width: "40px",
										height: "40px",
										borderRadius: 10,
									}}
								>
									<img src="/shades.png" width={22} alt="" />
								</div>
								<span>Shades</span>
							</Link>
							<Link href="/thermostat" className="our-solutions__link">
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										background: "#000",
										width: "40px",
										height: "40px",
										borderRadius: 10,
									}}
								>
									<img src="/thermostat.png" width={22} alt="" />
								</div>
								<span>Thermostat</span>
							</Link>
						</div>
					</div>
					<div style={{ position: "relative" }}>
						<img className="our-solutions__ss" src="/04.png" alt="" />
						<img src="/02.jpg" alt="" />
					</div>
				</div>
				<div className="our-solutions-container">
					<div>
						<h3
							style={{
								background: "#000",
								padding: 10,
								borderRadius: 10,
								width: "max-content",
							}}
						>
							{t("comfort.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>{t("comfort.subtitle")}</p>
						<br />
						<p>{t("comfort.desc")}</p>
						<br />
						<p>{t("comfort.desc1")}</p>
						<br />
						<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
							<Link className="our-solutions__link" href="/lightning">
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										background: "#000",
										width: "40px",
										height: "40px",
										borderRadius: 10,
									}}
								>
									<img src="/lightning.png" width={22} alt="" />
								</div>
								<span>Lightning</span>
							</Link>
							<Link href="/thermostat" className="our-solutions__link">
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										background: "#000",
										width: "40px",
										height: "40px",
										borderRadius: 10,
									}}
								>
									<img src="/thermostat.png" width={22} alt="" />
								</div>
								<span>Thermostat</span>
							</Link>
						</div>
					</div>
					<div style={{ position: "relative" }}>
						<img className="our-solutions__ss" src="/02.png" alt="" />
						<img
							src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostat-thumn.jpg"
							alt=""
						/>
					</div>
				</div>
				<div className="our-solutions-container">
					<div>
						<h3
							style={{
								background: "#000",
								padding: 10,
								borderRadius: 10,
								width: "max-content",
							}}
						>
							{t("convenience.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>{t("convenience.subtitle")}</p>
						<br />
						<p>{t("convenience.desc")}</p>
						<br />
						<p>{t("convenience.desc1")}</p>
						<br />
						<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
							<Link href="/shades" className="our-solutions__link">
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										background: "#000",
										width: "40px",
										height: "40px",
										borderRadius: 10,
									}}
								>
									<img src="/shades.png" width={32} alt="" />
								</div>
								<span>Shades</span>
							</Link>
							<Link href="/video" className="our-solutions__link">
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										background: "#000",
										width: "40px",
										height: "40px",
										borderRadius: 10,
									}}
								>
									<img src="/video.png" width={22} alt="" />
								</div>
								<span>Video</span>
							</Link>
							<Link href="/audio" className="our-solutions__link">
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										background: "#000",
										width: "40px",
										height: "40px",
										borderRadius: 10,
									}}
								>
									<img src="/audio.png" width={22} alt="" />
								</div>
								<span>Audio</span>
							</Link>
						</div>
					</div>
					<div style={{ position: "relative" }}>
						<img className="our-solutions__ss" src="/03.png" alt="" />
						<img
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
