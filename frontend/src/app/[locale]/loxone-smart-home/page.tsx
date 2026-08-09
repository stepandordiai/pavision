import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import { TransitionLink } from "@/components/TransitionLink";
import Faqs from "@/components/Faqs/Faqs";
import "./styles.scss";

const PAGE = "loxone-smart-home";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "loxoneSmartHome.meta",
	});
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${PAGE}`]),
	);

	return {
		title: t("title"),
		description: t("description"),
		alternates: {
			canonical: `/${locale}/${PAGE}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${PAGE}`,
			},
		},

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `/${locale}/${PAGE}`,
			type: "website",
			images: "/pavision-og.png",
		},
	};
}

export default async function LoxoneSmartHome({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	return (
		<main>
			<HeroParallax
				heading="Loxone Smart Home Installation & Automation"
				subheading="Experience complete home automation with Loxone. Control lighting,
				climate, security, shading, audio, and energy management through one
				intelligent system designed around your lifestyle."
				imgSrc="https://www.loxone.com/enen/wp-content/uploads/sites/3/2023/09/The-Forum-experience-automation-open-graph-scaled.jpg"
				secondaryBtnTxt="Explore Loxone Solutions"
				currentPage="Loxone"
				locale={locale}
			/>
			<section className="section" id="section">
				<h2 className="section__title">Why Choose Loxone?</h2>
				<div className="section-container">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<p>
							Loxone is one of Europe's leading intelligent building automation
							platforms, designed to connect every aspect of your home into a
							single, easy-to-use system.
						</p>
						<p>
							Unlike traditional smart home products that rely on multiple apps
							and disconnected devices, Loxone brings everything together in one
							integrated ecosystem.
						</p>
						<p>Benefits include:</p>
						<ul className="loxone-smart-home-list">
							<li>One app for complete control</li>
							<li>Energy-efficient automation</li>
							<li>Enhanced security</li>
							<li>Increased comfort</li>
							<li>Future-ready scalability</li>
							<li>Reduced operating costs</li>
						</ul>
					</div>
					<img
						style={{ borderRadius: "10px" }}
						src="https://portal.loxone.com/admin/wp-content/uploads/2023/12/1702551165-1024x576.jpeg"
						alt=""
					/>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">What Can Loxone Control?</h2>
				<div className="loxone-smart-home-flex">
					<div>
						<h3>Smart Lighting</h3>
						<p>
							Automated scenes, dimming, occupancy detection, and
							daylight-responsive control.
						</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/lighting"
						>
							More
						</TransitionLink>
						<img
							src="https://www.loxone.com/enen/wp-content/uploads/sites/3/2024/02/Home-kitchen-loxone-lighting.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>Climate Control</h3>
						<p>Heating, cooling, ventilation, and temperature optimization.</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/thermostat"
						>
							More
						</TransitionLink>
						<img
							src="https://www.loxone.com/enus/wp-content/uploads/sites/13/2021/08/Replacing-the-HVAC-system.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>Smart Audio</h3>
						<p>Multi-room audio integrated directly into your smart home.</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/audio"
						>
							More
						</TransitionLink>
						<img
							src="https://www.soundsuit.fm/images/sonos/loxone_hero_full_e2d9ac8e.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>Home Access</h3>
						<p>Smart locks, intercoms, keyless entry, and remote access.</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/home-access"
						>
							More
						</TransitionLink>
						<img
							src="https://portal.loxone.com/admin/wp-content/uploads/2023/01/1675079927-1024x578.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>Security</h3>
						<p>
							Motion detection, alarms, surveillance integration, and presence
							simulation.
						</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/security"
						>
							More
						</TransitionLink>
						<img
							src="https://images.squarespace-cdn.com/content/v1/625702dfac602b778c23aa2c/1751296538172-I73ZA3PW2XKOQ00WJTT7/Loxone-domestic.png?format=750w"
							alt=""
						/>
					</div>
					<div>
						<h3>Smart Shading</h3>
						<p>
							Automated blinds and shading systems for comfort and energy
							efficiency.
						</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/shades"
						>
							More
						</TransitionLink>
						<img
							src="https://www.loxone.com/enus/wp-content/uploads/sites/13/2019/09/shading_remote_air.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>Energy Management</h3>
						<p>
							Solar integration, battery management, EV charging, and energy
							monitoring.
						</p>
						<img
							src="https://www.loxone.com/int/wp-content/uploads/sites/21/2025/10/PH-Header-Blog-Easy-Energymanagement.jpg"
							alt=""
						/>
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Intelligent Lighting Automation</h2>
				<div className="section-container">
					<img src="/09.jpg" alt="" />
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<p>
							Loxone automatically adjusts lighting based on occupancy, daylight
							levels, time of day, and user preferences.
						</p>
						<p>Benefits:</p>
						<ul className="loxone-smart-home-list">
							<li>Automated lighting scenes</li>
							<li>Energy savings</li>
							<li>Improved comfort</li>
							<li>Enhanced security</li>
							<li>Voice and app control</li>
						</ul>
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Smarter Heating and Cooling</h2>
				<div className="section-container">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<p>
							Maintain perfect comfort while minimizing energy consumption
							through intelligent climate automation.
						</p>
						<p>Features:</p>
						<ul>
							<li>Smart thermostats</li>
							<li>Room-by-room control</li>
							<li>Automated schedules</li>
							<li>Weather-based optimization</li>
							<li>Energy-efficient operation</li>
						</ul>
					</div>
					<img
						style={{ maxHeight: "100svh", borderRadius: "10px" }}
						src="/10.jpg"
						alt=""
					/>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Intelligent Home Protection</h2>
				<div className="section-container">
					<img
						style={{ borderRadius: "10px" }}
						src="https://images.squarespace-cdn.com/content/v1/57ab07976a49635fe425fbf1/1672777734317-6WIRDVF5UTYKE2ZCR9OV/%28c%29Loxone-Intercom-NFC-Code-Touch-03.jpg"
						alt=""
					/>
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<p>
							Integrate access control, alarms, cameras, and monitoring into one
							secure platform.
						</p>
						<ul className="loxone-smart-home-list-flex">
							<li>
								<span>Smart locks</span>
								<img
									src="https://pim.loxone.com//01%20Product%20Data/01%20Products/Access/100481%20-%20NFC%20Code%20Touch%20Tree%20Wei%C3%9F/Images/ph-shop-100481-NFC-Code-Touch-Tree-Wei%C3%9F-09.jpg"
									alt=""
								/>
							</li>
							<li>
								<span>Video intercoms</span>
								<img
									src="https://pim.loxone.com//01%20Product%20Data/01%20Products/Access/100485%20-%20Intercom%20Anthrazit/Images/PH-Shop-Intercom-1.jpg"
									alt=""
								/>
							</li>
							<li>Presence simulation</li>
							<li>Alarm notifications</li>
							<li>Remote monitoring</li>
						</ul>
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Optimize Energy Consumption</h2>
				<div className="section-container">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<p>Monitor and automate energy use across your property.</p>
						<p>Capabilities:</p>
						<ul className="loxone-smart-home-list">
							<li>Solar management</li>
							<li>Battery storage optimization</li>
							<li>EV charger integration</li>
							<li>Consumption monitoring</li>
							<li>Automated energy balancing</li>
						</ul>
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns:
								"repeat(auto-fill, minmax(min(100%, 170px), 170px))",
							gap: "10px",
							// height: "100svh",
							justifyContent: "center",
						}}
					>
						<img
							src="https://www.loxone.com/cscz/wp-content/uploads/sites/7/2024/06/Mockup-%E2%80%93-iPhone-13-Pro-3.png"
							alt=""
						/>
						<img
							src="https://www.loxone.com/cscz/wp-content/uploads/sites/7/2024/06/Vizu-1-F.png"
							alt=""
						/>
						<img
							src="https://www.loxone.com/cscz/wp-content/uploads/sites/7/2024/06/Vizu-2-F.png"
							alt=""
						/>
						<img
							src="https://www.loxone.com/cscz/wp-content/uploads/sites/7/2024/06/Vizu-3-F.png"
							alt=""
						/>
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Why Work With P&A Vision?</h2>
				<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
					<p>As an official Loxone Partner, P&A Vision provides:</p>
					<ul className="loxone-smart-home-flex-img">
						<li>
							<span>Consultation</span>
							<img
								src="https://www.loxone.com/enus/wp-content/uploads/sites/13/2021/09/PH-Header-Blog-Smart-Home-Installation-Consulting.jpg"
								alt=""
							/>
						</li>
						<li>
							<span>System design</span>
							<img
								src="https://www.loxone.com/enus/wp-content/uploads/sites/13/2026/03/ph_loxone_header_software-scaled-1.jpg"
								alt=""
							/>
						</li>
						<li>
							<span>Professional installation</span>
							<img
								src="https://www.loxone.com/int/wp-content/uploads/sites/21/2022/06/PH-ElektrikerSchaltschrank-scaled-1.jpg"
								alt=""
							/>
						</li>
						<li>
							<span>Programming</span>
							<img
								src="https://www.loxone.com/enen/wp-content/uploads/sites/3/2026/03/PH-Library.jpg"
								alt=""
							/>
						</li>
						<li>
							<span>Commissioning</span>
							<img
								src="https://infrastor.de/wp-content/uploads/2024/09/Loxone-App-1.jpg"
								alt=""
							/>
						</li>
						<li>
							<span>Ongoing support</span>
							<img
								src="https://www.loxone.com/enus/wp-content/uploads/sites/13/2026/04/fs-header-support-loxone-desktop-scaled-1.jpg"
								alt=""
							/>
						</li>
					</ul>
					<p>
						We create intelligent homes tailored to each client's lifestyle,
						ensuring reliability, scalability, and exceptional user experience.
					</p>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Our Loxone Installation Process</h2>
				<div className="loxone-smart-home-flex-process">
					<div>
						<span>Step 1</span>
						<p>Consultation & Planning</p>
					</div>
					<div>
						<span>Step 2</span>
						<p>System Design</p>
					</div>
					<div>
						<span>Step 3</span>
						<p>Installation</p>
					</div>
					<div>
						<span>Step 4</span>
						<p>Programming & Automation</p>
					</div>
					<div>
						<span>Step 5</span>
						<p>Testing & Handover</p>
					</div>
					<div>
						<span>Step 6</span>
						<p>Support & Optimization</p>
					</div>
				</div>
			</section>
			<Faqs faqs={"loxoneSmartHome.faqs"} />
		</main>
	);
}
