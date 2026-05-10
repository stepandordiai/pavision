"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
// import ChevronIcon from "@/components/icons/ChevronIcon";
import technologies from "@/data/technologies.json";
import "./Hero.scss";
import Image from "next/image";
import ChevronIcon from "../icons/ChevronIcon";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import { Link } from "@/i18n/navigation";
import { TransitionLink } from "../TransitionLink";

const Hero = () => {
	const t = useTranslations();

	// const [garageOpen, setGarageOpen] = useState(false);
	// const [interiorLight, setInteriorLight] = useState(false);
	// const [exteriorLight, setExteriorLight] = useState(false);
	const [activeTechnology, setActiveTechnology] = useState(technologies[0]);

	const bgRefs = useRef<(HTMLDivElement | null)[]>([]);

	const [mounted, setMounted] = useState(false);

	const [animation, setAnimation] = useState(false);

	const [displayedTechnology, setDisplayedTechnology] =
		useState(activeTechnology);

	useEffect(() => {
		setAnimation(false);

		const timeout = setTimeout(() => {
			setDisplayedTechnology(activeTechnology);
			setAnimation(true);
		}, 500); // matches CSS transition duration

		return () => clearTimeout(timeout);
	}, [activeTechnology]);

	// useEffect(() => {
	// 	const t = setTimeout(() => setMounted(true), 500); // small tick for transition to register
	// 	return () => clearTimeout(t);
	// }, []);
	// Observer: update activeTechnology when an image scrolls into view
	// useEffect(() => {
	// 	const observers: IntersectionObserver[] = [];

	// 	bgRefs.current.forEach((el, i) => {
	// 		if (!el) return;
	// 		const obs = new IntersectionObserver(
	// 			([entry]) => {
	// 				if (entry.isIntersecting) setActiveTechnology(technologies[i]);
	// 			},
	// 			{ threshold: 0.6 }, // tweak — 60% visible = active
	// 		);
	// 		obs.observe(el);
	// 		observers.push(obs);
	// 	});

	// 	return () => observers.forEach((o) => o.disconnect());
	// }, [technologies]);

	// const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// const startInterval = () => {
	// 	if (intervalRef.current) clearInterval(intervalRef.current);

	// 	intervalRef.current = setInterval(() => {
	// 		setActiveTechnology((prev) => {
	// 			const nextIndex =
	// 				(technologies.indexOf(prev) + 1) % technologies.length;
	// 			const next = technologies[nextIndex];

	// 			bgRefs.current[nextIndex]?.scrollIntoView({
	// 				behavior: "smooth",
	// 				block: "center",
	// 				inline: "center",
	// 			});

	// 			return next;
	// 		});
	// 	}, 10000);
	// };

	// useEffect(() => {
	// 	startInterval();
	// 	return () => {
	// 		if (intervalRef.current) clearInterval(intervalRef.current);
	// 	};
	// }, []);

	const handleClick = (t: any, i: number) => {
		setActiveTechnology(t);
		bgRefs.current[i]?.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center",
		});
	};

	const bgContainerRef = useRef<HTMLDivElement | null>(null);

	// useEffect(() => {
	// 	const el = bgContainerRef.current;
	// 	if (!el) return;

	// 	const handleScroll = () => {
	// 		const isMobile = window.innerWidth < 768;

	// 		bgRefs.current.forEach((div, i) => {
	// 			const img = div?.querySelector("img");
	// 			if (!img) return;

	// 			if (isMobile) {
	// 				return;
	// 				// const offset = el.scrollTop - i * el.clientHeight;
	// 				// img.style.transform = `scale(1.2) translateY(${offset * 0.2}px)`;
	// 			} else {
	// 				const offset = el.scrollLeft - i * el.clientWidth;
	// 				img.style.transform = `scale(1.2) translateX(${offset * 0.2}px)`;
	// 			}
	// 		});
	// 	};

	// 	el.addEventListener("scroll", handleScroll, { passive: true });
	// 	return () => el.removeEventListener("scroll", handleScroll);
	// }, []);

	return (
		<section className="hero">
			<div className="hero-container">
				<h1 className="hero__title">{t("hero.title")}</h1>
				<p className="hero__desc">
					Zdůrazníme elektroinstalace, síťovou infrastrukturu, domácí
					automatizaci a audio/video systémy.
				</p>
				<TransitionLink href="/contacts" className="hero-btn">
					<span>Contact us</span>
					<span>
						<ChevronRightIcon />
					</span>
				</TransitionLink>
				<div className="hero-container-technology">
					<h2 className={`animation ${animation ? "animation--active" : ""}`}>
						{displayedTechnology.title}
					</h2>
					<p className={`animation ${animation ? "animation--active" : ""}`}>
						{displayedTechnology.description}
					</p>
					<TransitionLink
						className={`link animation ${animation ? "animation--active" : ""}`}
						href={displayedTechnology.path}
					>
						Find out more
					</TransitionLink>
				</div>
			</div>
			<div className="hero-technologies">
				{technologies.map((t, i) => {
					return (
						<button
							key={i}
							onClick={() => handleClick(t, i)}
							className={`hero-technology-btn ${activeTechnology === t ? "hero-technology-btn--active" : ""}`}
						>
							<img src={t.icon} width={20} alt="" />
						</button>
					);
				})}
			</div>
			<div className="hero-bg-container" ref={bgContainerRef}>
				{technologies.map((t, i) => {
					return (
						<div
							className={`hero-bg-inner ${mounted && activeTechnology === t ? "hero-bg-inner--active" : ""}`}
							key={t.title}
							ref={(el) => {
								bgRefs.current[i] = el;
							}}
						>
							<Image
								className="hero-bg"
								onLoad={() => setMounted(true)}
								src={t.img}
								fill
								alt="ads"
							/>
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default Hero;
