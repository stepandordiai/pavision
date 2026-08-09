import { Poppins, Michroma } from "next/font/google";
import { type Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import Banner from "@/components/Banner/Banner";
import ScrollToTop from "@/utils/ScrollToTop";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { BASE_URL } from "@/lib/constants";
import { TransitionProvider } from "@/providers/TransitionProvider";
import ScrollToTopBtn from "@/components/ScrollToTopBtn/ScrollToTopBtn";
import FloatContact from "@/components/FloatContact/FloatContact";
import "@/scss/globals.scss";

const poppins = Poppins({
	variable: "--font-poppins",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});

const michroma = Michroma({
	variable: "--font-michroma",
	weight: ["400"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
	// TODO: learn this
	title: {
		template: "%s | P&A Vision",
		default: "P&A Vision",
	},
};

// TODO: learn this
export function generateJsonLd(locale: string) {
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": [
					"LocalBusiness",
					"ElectronicsStore",
					"HomeAndConstructionBusiness",
				],
				"@id": `${BASE_URL}/#business`,
				name: "P&A Vision s.r.o.",
				url: BASE_URL,
				logo: `${BASE_URL}/logo.svg`,
				image: `${BASE_URL}/pavision-og.png`,
				telephone: ["+420775632426", "+420777049617"],
				email: "info@pavision.cz",
				address: {
					"@type": "PostalAddress",
					streetAddress: "Soběslavova 1381",
					addressLocality: "Kladno - Kročehlavy",
					postalCode: "272 01",
					addressCountry: "CZ",
				},
				vatID: "CZ23654341",
				taxID: "23654341",
				sameAs: [
					"https://www.instagram.com/pa_vision.cz",
					"https://www.facebook.com/profile.php?id=61581254326915",
				],
				areaServed: ["CZ", "EU"],
				priceRange: "$$$",
				// TODO:
				makesOffer: [
					{
						"@type": "Offer",
						itemOffered: { "@type": "Service", name: "Crestron integration" },
					},
					{
						"@type": "Offer",
						itemOffered: { "@type": "Service", name: "Loxone smart home" },
					},
					{
						"@type": "Offer",
						itemOffered: { "@type": "Service", name: "Home automation" },
					},
					{
						"@type": "Offer",
						itemOffered: {
							"@type": "Service",
							name: "Audio/Video installation",
						},
					},
					{
						"@type": "Offer",
						itemOffered: { "@type": "Service", name: "Network infrastructure" },
					},
					{
						"@type": "Offer",
						itemOffered: { "@type": "Service", name: "Security systems" },
					},
				],
			},
			{
				"@type": "WebSite",
				"@id": `${BASE_URL}/#website`,
				url: BASE_URL,
				name: "P&A Vision",
				publisher: { "@id": `${BASE_URL}/#business` },
				inLanguage: locale,
			},
		],
	};
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		return notFound();
	}

	const jsonLd = generateJsonLd(locale);

	return (
		<html lang={locale}>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</head>
			<body className={`${poppins.variable} ${michroma.variable}`}>
				<ScrollToTop />
				<ScrollToTopBtn />
				<FloatContact />
				<NextIntlClientProvider locale={locale}>
					<Banner />
					<TransitionProvider>
						<Header />
						{children}
						<Footer />
					</TransitionProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
