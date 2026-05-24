import { useTranslations } from "next-intl";
import TechnologiesClient from "./TechnologiesClient";
import "./Technologies.scss";

const Technologies = () => {
	const t = useTranslations();

	return (
		<section style={{ overflow: "hidden" }} className="section">
			<h2 className="section__title">{t("home.technologies")}</h2>
			<div className="technologies">
				<TechnologiesClient />
			</div>
		</section>
	);
};

export default Technologies;
