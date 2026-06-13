"use client";

import { useState } from "react";
import "./styles.scss";

type FaqsProps = {
	faqs: {
		q: string;
		a: string;
	}[];
};

export default function Faqs({ faqs }: FaqsProps) {
	const [expandedFaq, setExpandedFaq] = useState(() =>
		new Array(faqs.length).fill(false),
	);

	const handleExpandedFaq = (index: number) => {
		setExpandedFaq((prev) =>
			prev.map((item, i) => (i === index ? !item : item)),
		);
	};

	return (
		<section className="faqs-section">
			<h2 className="faqs-section__title">FAQs</h2>
			<div className="faqs-list">
				{faqs.map(({ q, a }, i) => {
					return (
						<div
							key={i}
							className={`faqs-item ${expandedFaq[i] ? "faqs-item--expanded" : ""}`}
						>
							<button
								onClick={() => handleExpandedFaq(i)}
								className="faqs-q"
								type="button"
							>
								{q}
							</button>
							<div
								className={`faqs-a-container ${expandedFaq[i] ? "faqs-a-container--expanded" : ""}`}
							>
								<p className="faqs-a">{a}</p>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
