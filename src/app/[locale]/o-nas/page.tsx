import { getTranslations } from "next-intl/server";
import "./AboutUs.scss";

export default async function AboutUs() {
	const t = await getTranslations();

	return (
		<main className="about-us">
			<h1>{t("home.whoWeAreDesc")}</h1>
		</main>
	);
}
