import { getTranslations } from "next-intl/server";
import EnvelopeIcon from "@/components/icons/EnvelopeIcon";
import TelIcon from "@/components/icons/TelIcon";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import ContactsClient from "./ContactsClient";
import Breadcrumbs from "@/components/common/Breadcrumbs/Breadcrumbs";
import "./Contacts.scss";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "contacts.meta" });
	const page = "contacts";
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${page}`]),
	);

	return {
		title: t("title"),
		description: t("desc"),
		alternates: {
			canonical: `/${locale}/${page}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${page}`,
			},
		},
	};
}

export default function Contacts() {
	return (
		<main className="contacts">
			<Breadcrumbs currentPage="Kontakty" />
			<div className="contacts-inner">
				<div className="contacts-details">
					<h1 className="contacts__title">
						Rádi s vámi probereme váš projekt – první konzultace je zdarma
					</h1>
					<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
						<div
							style={{
								display: "flex",
								alignItems: "flex-start",
								flexDirection: "column",
								gap: 10,
							}}
						>
							<div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: 10,
										marginBottom: 10,
									}}
								>
									<TelIcon />
									<h2 style={{ fontSize: "18px", fontWeight: 500 }}>
										Zavolejte nam
									</h2>
								</div>
								<p>
									Zavolejte během pracovní doby a získejte bezplatnou
									konzultaci.
								</p>
							</div>
							<div className="contacts-card">
								<p style={{ fontSize: "18px", fontWeight: 500 }}>Petr Fojtů</p>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
									}}
								>
									<a className="link" href="mailto:petr.fojtu@pavision.cz">
										petr.fojtu@pavision.cz
									</a>
									<a className="link" href="tel:+420775632426">
										+420 775 632 426
									</a>
								</div>
							</div>
							<div className="contacts-card">
								<p style={{ fontSize: "18px", fontWeight: 500 }}>
									Oleksandr Honcharenko
								</p>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
									}}
								>
									<a className="link" href="mailto:petr.fojtu@pavision.cz">
										alex@pavision.cz
									</a>
									<a className="link" href="tel:+420777049617">
										+420 777 049 617
									</a>
								</div>
							</div>
						</div>
						<div
							style={{
								display: "flex",
								alignItems: "flex-start",
								flexDirection: "column",
								gap: 10,
							}}
						>
							<div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: 10,
										marginBottom: 10,
									}}
								>
									<EnvelopeIcon />
									<h2 style={{ fontSize: "18px", fontWeight: 500 }}>
										Napiste nam
									</h2>
								</div>
								<p>Odpovíme vám do 12 hodin</p>
							</div>
							<a className="link" href="mailto:info@pavision.cz">
								info@pavision.cz
							</a>
						</div>
					</div>
					<div style={{ marginTop: "auto" }}>
						<h2 style={{ fontSize: "18px", fontWeight: 500 }}>Sledujte nas</h2>
						<div>
							<a
								className="contacts-details__link"
								href="https://www.instagram.com/pa_vision.cz"
								target="_blank"
							>
								Instagram
							</a>
							,
						</div>
					</div>
				</div>
				<div className="contacts-form">
					<ContactsClient />
				</div>
			</div>
		</main>
	);
}
