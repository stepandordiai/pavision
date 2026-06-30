import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import { TransitionLink } from "@/components/TransitionLink";
import Faqs from "@/components/Faqs/Faqs";
import "./styles.scss";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "lighting.meta" });
	const page = "crestron-home";
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${page}`]),
	);

	return {
		title: "Crestron Home Automation & Smart Home Integration",
		description:
			"Premium Crestron Home automation, intelligent lighting, home cinema, climate control, security, and whole-home integration designed for luxury living.",
		alternates: {
			canonical: `/${locale}/${page}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${page}`,
			},
		},
	};
}

export default function CrestronHome() {
	return (
		<main>
			<HeroParallax
				heading="Crestron Home Automation & Smart Living"
				subheading="Experience complete control of your home through one intelligent
				platform. Crestron seamlessly integrates lighting, climate, security,
				entertainment, shading, and access control into a single luxury smart
				home experience."
				imgSrc="https://www.strata-gee.com/wp-content/uploads/2024/08/PR_2024_Crestron_Home_OS4_in-app_Updates_1-RS-ADJ2.jpg"
				secondaryBtnTxt="Explore Crestron Solutions"
				currentPage="Crestron"
				currentPageUrl="/crestron-home"
			/>
			<section className="section">
				<h2 className="section__title">Why Choose Crestron?</h2>
				<div className="section-container">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "12px" }}
					>
						<p>
							Crestron is one of the world's most trusted automation platforms
							for luxury homes, premium residences, and intelligent buildings.
						</p>
						<p>
							Designed to deliver reliability, performance, and exceptional user
							experience, Crestron brings every system in your property together
							under one intuitive interface.
						</p>
						<p>
							Unlike standalone smart devices, Crestron provides a fully
							integrated ecosystem that simplifies daily living while enhancing
							comfort, security, and efficiency.
						</p>
					</div>
					<img
						style={{ borderRadius: "10px" }}
						src="https://www.slingersolutions.com/assets/crestron-hero-BkThue0W.jpg"
						alt=""
					/>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">What Can Crestron Control?</h2>
				<div className="crestron-home-flex">
					<div>
						<h3>Lighting Control</h3>
						<p>
							Create personalized lighting scenes that automatically adapt to
							your activities and lifestyle.
						</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/lighting"
						>
							More
						</TransitionLink>
						<img
							src="https://ghtgroup.com/media/yootheme/cache/91/crestron-solution-hw-lightingcontrol-tan-gold-keypad-918ef6e9.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>Climate Control</h3>
						<p>
							Maintain ideal comfort through intelligent heating, cooling, and
							ventilation automation.
						</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/thermostat"
						>
							More
						</TransitionLink>
						<img
							src="https://www.crestron.com/getattachment/f6f79ade-f705-485c-8286-77e69be50f74/f6f79ade-f705-485c-8286-77e69be50f74.aspx"
							alt=""
						/>
					</div>
					<div>
						<h3>Home Cinema</h3>
						<p>
							Control your entire entertainment experience with a single touch.
						</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/video"
						>
							More
						</TransitionLink>
						<img
							src="https://ghtgroup.com/media/zoo/images/enjoy-effortless-home-control-with-crestron-s-newest-remotes_1484d3df25990bf5e7542f56d54c603f.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>Multi-Room Audio</h3>
						<p>Enjoy synchronized music throughout your property.</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/audio"
						>
							More
						</TransitionLink>
						<img
							src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/featured%20pages%20v2/image-124.png"
							alt=""
						/>
					</div>
					<div>
						<h3>Security & Surveillance</h3>
						<p>Integrate alarms, cameras, sensors, and access control.</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/security"
						>
							More
						</TransitionLink>
						<img
							src="https://essentialinstall.com/wp-content/uploads/2024/08/PR_2024_Crestron_Home_OS4_Updates_3.jpg"
							alt=""
						/>
					</div>
					<div>
						<h3>Motorized Shades</h3>
						<p>Automatically optimize privacy, comfort, and daylight.</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href="/shades"
						>
							More
						</TransitionLink>
						<img
							src="https://www.strata-gee.com/wp-content/uploads/2021/11/Crestron-Battery-Powewred-Shades-with-mobile-UI-2-RS.png"
							alt=""
						/>
					</div>
					<div>
						<h3>Energy Management</h3>
						<p>Improve efficiency while reducing operating costs.</p>
						<TransitionLink
							style={{ alignSelf: "flex-end" }}
							className="link"
							href=""
						>
							More
						</TransitionLink>
						<img
							src="https://www.crestron.com/getattachment/ff40e24d-8f0d-42c4-9762-c4e10b41b352/ff40e24d-8f0d-42c4-9762-c4e10b41b352.aspx"
							alt=""
						/>
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">
					Luxury Home Automation Without Complexity
				</h2>
				<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
					<p>
						Modern homes often contain dozens of disconnected applications and
						devices.
					</p>
					<p>
						Crestron eliminates this complexity by creating a single ecosystem
						where every technology works together.
					</p>
					<img
						style={{ margin: "0 auto" }}
						width={700}
						src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/featured%20pages%20v2/creston%20home%20os4/smart_viewing@2x.png"
						alt=""
					/>
					<p style={{ textAlign: "center" }}>
						<span style={{ whiteSpace: "nowrap" }}>One app.</span>{" "}
						<span style={{ whiteSpace: "nowrap" }}>One interface.</span>{" "}
						<span style={{ whiteSpace: "nowrap" }}>One intelligent home.</span>
					</p>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Intelligent Lighting & Shading</h2>
				<div className="section-container">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "12px" }}
					>
						<p>Crestron automatically adjusts lighting and shades based on:</p>
						<ul className="crestron-home-list">
							<li>occupancy</li>
							<li>daylight</li>
							<li>schedules</li>
							<li>user preferences</li>
						</ul>
						<p>Benefits include:</p>
						<ul className="crestron-home-list">
							<li>increased comfort</li>
							<li>lower energy consumption</li>
							<li>enhanced ambiance</li>
							<li>improved security</li>
						</ul>
					</div>
					<img
						style={{ borderRadius: "10px" }}
						src="https://www.residentialsystems.com/wp-content/uploads/2022/02/Crestron-LED-Color-Tuning-Lifestyle-Image.jpg"
						alt=""
					/>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Home Cinema & Entertainment</h2>
				<div className="section-container">
					<img
						style={{ borderRadius: "10px" }}
						src="https://www.gramophone.com/sites/default/files/wysiwyg/Crestron-home-entertainment.jpg"
						alt=""
					/>
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<p>
							This is a huge opportunity because Crestron is strongly associated
							with premium AV.
						</p>
						<p>
							Create immersive entertainment environments with centralized
							control of:
						</p>
						<ul className="crestron-home-list">
							<li>projectors</li>
							<li>televisions</li>
							<li>surround sound</li>
							<li>media servers</li>
							<li>streaming platforms</li>
						</ul>
						<p>
							One button can instantly prepare your entire cinema experience.
						</p>
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Security & Access Control</h2>
				<div className="section-container">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "12px" }}
					>
						<p>Monitor and control your property from anywhere.</p>
						<p>Integrate:</p>
						<ul className="crestron-home-list">
							<li>smart locks</li>
							<li>intercoms</li>
							<li>surveillance cameras</li>
							<li>alarm systems</li>
							<li>gate control</li>
						</ul>
						<p>into a single platform.</p>
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
						<img src="/11.png" alt="" />
						<img src="/12.png" alt="" />
						<img src="/13.png" alt="" />
						<img src="/14.png" alt="" />
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Designed for Luxury Homes</h2>
				<p>
					Crestron is trusted by architects, interior designers, and homeowners
					around the world for premium residential projects.
				</p>
				<p>
					Whether you're building a new home, renovating a villa, or upgrading
					an existing property, Crestron delivers a future-ready automation
					platform built around your lifestyle.
				</p>
			</section>
			<section className="section">
				<h2 className="section__title">Why Work With P&A Vision?</h2>
				<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
					<p>As an official Loxone Partner, P&A Vision provides:</p>
					<ul className="crestron-home-flex-img">
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
				<h2 className="section__title">Our Crestron Installation Process</h2>
				<div className="crestron-home-flex-process">
					<div>
						<h3>Discovery</h3>
						<p>Understanding your lifestyle and project requirements.</p>
					</div>
					<div>
						<h3>Design</h3>
						<p>Creating a tailored automation strategy.</p>
					</div>
					<div>
						<h3>Integration</h3>
						<p>Professional installation of all connected systems.</p>
					</div>
					<div>
						<h3>Programming</h3>
						<p>Customizing automation logic and user experience.</p>
					</div>
					<div>
						<h3>Testing</h3>
						<p>Ensuring flawless operation.</p>
					</div>
					<div>
						<h3>Support</h3>
						<p>Long-term maintenance and optimization.</p>
					</div>
				</div>
			</section>
			<Faqs faqs={"crestronHome.faqs"} />
		</main>
	);
}
