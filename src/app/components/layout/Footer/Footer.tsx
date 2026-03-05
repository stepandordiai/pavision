import "./Footer.scss";

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer-top">
				<a className="footer__logo" href="">
					<svg
						width="32"
						height="32"
						viewBox="0 0 256 256"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M128.001 0C139.977 64.8783 191.122 116.025 256 128.001C191.123 139.978 139.978 191.123 128.001 256C116.025 191.122 64.8783 139.977 0 128.001C64.8791 116.026 116.026 64.8791 128.001 0Z"
							fill="currentColor"
						/>
					</svg>
					<span>P&A Vision</span>
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
