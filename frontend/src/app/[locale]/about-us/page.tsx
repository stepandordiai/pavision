import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "./AboutUs.scss";
import PersonIcon from "@/components/icons/PersonIcon";
import TelIcon from "@/components/icons/TelIcon";
import EnvelopeIcon from "@/components/icons/EnvelopeIcon";

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

const team = [
	{
		name: "John Doe",
		position: "Programmer",
		tel: "+420 775 632 426",
		email: "info@pavision.cz",
	},
	{
		name: "John Doe",
		position: "Programmer",
		tel: "+420 775 632 426",
		email: "info@pavision.cz",
	},
	{
		name: "John Doe",
		position: "Manager",
		tel: "+420 775 632 426",
		email: "info@pavision.cz",
	},
	{
		name: "John Doe",
		position: "Electricar",
		tel: "+420 775 632 426",
		email: "info@pavision.cz",
	},
];

export default async function AboutUs() {
	const t = await getTranslations();

	return (
		<main className="main">
			<h1 className="main__title">{t("aboutUsTitle")}</h1>
			<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
				{t.raw("home.whoWeAreDesc").map((txt: string, i: number) => {
					return <p key={i}>{txt}</p>;
				})}
			</div>
			<h2 className="main__title">Meet our team</h2>
			<div className="team-container">
				{team.map((member, i) => {
					return (
						<div key={i} className="member-card">
							<div className="member-img">
								<PersonIcon />
							</div>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<div>
									<p>{member.name}</p>
									<p>{member.position}</p>
								</div>
								<div style={{ height: "100%", display: "flex", gap: 5 }}>
									<a className="member-link" href={`tel:${member.tel}`}>
										<TelIcon size={20} />
									</a>
									<a className="member-link" href={`email:${member.email}`}>
										<EnvelopeIcon size={20} />
									</a>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
}
