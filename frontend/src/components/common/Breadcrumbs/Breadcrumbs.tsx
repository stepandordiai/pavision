"use client";

import { TransitionLink } from "@/components/TransitionLink";
import { usePathname } from "@/i18n/navigation";
import "./styles.scss";

type BreadcrumbsProps = {
	currentPage: string;
	currentPageUrl: string;
};

export default function Breadcrumbs({
	currentPage,
	currentPageUrl,
}: BreadcrumbsProps) {
	const pathname = usePathname();

	return (
		<div className="breadcrumbs">
			<TransitionLink className="breadcrumbs__link" href="/">
				Home
			</TransitionLink>
			<TransitionLink
				className={`breadcrumbs__link ${pathname === `${currentPageUrl}` ? "breadcrumbs__link--active" : ""}`}
				href={currentPageUrl}
			>
				{currentPage}
			</TransitionLink>
		</div>
	);
}
