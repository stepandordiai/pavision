import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import Faqs from "@/components/Faqs/Faqs";
import Brands from "@/components/Brands/Brands";
import SmartHomeHub from "./SmartHomeHub";
import "./styles.scss";

const faqs = [
	{
		q: "When should smart wiring be planned in a development project?",
		a: "Ideally in the design phase. Specifying the cabling and system topology before construction avoids costly retrofits and keeps the per-unit price predictable.",
	},
	{
		q: "How does automation lower the cost of a build?",
		a: "Loxone Tree uses a single free-form bus instead of star wiring, cutting cabling effort by up to 80% versus a classic new-build installation. One integrated system also replaces several separate ones, reducing material and the number of trades on site.",
	},
	{
		q: "Do you provide project documentation and inspections?",
		a: "Yes. We deliver design drawings, standards, material take-offs, ČSN inspection reports and full handover documentation, and coordinate with the building's MEP, construction and IT.",
	},
	{
		q: "What does smart automation cost per unit?",
		a: "It depends on the scope and tier. We define a repeatable standard per unit type, so you get a fixed per-unit price that scales predictably across the whole building.",
	},
	{
		q: "Can one system scale across different unit types?",
		a: "Yes. The same platform runs from a studio to a penthouse — you only pay for the scope each unit needs, with a consistent standard across the project.",
	},
	{
		q: "Can buyers extend or customise their unit after moving in?",
		a: "Yes. Loxone Air adds wireless devices without construction work, so residents can expand lighting, sensors or controls later without new cabling.",
	},
	{
		q: "Does the system support energy metering and remote readings?",
		a: "Yes. We integrate energy monitoring and remote meter readings for heat, hot and cold water — increasingly relevant as EU and Czech regulation moves toward mandatory remote metering in new buildings.",
	},
	{
		q: "Do you coordinate with the construction schedule and other trades?",
		a: "Yes. We work in phases alongside the build — design, rough-in, fit-out, configuration, inspection and handover — and coordinate directly with the other professions on site.",
	},
	{
		q: "Does automation help units sell?",
		a: "Smart features are increasingly expected in new builds and help differentiate units, support premium pricing and appeal to energy-conscious buyers.",
	},
	{
		q: "Where do you work?",
		a: "Across the Czech Republic and the wider EU, for residential developments, apartment buildings and commercial projects.",
	},
];

const PAGE = "for-developers";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "forDevs.meta" });
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
	};
}

export default async function ForDevs() {
	const t = await getTranslations();

	return (
		<main>
			<HeroParallax
				heading={t("forDevs.heading")}
				subheading={t("forDevs.subheading")}
				imgSrc="/15.jpg"
				secondaryBtnTxt="Explore Loxone Solutions"
				currentPage={t("nav.forDevs")}
				currentPageUrl="/loxone-smart-home"
			/>
			<section className="section">
				<h2 className="section__title">
					Proč chytré technologie zvyšují hodnotu projektu
				</h2>
				<div>
					<p>Buyers now expect smart features in new builds</p>
					<p>Automated units command higher resale and sell faster</p>
					<p>Future‑proof/scalable infrastructure</p>
					<p>Energy efficiency aligned with EU regulation</p>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Co pro developery zajišťujeme</h2>
				<ul>
					<li>
						Projektová dokumentace a koordinace profesí (návrh, výkresy,
						standardy, výkazy materiálu, koordinace s TZB / stavbou / IT)
					</li>
					<li>
						Silnoproud i slaboproud, hlavní rozvaděče, společné prostory,
						garáže, jednotky
					</li>
					<li>
						Integrace Loxone / Crestron / Lutron — osvětlení, vytápění, stínění,
						přístup, bezpečnost, AV
					</li>
					<li>Síťová infrastruktura (Ubiquiti / MikroTik / Cisco)</li>
					<li>
						Měření a dálkové odečty energií (relevant — EU/legislativa směřuje k
						povinným dálkovým odečtům)
					</li>
					<li>Výchozí revize dle ČSN, dokumentace, předání</li>
					<li>Záruční i pozáruční servis</li>
				</ul>
			</section>
			<section className="section">
				<SmartHomeHub />
			</section>

			<section className="section">
				<h2 className="section__title">Jak snižujeme náklady na realizaci</h2>
				<ul>
					<li>
						Loxone Tree topologie — jedna sběrnice místo hvězdicové kabeláže, až
						80 % úspora kabeláže oproti klasické instalaci v novostavbě
						(Loxone's own platform figure — safe to cite as platform capability,
						not your track record).
					</li>
					<li>
						Jeden integrovaný systém místo několika oddělených (osvětlení +
						stínění + topení + zabezpečení + AV) → nižší materiál, méně profesí,
						jedna zodpovědnost.
					</li>
					<li>
						Standardizace napříč jednotkami — jeden ověřený standard bytu
						opakovaně nasazený = nižší cena za jednotku, předvídatelný rozpočet.
					</li>
					<li>
						Škálovatelnost — od studentského bytu po penthouse na stejné
						platformě; developer platí jen za rozsah, který chce.
					</li>
					<li>
						Bezdrátové rozšíření (Loxone Air) — pozdější dovybavení bez
						stavebních zásahů, žádné dodatečné kabely.
					</li>
					<li>
						Návrh i realizace u jednoho dodavatele — odpadají koordinační ztráty
						a duplicity mezi projektantem a realizací.
					</li>
				</ul>
			</section>
			<section className="section">
				<h2 className="section__title">Spolupráce ve fázích výstavby</h2>
				<div className="for-devs-flex-process">
					<div>
						<span>Step 1</span>
						<p>Projektová fáze</p>
					</div>
					<div>
						<span>Step 2</span>
						<p>Hrubá stavba (kabeláž)</p>
					</div>
					<div>
						<span>Step 3</span>
						<p>Kompletace</p>
					</div>
					<div>
						<span>Step 4</span>
						<p>Konfigurace</p>
					</div>
					<div>
						<span>Step 5</span>
						<p>Revize</p>
					</div>
					<div>
						<span>Step 6</span>
						<p>Předání</p>
					</div>
					<div>
						<span>Step 6</span>
						<p>Servis</p>
					</div>
				</div>
			</section>
			<section className="section">
				<h2 className="section__title">Jak probíhá spolupráce</h2>
				<ul>
					<li>pošlete podklady (PDF/DWG)</li>
					<li>technický návrh + rozpočet</li>
					<li>realizace</li>
					<li>předání a servis</li>
				</ul>
			</section>
			<section className="section">
				<h2 className="section__title">Reference</h2>
			</section>
			<Brands />
			<Faqs faqs={faqs} />
		</main>
	);
}
