import { TransitionLink } from "@/components/TransitionLink";
import { BASE_URL } from "@/lib/constants";
import { getTranslations } from "next-intl/server";
import "./styles.scss";

interface Breadcrumb {
	label: string;
	href?: string;
}

type BreadcrumbsProps = {
	links: Breadcrumb[];
	locale: string;
};

export default async function Breadcrumbs({ links, locale }: BreadcrumbsProps) {
	const t = await getTranslations({ locale });

	// TODO: learn this
	// BreadcrumbList
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: t("nav.home"),
				item: `${BASE_URL}/${locale}`,
			},
			...links.map((link, i) => ({
				"@type": "ListItem",
				position: i + 2, // +2 because Home is position 1
				name: link.label,
				...(link.href && { item: `${BASE_URL}/${locale}${link.href}` }),
			})),
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<nav className="breadcrumbs">
				<ol className="breadcrumbs-list">
					<li>
						<TransitionLink className="breadcrumbs__link" href="/">
							{t("nav.home")}
						</TransitionLink>
					</li>
					{links.map((link, i) => {
						const isLastLink = i === links.length - 1;

						return (
							<li key={i}>
								{!isLastLink && link.href ? (
									<TransitionLink
										className="breadcrumbs__link"
										href={link.href}
									>
										{link.label}
									</TransitionLink>
								) : (
									<span
										style={{
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
										className="breadcrumbs__link breadcrumbs__link--active"
									>
										{link.label}
									</span>
								)}
							</li>
						);
					})}
				</ol>
			</nav>
		</>
	);
}
