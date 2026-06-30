"use client";

import { useState } from "react";
import ChevronDownIcon from "../icons/ChevronDownIcon";
import { useTranslations } from "next-intl";
import "./styles.scss";

interface Faq {
	q: string;
	a: string;
}

type FaqsProps = {
	faqs: string;
};

export default function Faqs({ faqs }: FaqsProps) {
	const t = useTranslations();

	const [expandedFaq, setExpandedFaq] = useState<boolean[]>(() =>
		new Array((t.raw(faqs) as Faq[]).length).fill(false),
	);

	const handleExpandedFaq = (index: number) => {
		setExpandedFaq((prev) =>
			prev.map((item, i) => (i === index ? !item : item)),
		);
	};

	// FAQPage
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: (t.raw(faqs) as Faq[]).map(({ q, a }) => ({
			"@type": "Question",
			name: q,
			acceptedAnswer: { "@type": "Answer", text: a },
		})),
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<section className="faqs-section">
				<h2 className="faqs-section__title">{t("faqs.heading")}</h2>
				<div className="faqs-list">
					{(t.raw(faqs) as Faq[]).map(({ q, a }, i) => {
						return (
							<div
								key={i}
								className={`faqs-item ${expandedFaq[i] ? "faqs-item--expanded" : ""}`}
							>
								<button
									className="faqs-q"
									onClick={() => handleExpandedFaq(i)}
									type="button"
									aria-expanded={expandedFaq[i]}
									aria-controls={`faq-a-${i}`}
									id={`faq-q-${i}`}
								>
									<h3>{q}</h3>
									<span
										className={`faq-q-icon ${expandedFaq[i] ? "faq-q-icon--active" : ""}`}
									>
										<ChevronDownIcon />
									</span>
								</button>
								<div
									id={`faq-a-${i}`}
									role="region"
									aria-labelledby={`faq-q-${i}`}
									className={`faqs-a-container ${expandedFaq[i] ? "faqs-a-container--expanded" : ""}`}
								>
									<p className="faqs-a">{a}</p>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</>
	);
}
