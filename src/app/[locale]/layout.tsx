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
import "@/scss/globals.scss";

const poppins = Poppins({
	variable: "--font-poppins",
	weight: ["300", "400", "500", "600"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
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

	console.log(locale);

	return (
		<html lang={locale}>
			<body className={poppins.variable}>
				<ScrollToTop />
				<NextIntlClientProvider locale={locale}>
					<Banner />
					<Header />
					{children}
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
