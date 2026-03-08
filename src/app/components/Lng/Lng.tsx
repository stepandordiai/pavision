"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import GlobeIcon from "@/app/icons/GlobeIcon";
import "./Lng.scss";

const languages = [
	{
		label: "Čeština",
		code: "cs",
		icon: "/cs.png",
	},
	{
		label: "English",
		code: "en",
		icon: "/en.png",
	},
];

const Lng = () => {
	const pathname = usePathname();
	const router = useRouter();
	const locale = useLocale();

	const lngIndex = languages.findIndex((lng) => lng.code === locale);

	const handleLng = () => {
		const nextIndex = (lngIndex + 1) % languages.length;

		const newPathname = pathname.replace(
			`/${locale}`,
			`/${languages[nextIndex].code}`,
		);
		router.replace(newPathname);
	};

	const nextLng = languages[(lngIndex + 1) % languages.length];

	return (
		<button
			onClick={handleLng}
			className="lng__btn"
			title={`Change language to ${nextLng.label}`}
		>
			<img src={nextLng.icon} width={12} alt="" />
			<GlobeIcon size={24} />
		</button>
	);
};

export default Lng;
