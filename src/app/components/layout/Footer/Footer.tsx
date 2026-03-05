import Image from "next/image";
import "./Footer.scss";

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer-top">
				<a className="footer__logo" href="">
					<Image src="/logo.svg" width={32} height={32} alt="P&A Vision logo" />
					P&A Vision
				</a>

				<div>
					<p>Navigation</p>
					<ul className="footer-ul">
						<li>
							<a href="">Ůvod</a>
						</li>
						<li>
							<a href="">O nás</a>
						</li>
						<li>
							<a href="">Služby</a>
						</li>
						<li>
							<a href="">Produkty</a>
						</li>
						<li>
							<a href="">Kontakt</a>
						</li>
					</ul>
				</div>
			</div>

			<div className="footer__author">
				<p>&copy; 2026 P&A Vision s.r.o. Všechna práva vyhrazena.</p>
				<p>
					Website created by{" "}
					<a href="https://www.heeeyooo.studio/cs" target="_blank">
						heeeyooo studio
					</a>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
