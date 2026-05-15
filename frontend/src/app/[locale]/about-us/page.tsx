import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PersonIcon from "@/components/icons/PersonIcon";
import TelIcon from "@/components/icons/TelIcon";
import EnvelopeIcon from "@/components/icons/EnvelopeIcon";
import "./AboutUs.scss";

const team = [
	{
		name: "Oleksandr Honcharenko",
		position: "aboutUs.ourTeam.programmer",
		tel: "+420 777 049 617",
		email: "alex@pavision.cz",
	},
	{
		name: "Petr Fojtů",
		position: "aboutUs.ourTeam.programmer",
		tel: "+420 775 632 426",
		email: "petr.fojtu@pavision.cz",
	},
	{
		name: "John Doe",
		position: "aboutUs.ourTeam.manager",
		tel: "+420 775 632 426",
		email: "info@pavision.cz",
	},
	{
		name: "John Doe",
		position: "aboutUs.ourTeam.electricar",
		tel: "+420 775 632 426",
		email: "info@pavision.cz",
	},
];

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "aboutUs.meta" });
	const page = "about-us";
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

export default async function AboutUs() {
	const t = await getTranslations();

	return (
		<main className="main">
			<h1 className="main__title">{t("aboutUsTitle")}</h1>
			<section
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
					marginBottom: "80px",
				}}
				aria-labelledby="who-we-are"
			>
				<h2
					id="who-we-are"
					style={{
						background: "#000",
						padding: 10,
						borderRadius: 10,
						width: "max-content",
					}}
				>
					Who we are
				</h2>
				{t.raw("home.whoWeAreDesc").map((txt: string, i: number) => {
					return <p key={i}>{txt}</p>;
				})}
			</section>
			<section
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
					marginBottom: "80px",
				}}
				aria-labelledby="our-team"
			>
				<h2
					id="our-team"
					style={{
						background: "#000",
						padding: 10,
						borderRadius: 10,
						width: "max-content",
					}}
				>
					{t("aboutUs.ourTeam.title")}
				</h2>
				<div className="team-container">
					{team.map((member, i) => {
						return (
							<div key={i} className="member-card">
								<div className="member-img">
									<PersonIcon />
								</div>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										gap: "10px",
										flexWrap: "wrap",
									}}
								>
									<div>
										<p>{member.name}</p>
										<p>{t(member.position)}</p>
									</div>
									<div style={{ display: "flex", gap: 5 }}>
										<a className="member-link" href={`tel:${member.tel}`}>
											<TelIcon size={20} />
										</a>
										<a className="member-link" href={`mailto:${member.email}`}>
											<EnvelopeIcon size={20} />
										</a>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</main>
	);
}
