import { TransitionLink } from "@/components/TransitionLink";
import "./styles.scss";

type BreadcrumbsProps = {
	currentPage: string;
	prevPage?: string;
	prevPageUrl?: string;
};

export default function Breadcrumbs({
	currentPage,
	prevPage,
	prevPageUrl,
}: BreadcrumbsProps) {
	return (
		<div className="breadcrumbs">
			<TransitionLink className="breadcrumbs__link" href="/">
				Home
			</TransitionLink>
			{prevPage && prevPageUrl && (
				<TransitionLink className="breadcrumbs__link" href={prevPageUrl}>
					{prevPage}
				</TransitionLink>
			)}
			<span className="breadcrumbs__link breadcrumbs__link--active">
				{currentPage}
			</span>
		</div>
	);
}
