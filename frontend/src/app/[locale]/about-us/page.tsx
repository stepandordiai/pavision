import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PersonFillIcon from "@/components/icons/PersonFillIcon";
import TelIcon from "@/components/icons/TelIcon";
import EnvelopeIcon from "@/components/icons/EnvelopeIcon";
import Breadcrumbs from "@/components/common/Breadcrumbs/Breadcrumbs";
import "./AboutUs.scss";

const team = [
	{
		name: "Oleksandr Honcharenko",
		position: "aboutUs.ourTeam.programmer",
		tel: "+420777049617",
		email: "alex@pavision.cz",
	},
	{
		name: "Petr Fojtů",
		position: "aboutUs.ourTeam.programmer",
		tel: "+420775632426",
		email: "petr.fojtu@pavision.cz",
	},
	{
		name: "Stepan Dordiai",
		position: "aboutUs.ourTeam.programmer",
		email: "stepan.dordiai@pavision.cz",
	},
];

const PAGE = "about-us";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "aboutUs.meta" });
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${PAGE}`]),
	);

	return {
		title: t("title"),
		description: t("desc"),
		alternates: {
			canonical: `/${locale}/${PAGE}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${PAGE}`,
			},
		},

		openGraph: {
			title: t("title"),
			description: t("desc"),
			url: `/${locale}/${PAGE}`,
			type: "website",
			images: "/pavision-og.png",
		},
	};
}

export default async function AboutUs({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale });

	return (
		<main className="about-us">
			<Breadcrumbs links={[{ label: t("nav.aboutUs") }]} locale={locale} />
			<div style={{ padding: "0 20px 20px" }}>
				<h1 className="main__title">{t("aboutUs.title")}</h1>
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
						{t("aboutUs.whoWeAre.title")}
					</h2>
					{t.raw("aboutUs.whoWeAre.desc").map((txt: string, i: number) => {
						return (
							<p style={{ maxWidth: "1000px" }} key={i}>
								{txt}
							</p>
						);
					})}
				</section>
				<section
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
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
										<PersonFillIcon size={"100%"} />
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
											{member.tel && (
												<a className="member-link" href={`tel:${member.tel}`}>
													<TelIcon size={20} />
												</a>
											)}
											<a
												className="member-link"
												href={`mailto:${member.email}`}
											>
												<EnvelopeIcon size={20} />
											</a>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</section>
			</div>
		</main>
	);
}
