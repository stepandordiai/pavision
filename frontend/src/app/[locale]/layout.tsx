import { Poppins } from "next/font/google";
import { Metadata } from "next";
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

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
	// TODO: learn this
	title: {
		template: "%s | P&A Vision",
		default: "P&A Vision",
	},
};

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

	return (
		<html lang={locale}>
			<body className={poppins.variable}>
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
