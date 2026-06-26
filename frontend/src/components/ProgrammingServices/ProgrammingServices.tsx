import { Link } from "@/i18n/navigation";
import "./styles.scss";

export default function ProgrammingServices() {
	return (
		<section className="programming-services">
			<h2 className="section__title">Programming Services</h2>
			<div className="programming-services-container">
				<div className="programming-services-container-inner">
					<Link className="programming-services__link" href="/">
						<img
							src="https://dominiontx.com/wp-content/uploads/2017/12/Crestron-PNG.png"
							alt=""
						/>
					</Link>
					<Link className="programming-services__link" href="/">
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/c/c6/Logo-Loxone-green-Web.png"
							alt=""
						/>
					</Link>
					<Link className="programming-services__link" href="/">
						<img
							src="https://www.blindsanddesignsltd.com/wp-content/uploads/sites/433/2019/04/logo-lutron.png"
							alt=""
						/>
					</Link>
					<Link className="programming-services__link" href="/">
						Data Engineering
					</Link>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
						justifyContent: "space-between",
					}}
				>
					<Link className="programming-services__link-btn" href="/">
						Book the Programmer
					</Link>
					<div style={{ display: "flex", gap: "10px" }}>
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
					</div>
				</div>
			</div>
		</section>
	);
}
