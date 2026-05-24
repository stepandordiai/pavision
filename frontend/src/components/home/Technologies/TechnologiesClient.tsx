"use client";

import technologies from "@/data/technologies.json";
import { TransitionLink } from "@/components/TransitionLink";
import Image from "next/image";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function TechnologiesClient() {
	const handleSlideChange = (swiper: any) => {
		const bullets = document.querySelectorAll(
			".custom-bullet",
		) as NodeListOf<HTMLSpanElement>;
		bullets.forEach((bullet, i) => {
			if (i < swiper.realIndex) {
				bullet.classList.add("custom-bullet--filled");
				bullet.classList.remove("custom-bullet--animating");
			} else if (i > swiper.realIndex) {
				// Future bullets — fully reset
				bullet.classList.remove("custom-bullet--filled");
				bullet.classList.remove("custom-bullet--animating");
			} else {
				// Current — restart animation
				bullet.classList.remove("custom-bullet--filled");
				bullet.classList.remove("custom-bullet--animating");

				// Force reflow then re-add
				void bullet.offsetWidth;
				bullet.classList.add("custom-bullet--animating");
			}
		});
	};

	return (
		<Swiper
			breakpoints={{
				0: {
					slidesPerView: 1.25, // mobile
				},
				768: {
					slidesPerView: 3.25, // tablet+
				},
			}}
			spaceBetween={10}
			pagination={{
				clickable: true,
				renderBullet: (index, className) => {
					return `<span key={${index} className="${className} custom-bullet"></span>`;
				},
			}}
			speed={1000}
			autoplay={{
				delay: 5000,
				disableOnInteraction: false,
			}}
			modules={[Pagination, Autoplay]}
			className="technologies-swiper"
			onSlideChange={handleSlideChange}
		>
			{technologies.map((technology, i) => {
				return (
					<SwiperSlide>
						<TransitionLink
							href={technology.path}
							key={i}
							className="technology"
						>
							<div className="technology__img-wrapper">
								<img src={technology.img} alt="" loading="lazy" />
							</div>
							<div className="technology__title">
								<div className="technology__icon-container">
									<Image src={technology.icon} width={24} height={24} alt="" />
								</div>
								<h3>{technology.title}</h3>
							</div>
						</TransitionLink>
					</SwiperSlide>
				);
			})}
		</Swiper>
	);
}
