"use client";

import { useTranslations } from "next-intl";
import { TransitionLink } from "@/components/TransitionLink";
import Image from "next/image";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import BulbIcon from "@/components/icons/BulbIcon";
import LockIcon from "@/components/icons/LockIcon";
import TvIcon from "@/components/icons/TvIcon";
import SoundwaveIcon from "@/components/icons/SoundwaveIcon";
import CameraIcon from "@/components/icons/CameraIcon";

export default function TechnologiesClient() {
	const t = useTranslations();
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
			<SwiperSlide>
				<TransitionLink href="/lighting" className="technology">
					<div className="technology__img-wrapper">
						<img src="/lighting/02-c.png" alt="" loading="lazy" />
					</div>
					<div className="technology__title">
						<div className="technology__icon-container">
							<BulbIcon size={20} />
						</div>
						<h3>{t("lighting.heading")}</h3>
					</div>
				</TransitionLink>
			</SwiperSlide>
			<SwiperSlide>
				<TransitionLink href="/home-access" className="technology">
					<div className="technology__img-wrapper">
						<img
							src="https://www.lavishautomation.com/images/client/brands/security-header%201.jpg"
							alt=""
							loading="lazy"
						/>
					</div>
					<div className="technology__title">
						<div className="technology__icon-container">
							<LockIcon size={20} />
						</div>
						<h3>{t("homeAccess.heading")}</h3>
					</div>
				</TransitionLink>
			</SwiperSlide>

			<SwiperSlide>
				<TransitionLink href="/video" className="technology">
					<div className="technology__img-wrapper">
						<img src="/video/01-c.png" alt="" loading="lazy" />
					</div>
					<div className="technology__title">
						<div className="technology__icon-container">
							<TvIcon size={20} />
						</div>
						<h3>{t("video.heading")}</h3>
					</div>
				</TransitionLink>
			</SwiperSlide>

			<SwiperSlide>
				<TransitionLink href="/audio" className="technology">
					<div className="technology__img-wrapper">
						<img
							src="https://www.bowerswilkins.com/on/demandware.static/-/Sites-master-catalog-soundunited/default/dw0b413071/bowers/Rich-Content/bandw_formationbar_be_desktop.jpg"
							alt=""
							loading="lazy"
						/>
					</div>
					<div className="technology__title">
						<div className="technology__icon-container">
							<SoundwaveIcon size={20} />
						</div>
						<h3>{t("audio.heading")}</h3>
					</div>
				</TransitionLink>
			</SwiperSlide>

			<SwiperSlide>
				<TransitionLink href="/shades" className="technology">
					<div className="technology__img-wrapper">
						<img
							src="https://images.pexels.com/photos/36353407/pexels-photo-36353407.png"
							alt=""
							loading="lazy"
						/>
					</div>
					<div className="technology__title">
						<div className="technology__icon-container">
							<Image
								src="/technology-icons/shades.png"
								width={24}
								height={24}
								alt=""
							/>
						</div>
						<h3>{t("shades.heading")}</h3>
					</div>
				</TransitionLink>
			</SwiperSlide>

			<SwiperSlide>
				<TransitionLink href="/thermostat" className="technology">
					<div className="technology__img-wrapper">
						<img
							src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/residential_enduser_new/product-thermostat-thumn.jpg"
							alt=""
							loading="lazy"
						/>
					</div>
					<div className="technology__title">
						<div className="technology__icon-container">
							<Image
								src="/technology-icons/thermostat.png"
								width={24}
								height={24}
								alt=""
							/>
						</div>
						<h3>{t("thermostat.heading")}</h3>
					</div>
				</TransitionLink>
			</SwiperSlide>

			<SwiperSlide>
				<TransitionLink href="/security" className="technology">
					<div className="technology__img-wrapper">
						<img
							src="https://images.pexels.com/photos/35361412/pexels-photo-35361412.jpeg"
							alt=""
							loading="lazy"
						/>
					</div>
					<div className="technology__title">
						<div className="technology__icon-container">
							<CameraIcon size={20} />
						</div>
						<h3>{t("security.heading")}</h3>
					</div>
				</TransitionLink>
			</SwiperSlide>
		</Swiper>
	);
}
