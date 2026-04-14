import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const OurSolutions = () => {
	const t = useTranslations("ourSolutions");

	return (
		<section className="section" id="our-solutions">
			<h2 className="section__title">{t("title")}</h2>
			<div className="our-solutions">
				<div className="our-solutions-container">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 20,
						}}
					>
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
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{t.raw("security.description")?.map((txt: string, i: number) => (
								<p key={i}>{txt}</p>
							))}
						</div>
						<Link className="our-solutions__link" href="/home-access">
							<span>
								<img src="/home-access.png" width={22} alt="" />
							</span>
							<span>Home Access</span>
						</Link>
					</div>
					<div style={{ position: "relative" }}>
						<img className="our-solutions__ss" src="/01.png" alt="" />
						<img src="/01.jpg" alt="" />
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
							{t("wellness.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>{t("wellness.subtitle")}</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{t.raw("wellness.description")?.map((txt: string, i: number) => {
								return <p key={i}>{txt}</p>;
							})}
						</div>
						<div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
							<Link href="/lighting" className="our-solutions__link">
								<span>
									<img src="/lighting.png" width={22} alt="" />
								</span>
								<span>Lighting</span>
							</Link>
							<Link href="/audio" className="our-solutions__link">
								<span>
									<img src="/audio.png" width={22} alt="" />
								</span>
								<span>Audio</span>
							</Link>
							<Link href="/shades" className="our-solutions__link">
								<span>
									<img src="/shades.png" width={22} alt="" />
								</span>
								<span>Shades</span>
							</Link>
							<Link href="/thermostat" className="our-solutions__link">
								<span>
									<img src="/thermostat.png" width={22} alt="" />
								</span>
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
							{t("comfort.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>{t("comfort.subtitle")}</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{/* TODO: learn this */}
							{t.raw("comfort.description")?.map((txt: string, i: number) => {
								return <p key={i}>{txt}</p>;
							})}
						</div>
						<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
							<Link className="our-solutions__link" href="/lighting">
								<span>
									<img src="/lighting.png" width={22} alt="" />
								</span>
								<span>Lighting</span>
							</Link>
							<Link href="/thermostat" className="our-solutions__link">
								<span>
									<img src="/thermostat.png" width={22} alt="" />
								</span>
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
							{t("convenience.title")}
						</h3>
						<p style={{ fontSize: "2rem" }}>{t("convenience.subtitle")}</p>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{/* TODO: learn this */}
							{t
								.raw("convenience.description")
								?.map((txt: string, i: number) => {
									return <p key={i}>{txt}</p>;
								})}
						</div>
						<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
							<Link href="/shades" className="our-solutions__link">
								<span>
									<img src="/shades.png" width={32} alt="" />
								</span>
								<span>Shades</span>
							</Link>
							<Link href="/video" className="our-solutions__link">
								<span>
									<img src="/video.png" width={22} alt="" />
								</span>
								<span>Video</span>
							</Link>
							<Link href="/audio" className="our-solutions__link">
								<span>
									<img src="/audio.png" width={22} alt="" />
								</span>
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
