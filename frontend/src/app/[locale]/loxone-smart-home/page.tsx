import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "./styles.scss";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "lighting.meta" });
	const page = "loxone-smart-home";
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${page}`]),
	);

	return {
		title: "Loxone Smart Home Installation & Automation",
		description:
			"Certified Loxone Partner providing smart home design, installation, and automation solutions. Lighting, climate, security, audio, energy management, and intelligent control systems.",
		alternates: {
			canonical: `/${locale}/${page}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${page}`,
			},
		},
	};
}

export default function LoxoneSmartHome() {
	return (
		<main>
			<h1>Loxone Smart Home Installation & Automation</h1>
			<p>
				Experience complete home automation with Loxone. Control lighting,
				climate, security, shading, audio, and energy management through one
				intelligent system designed around your lifestyle.
			</p>
			<button>Get a Quote</button>
			<button>Explore Loxone Solutions</button>
			<section>
				<h2>Why Choose Loxone?</h2>
				<p>
					Loxone is one of Europe's leading intelligent building automation
					platforms, designed to connect every aspect of your home into a
					single, easy-to-use system.
				</p>
				<p>
					Unlike traditional smart home products that rely on multiple apps and
					disconnected devices, Loxone brings everything together in one
					integrated ecosystem.
				</p>
				<p>Benefits include:</p>
				<ul>
					<li>One app for complete control</li>
					<li>Energy-efficient automation</li>
					<li>Enhanced security</li>
					<li>Increased comfort</li>
					<li>Future-ready scalability</li>
					<li>Reduced operating costs</li>
				</ul>
			</section>
			<section>
				<h2>What Can Loxone Control?</h2>
				<div>
					<div>
						<h3>Smart Lighting</h3>
						<p>
							Automated scenes, dimming, occupancy detection, and
							daylight-responsive control.
						</p>
						<a href=""></a>
					</div>
					<div>
						<h3>Climate Control</h3>
						<p>Heating, cooling, ventilation, and temperature optimization.</p>
						<a href=""></a>
					</div>
					<div>
						<h3>Smart Audio</h3>
						<p>Multi-room audio integrated directly into your smart home.</p>
						<a href=""></a>
					</div>
					<div>
						<h3>Home Access</h3>
						<p>Smart locks, intercoms, keyless entry, and remote access.</p>
						<a href=""></a>
					</div>
					<div>
						<h3>Security</h3>
						<p>
							Motion detection, alarms, surveillance integration, and presence
							simulation.
						</p>
						<a href=""></a>
					</div>
					<div>
						<h3>Smart Shading</h3>
						<p>
							Automated blinds and shading systems for comfort and energy
							efficiency.
						</p>
						<a href=""></a>
					</div>
					<div>
						<h3>Energy Management</h3>
						<p>
							Solar integration, battery management, EV charging, and energy
							monitoring.
						</p>
						<a href=""></a>
					</div>
				</div>
			</section>
			<section>
				<h2>Intelligent Lighting Automation</h2>
				<p>
					Loxone automatically adjusts lighting based on occupancy, daylight
					levels, time of day, and user preferences.
				</p>
				<p>Benefits:</p>
				<ul>
					<li>Automated lighting scenes</li>
					<li>Energy savings</li>
					<li>Improved comfort</li>
					<li>Enhanced security</li>
					<li>Voice and app control</li>
				</ul>
			</section>
			<section>
				<h2>Smarter Heating and Cooling</h2>
				<p>
					Maintain perfect comfort while minimizing energy consumption through
					intelligent climate automation.
				</p>
				<p>Features:</p>
				<ul>
					<li>Smart thermostats</li>
					<li>Room-by-room control</li>
					<li>Automated schedules</li>
					<li>Weather-based optimization</li>
					<li>Energy-efficient operation</li>
				</ul>
			</section>
			<section>
				<h2>Intelligent Home Protection</h2>
				<p>
					Integrate access control, alarms, cameras, and monitoring into one
					secure platform.
				</p>
				<ul>
					<li>Smart locks</li>
					<li>Video intercoms</li>
					<li>Presence simulation</li>
					<li>Alarm notifications</li>
					<li>Remote monitoring</li>
				</ul>
			</section>
			<section>
				<h2>Optimize Energy Consumption</h2>
				<p>Monitor and automate energy use across your property.</p>
				<p>Capabilities:</p>
				<ul>
					<li>Solar management</li>
					<li>Battery storage optimization</li>
					<li>EV charger integration</li>
					<li>Consumption monitoring</li>
					<li>Automated energy balancing</li>
				</ul>
			</section>
			<section>
				<h2>Why Work With P&A Vision?</h2>
				<p>As an official Loxone Partner, P&A Vision provides:</p>
				<ul>
					<li>Consultation</li>
					<li>System design</li>
					<li>Professional installation</li>
					<li>Programming</li>
					<li>Commissioning</li>
					<li>Ongoing support</li>
				</ul>
				<p>
					We create intelligent homes tailored to each client's lifestyle,
					ensuring reliability, scalability, and exceptional user experience.
				</p>
			</section>
			<section>
				<h2>Our Loxone Installation Process</h2>
				<div>
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
			<section>
				<h2>FAQs</h2>
				<div>
					<div>
						<h3>Is Loxone better than traditional smart home systems?</h3>
						<p>
							Loxone focuses on true automation rather than simple remote
							control, reducing the need for manual interaction.
						</p>
					</div>
					<div>
						<h3>Can Loxone integrate with solar panels?</h3>
						<p>
							Yes. Loxone supports advanced energy management and solar
							integration.
						</p>
					</div>
					<div>
						<h3>Does Loxone work with smart lighting?</h3>
						<p>Yes. Lighting automation is one of Loxone's core strengths.</p>
					</div>
					<div>
						<h3>Can Loxone control heating and cooling?</h3>
						<p>
							Yes. It provides intelligent climate management across the entire
							property.
						</p>
					</div>
					<div>
						<h3>Is Loxone suitable for luxury homes?</h3>
						<p>
							Absolutely. Loxone is widely used in premium residential projects
							throughout Europe.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
