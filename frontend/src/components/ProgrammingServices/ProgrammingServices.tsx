import { getTranslations } from "next-intl/server";
import { TransitionLink } from "../TransitionLink";
import "./styles.scss";

export default async function ProgrammingServices() {
	const t = await getTranslations("programmingServices");
	return (
		<section className="programming-services">
			<h2 className="section__title">{t("title")}</h2>
			<div className="programming-services-container">
				<div className="programming-services-container-inner">
					<TransitionLink
						className="programming-services__link"
						href="/appointment"
					>
						<img
							src="https://dominiontx.com/wp-content/uploads/2017/12/Crestron-PNG.png"
							alt=""
						/>
					</TransitionLink>
					<TransitionLink
						className="programming-services__link"
						href="/appointment"
					>
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/c/c6/Logo-Loxone-green-Web.png"
							alt=""
						/>
					</TransitionLink>
					<TransitionLink
						className="programming-services__link"
						href="/appointment"
					>
						<img
							src="https://www.blindsanddesignsltd.com/wp-content/uploads/sites/433/2019/04/logo-lutron.png"
							alt=""
						/>
					</TransitionLink>
					<TransitionLink
						className="programming-services__link"
						href="/appointment"
					>
						Data Engineering
					</TransitionLink>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
						justifyContent: "space-between",
					}}
				>
					<TransitionLink
						className="programming-services__link-btn"
						href="/appointment"
					>
						{t("bookTheProgrammer")}
					</TransitionLink>
					{/* <div style={{ display: "flex", gap: "10px" }}>
						<img
							style={{ borderRadius: "50%", objectFit: "cover" }}
							src="https://backend.edukee.cz/uploads/U_4f2dbd7443.jpeg"
							alt=""
							width={50}
							height={50}
						/>
						<span style={{ display: "flex", flexDirection: "column" }}>
							<span>Petro</span>
							<span>Programmer</span>
						</span>
					</div> */}
				</div>
			</div>
		</section>
	);
}
