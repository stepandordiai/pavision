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

const faqs = [
	{
		title: "What is Crestron Home?",
		description:
			"Crestron Home is a premium automation platform that connects lighting, climate, entertainment, security, and shading into one intelligent system.",
	},
	{
		title: "Is Crestron suitable for luxury homes?",
		description:
			"Yes. Crestron is widely used in luxury residential projects, villas, penthouses, and premium developments worldwide.",
	},
	{
		title: "Can Crestron integrate with existing systems?",
		description:
			"In many cases, yes. Crestron supports integration with a wide range of third-party technologies.",
	},
	{
		title: "Can I control my home remotely?",
		description:
			"Yes. Crestron allows secure remote access through mobile devices.",
	},
	{
		title: "Is Crestron better than multiple smart home apps?",
		description:
			"Crestron's advantage is centralization. Instead of managing numerous apps, users control all systems from one platform.",
	},
];

export default function CrestronHome() {
	return (
		<main>
			<h1>Crestron Home Automation & Smart Living</h1>
			<p>
				Experience complete control of your home through one intelligent
				platform. Crestron seamlessly integrates lighting, climate, security,
				entertainment, shading, and access control into a single luxury smart
				home experience.
			</p>
			<button>Get a Quote</button>
			<button>Explore Crestron Solutions</button>
			<section>
				<h2>Why Choose Crestron?</h2>
				<p>
					Crestron is one of the world's most trusted automation platforms for
					luxury homes, premium residences, and intelligent buildings.
				</p>
				<p>
					Designed to deliver reliability, performance, and exceptional user
					experience, Crestron brings every system in your property together
					under one intuitive interface.
				</p>
				<p>
					Unlike standalone smart devices, Crestron provides a fully integrated
					ecosystem that simplifies daily living while enhancing comfort,
					security, and efficiency.
				</p>
			</section>
			<section>
				<h2>What Can Crestron Control?</h2>
				<div>
					<div>
						<h3>Lighting Control</h3>
						<p>
							Create personalized lighting scenes that automatically adapt to
							your activities and lifestyle.
						</p>
					</div>
					<div>
						<h3>Climate Control</h3>
						<p>
							Maintain ideal comfort through intelligent heating, cooling, and
							ventilation automation.
						</p>
					</div>
					<div>
						<h3>Home Cinema</h3>
						<p>
							Control your entire entertainment experience with a single touch.
						</p>
					</div>
					<div>
						<h3>Multi-Room Audio</h3>
						<p>Enjoy synchronized music throughout your property.</p>
					</div>
					<div>
						<h3>Security & Surveillance</h3>
						<p>Integrate alarms, cameras, sensors, and access control.</p>
					</div>
					<div>
						<h3>Motorized Shades</h3>
						<p>Automatically optimize privacy, comfort, and daylight.</p>
					</div>
					<div>
						<h3>Energy Management</h3>
						<p>Improve efficiency while reducing operating costs.</p>
					</div>
				</div>
			</section>
			<section>
				<h2>Luxury Home Automation Without Complexity</h2>
				<p>
					Modern homes often contain dozens of disconnected applications and
					devices.
				</p>
				<p>
					Crestron eliminates this complexity by creating a single ecosystem
					where every technology works together.
				</p>
				<p>One app.</p>
				<p>One interface.</p>
				<p>One intelligent home.</p>
			</section>
			<section>
				<h2>Intelligent Lighting & Shading</h2>
				<p>Crestron automatically adjusts lighting and shades based on:</p>
				<ul>
					<li>occupancy</li>
					<li>daylight</li>
					<li>schedules</li>
					<li>user preferences</li>
				</ul>
				<p>Benefits include:</p>
				<ul>
					<li>increased comfort</li>
					<li>lower energy consumption</li>
					<li>enhanced ambiance</li>
					<li>improved security</li>
				</ul>
			</section>
			<section>
				<h2>Home Cinema & Entertainment</h2>
				<p>
					This is a huge opportunity because Crestron is strongly associated
					with premium AV.
				</p>
				<p>
					Create immersive entertainment environments with centralized control
					of:
				</p>
				<ul>
					<li>projectors</li>
					<li>televisions</li>
					<li>surround sound</li>
					<li>media servers</li>
					<li>streaming platforms</li>
				</ul>
				<p>One button can instantly prepare your entire cinema experience.</p>
			</section>
			<section>
				<h2>Security & Access Control</h2>
				<p>Monitor and control your property from anywhere.</p>
				<p>Integrate:</p>
				<ul>
					<li>smart locks</li>
					<li>intercoms</li>
					<li>surveillance cameras</li>
					<li>alarm systems</li>
					<li>gate control</li>
				</ul>
				<p>into a single platform.</p>
			</section>
			<section>
				<h2>Designed for Luxury Homes</h2>
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
			<section>
				<h2>Why Work With P&A Vision?</h2>
				<p>As a Crestron integration specialist, P&A Vision provides:</p>
				<ul>
					<li>Consultation</li>
					<li>System Design</li>
					<li>Installation</li>
					<li>Programming</li>
					<li>Commissioning</li>
					<li>Ongoing Support</li>
				</ul>
				<p>
					Every project is designed around the client's specific requirements to
					ensure exceptional performance, reliability, and ease of use.
				</p>
			</section>
			<section>
				<h2>Our Crestron Installation Process</h2>
				<div>
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
			<section>
				<h2></h2>
				<div>
					{faqs.map((f, i) => {
						return (
							<div key={i}>
								<h3>{f.title}</h3>
								<p>{f.description}</p>
							</div>
						);
					})}
				</div>
			</section>
		</main>
	);
}
