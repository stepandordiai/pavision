"use client";

import { Fragment, useEffect, useRef } from "react";
import styles from "./ScrollFillText.module.scss";

interface Props {
	paragraphs: string[];
}

// where the fill starts / ends, as a fraction of the screen height
const START = 0.5; // fill begins when the top of the text reaches 85% down the screen
const END = 0.5; // fill completes when the bottom of the text reaches the middle

export default function ScrollFillText({ paragraphs }: Props) {
	const textRef = useRef<HTMLDivElement>(null);

	// split into words once, with a running index across all paragraphs
	let index = 0;
	const blocks = paragraphs.map((p) =>
		p.split(" ").map((word) => ({ word, i: index++ })),
	);
	const total = index;

	useEffect(() => {
		const text = textRef.current;
		if (!text) return;

		// respect "reduce motion": just show everything filled
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			text.style.setProperty("--p", "1");
			return;
		}

		let frame = 0;
		const update = () => {
			frame = 0;
			const rect = text.getBoundingClientRect();
			const vh = window.innerHeight;
			// 0 when the text top is at START, 1 when the text bottom is at END
			const progress =
				(vh * START - rect.top) / (rect.height + vh * (START - END));
			text.style.setProperty(
				"--p",
				Math.min(1, Math.max(0, progress)).toFixed(4),
			);
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			cancelAnimationFrame(frame);
		};
	}, []);

	return (
		<div
			ref={textRef}
			className={styles.text}
			style={{ "--n": total } as React.CSSProperties}
		>
			{blocks.map((words, b) => (
				<p key={b}>
					{words.map(({ word, i }) => (
						<Fragment key={i}>
							<span
								className={styles.word}
								style={{ "--i": i } as React.CSSProperties}
							>
								{word}{" "}
							</span>
							{i === 53 && (
								<>
									<img
										className={styles.img}
										src="/services-loxone.jpg"
										alt="Loxone smart home installation"
									/>{" "}
								</>
							)}
							{i === 84 && (
								<>
									<img
										className={styles.img}
										src="/home-page-nosek-15.png"
										alt="Smart home project by P&A Vision"
									/>{" "}
								</>
							)}
							{i === 124 && (
								<>
									<img
										className={styles.img}
										src="/loxone-smart-home-home-access.jpg"
										alt="Smart home project by P&A Vision"
									/>{" "}
								</>
							)}
						</Fragment>
					))}
				</p>
			))}
		</div>
	);
}
