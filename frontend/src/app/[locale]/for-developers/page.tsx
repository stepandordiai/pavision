import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HeroParallax from "@/components/HeroParallax/HeroParallax";
import Faqs from "@/components/Faqs/Faqs";
import Brands from "@/components/Brands/Brands";
import SmartHomeHub from "./SmartHomeHub";
import "./styles.scss";

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
			<Faqs faqs={"forDevs.faqs"} />
		</main>
	);
}
