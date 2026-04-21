import "./styles.scss";

export default function PrivacyPolicy() {
	return (
		<main className="main">
			<h1 className="main__title">Privacy Policy</h1>
			<p>Last updated: 10 April 2026</p>
			<br />
			<ol className="privacy-policy-ol">
				<li>
					<span style={{ fontSize: "1.5rem" }}>Introduction</span>
					<p>
						Welcome to [Your Company Name] (“we”, “us”, “our”). We provide smart
						home solutions, including automation systems, installation services,
						internet-connected cameras, and related technologies.
						<br />
						<br />
						We are committed to protecting your personal data and respecting
						your privacy in compliance with the General Data Protection
						Regulation (GDPR) and applicable European laws.
					</p>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>Data Controller</span>
					<p>Company Name: P&A Vision s.r.o.</p>
					<p>Address: Soběslavova 1381, Kročehlavy, 272 01 Kladno</p>
					<p>
						Email:{" "}
						<a className="link" href="mailto:info@pavision.cz">
							info@pavision.cz
						</a>
					</p>
					<p>
						Phone:{" "}
						<a className="link" href="tel:+420775632426">
							+420 775 632 426
						</a>
					</p>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>What Data We Collect</span>
					<p>
						We may collect and process the following types of personal data:
					</p>
					<ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
						<li>
							<span style={{ fontWeight: 500, fontSize: "1rem" }}>
								Contact Information
							</span>
							<ul>
								<li>Name</li>
								<li>Email address</li>
								<li>Phone number</li>
								<li>Address</li>
							</ul>
						</li>
						<li>
							<span style={{ fontWeight: 500, fontSize: "1rem" }}>
								Service-Related Data
							</span>
							<ul>
								<li>Property details relevant to installation</li>
								<li>Smart home device configurations</li>
								<li>System usage data (if applicable)</li>
							</ul>
						</li>
						<li>
							<span style={{ fontWeight: 500, fontSize: "1rem" }}>
								Technical Data
							</span>
							<ul>
								<li>IP address</li>
								<li>Browser type and version</li>
								<li>Device information</li>
								<li>Cookies and tracking data</li>
							</ul>
						</li>
						<li>
							<span style={{ fontWeight: 500, fontSize: "1rem" }}>
								Security System Data (if applicable)
							</span>
							<ul>
								<li>
									Camera system configuration (not video content unless
									explicitly agreed)
								</li>
								<li>Access logs</li>
								<li>System diagnostics</li>
							</ul>
						</li>
					</ul>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>How We Use Your Data</span>
					<p>We use your personal data to:</p>
					<ul className="disc-list">
						<li>Provide and install smart home systems</li>
						<li>Maintain and support your devices</li>
						<li>Respond to inquiries and customer support requests</li>
						<li>Improve our services and website</li>
						<li>Ensure system security and prevent fraud</li>
						<li>Comply with legal obligations</li>
					</ul>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>Legal Basis for Processing</span>
					<p>We process your data under the following legal bases:</p>
					<ul className="disc-list">
						<li>Contractual necessity - to provide agreed services</li>
						<li>Legitimate interests - improving services and security</li>
						<li>
							Consent - for marketing communications or optional data collection
						</li>
						<li>Legal obligation - compliance with EU laws</li>
					</ul>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>Sharing Your Data</span>
					<p>We may share your data with:</p>
					<ul className="disc-list">
						<li>Installation partners and technicians</li>
						<li>IT and cloud service providers</li>
						<li>Security and monitoring service providers</li>
						<li>Legal authorities (when required by law)</li>
					</ul>
					<p style={{ paddingTop: 10 }}>
						We ensure all third parties comply with GDPR.
					</p>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>Data Retention</span>
					<p>We retain your data only as long as necessary:</p>
					<ul className="disc-list">
						<li>Service data: duration of contract + legal retention period</li>
						<li>Contact data: until request deletion or inactivity</li>
						<li>Technical logs: typically 6–24 months</li>
					</ul>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>Your Rights (GDPR)</span>
					<p>You have the right to:</p>
					<ul className="disc-list">
						<li>Access your personal data</li>
						<li>Correct inaccurate data</li>
						<li>Request deletion (“right to be forgotten”)</li>
						<li>Restrict processing</li>
						<li>Data portability</li>
						<li>Withdraw consent at any time</li>
						<li>Lodge a complaint with a data protection authority</li>
					</ul>
					<p style={{ paddingTop: 10 }}>
						To exercise your rights, contact us at:{" "}
						<a className="link" href="mailto:info@pavision.cz">
							info@pavision.cz
						</a>
					</p>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>Security Measures</span>
					<p>
						We implement appropriate technical and organizational measures,
						including:
					</p>
					<ul className="disc-list">
						<li>Encryption of data transmission</li>
						<li>Secure authentication systems</li>
						<li>Access control and monitoring</li>
						<li>Regular system updates</li>
					</ul>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>Smart Devices & Cameras</span>
					<p>If you use our smart home or camera systems:</p>
					<ul className="disc-list">
						<li>
							You are responsible for how devices are used on your property
						</li>
						<li>
							We do not access live camera feeds unless explicitly agreed for
							support
						</li>
						<li>
							We recommend informing visitors about camera usage where legally
							required
						</li>
					</ul>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>Cookies</span>
					<p>Our website uses cookies to:</p>
					<ul className="disc-list">
						<li>Improve user experience</li>
						<li>Analyze website traffic</li>
						<li>Store user preferences</li>
					</ul>
					<p style={{ paddingTop: 10 }}>
						You can manage cookies through your browser settings.
					</p>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>
						International Data Transfers
					</span>
					<p>
						If data is transferred outside the European Economic Area (EEA), we
						ensure:
					</p>
					<ul className="disc-list">
						<li>Adequate safeguards (e.g., Standard Contractual Clauses)</li>
						<li>Compliance with GDPR requirements</li>
					</ul>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>Changes to This Policy</span>
					<p>
						We may update this Privacy Policy from time to time.
						<br />
						Updates will be posted on this page with a revised date.
					</p>
				</li>
				<li>
					<span style={{ fontSize: "1.5rem" }}>Contact Us</span>
					<p style={{ marginBottom: 10 }}>
						If you have questions about this Privacy Policy:
					</p>
					<p>
						Email:{" "}
						<a className="link" href="mailto:info@pavision.cz">
							info@pavision.cz
						</a>
					</p>
					<p>Address: Soběslavova 1381, Kročehlavy, 272 01 Kladno</p>
				</li>
			</ol>
		</main>
	);
}
