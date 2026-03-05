import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import "./globals.scss";
import Banner from "./components/Banner/Banner";

const poppins = Poppins({
	variable: "--font-poppins",
	weight: ["400", "500", "600"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "P&A Vision",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="cs">
			<body className={poppins.variable}>
				<Banner />
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
