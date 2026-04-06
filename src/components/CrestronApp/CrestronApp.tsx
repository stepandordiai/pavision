import { useTranslations } from "next-intl";

const CrestronApp = () => {
	const t = useTranslations("crestronApp");

	return (
		<div className="container">
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				<p style={{ fontSize: "2rem" }}>{t("title")}</p>
				<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
					<a
						style={{
							background: "#000",
							padding: 10,
							borderRadius: 10,
							display: "flex",
							justifyContent: "flex-start",
							alignItems: "center",
							gap: 5,
						}}
						href="https://apps.apple.com/us/app/crestron-home/id1466827669"
						target="_blank"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							className="bi bi-apple"
							viewBox="0 0 16 16"
						>
							<path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
							<path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
						</svg>
						<span style={{ display: "flex", flexDirection: "column" }}>
							<span style={{ fontSize: "8px" }}>Download on the</span>
							<span>App Store</span>
						</span>
					</a>
					<a
						style={{
							background: "#000",
							padding: 10,
							borderRadius: 10,
							display: "flex",
							justifyContent: "flex-start",
							alignItems: "center",
							gap: 5,
						}}
						href="https://play.google.com/store/apps/details?id=com.crestron.phoenix.app&hl=en_US&gl=US"
						target="_blank"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							className="bi bi-google-play"
							viewBox="0 0 16 16"
						>
							<path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055zM1 13.396V2.603L6.846 8zM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27" />
						</svg>
						<span style={{ display: "flex", flexDirection: "column" }}>
							<span style={{ fontSize: "8px" }}>GET IT ON</span>
							<span>Google Play</span>
						</span>
					</a>
				</div>
				<p style={{ marginTop: "auto" }}>* {t("hint")}</p>
			</div>
			<div>
				<img
					src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/os-home-luxury_1.jpg"
					alt=""
				/>
			</div>
		</div>
	);
};

export default CrestronApp;
