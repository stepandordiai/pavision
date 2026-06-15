import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/api/products";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import Breadcrumbs from "@/components/common/Breadcrumbs/Breadcrumbs";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";
import "./styles.scss";

export async function generateStaticParams() {
	const { data: products, error } = await getProducts();

	if (!products || error) return [];

	return routing.locales.flatMap((locale) =>
		products.map((p) => ({
			locale,
			id: String(p.id),
		})),
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
	const { locale, id } = await params;

	const { data: products, error } = await getProducts();

	if (!products || error) return {};

	const product = products.find((p) => String(p.id) === id);

	if (!product) {
		return {
			title: "404",
		};
	}

	const PAGE = "products";

	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${PAGE}/${id}`]),
	);

	return {
		title: product.name,

		alternates: {
			canonical: `/${locale}/${PAGE}/${id}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${PAGE}/${id}`,
			},
		},

		// TODO: learn this
		// openGraph: {
		// 	title: product.title,
		// 	description: product.description,
		// 	url: `/${locale}/${PAGE}/${id}`,
		// 	type: "website",
		// 	images: [
		// 		{
		// 			url: product.img || "/flovas-og-c.png",
		// 			width: 630,
		// 			height: 630,
		// 			alt: product.title,
		// 		},
		// 	],
		// },
	};
}

type ProductPageProps = {
	params: Promise<{ id: string; locale: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
	const { id, locale } = await params;

	const t = await getTranslations({ locale });

	const { data: products, error } = await getProducts();

	if (error) return <div>Error loading vacancies</div>;
	if (!products) return <div>No vacancies found</div>;

	const product = products.find((p) => String(p.id) === id);

	if (!product) {
		return notFound();
	}

	return (
		<main className="product-page">
			<Breadcrumbs
				currentPage={product.name}
				prevPage="Products"
				prevPageUrl="/products"
			/>
			<section className="section">
				<div className="product-page-container">
					<img
						style={{ margin: "0 auto" }}
						width={500}
						src={product.img}
						alt=""
					/>
					<div>
						<h1 className="product-page__title">{product.name}</h1>
						<p style={{ whiteSpace: "pre-wrap" }}>{product.description}</p>
					</div>
				</div>
			</section>
			<TechnologyProducts
				technology={product.technology}
				sectionTitle="Related Products"
			/>
		</main>
	);
}
