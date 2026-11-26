"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import classNames from "classnames";
import "./Lng.scss";

const languages = [
	{ label: "Čeština", code: "cs", icon: "/lng-icons/cs.png" },
	{ label: "English", code: "en", icon: "/lng-icons/en.png" },
	{ label: "Deutsch", code: "de", icon: "/lng-icons/de.png" },
] as const;

const Lng = () => {
	const pathname = usePathname();
	const router = useRouter();
	const locale = useLocale();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const handleLng = (lngCode: string) => {
		if (lngCode === locale) return;

		const query = searchParams.toString();
		const href = query ? `${pathname}?${query}` : pathname;

		startTransition(() => {
			router.replace(href, { locale: lngCode });
		});
	};

	return (
		<div className="lng">
			{languages.map((lng) => (
				<button
					key={lng.code}
					type="button"
					onClick={() => handleLng(lng.code)}
					disabled={isPending}
					aria-pressed={lng.code === locale}
					className={classNames("lng__btn", {
						"lng__btn--selected": lng.code === locale,
					})}
				>
					<img src={lng.icon} width={20} height={20} alt="" />
					<span>{lng.label}</span>
				</button>
			))}
		</div>
	);
};

export default Lng;
