import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/api/products";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import Breadcrumbs from "@/components/common/Breadcrumbs/Breadcrumbs";
import TechnologyProducts from "@/components/TechnologyProducts/TechnologyProducts";
import "./styles.scss";

const PAGE = "products";

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

	// TODO: learn this
	const { data: product, error } = await getProductById(id);

	if (!product || error) {
		return {
			title: "Product not found",
			// TODO: learn this
			robots: { index: false, follow: false },
		};
	}

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

		openGraph: {
			title: product.name,
			url: `/${locale}/${PAGE}/${id}`,
			type: "website",
			images: "/pavision-og.png",
		},
	};
}

type ProductPageProps = {
	params: Promise<{ id: string; locale: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
	const { id, locale } = await params;

	const t = await getTranslations({ locale });

	// TODO: learn this
	const { data: product, error } = await getProductById(id);

	if (error) return <div>Error loading vacancies</div>;
	if (!product) return <div>No vacancies found</div>;

	if (!product) {
		return notFound();
	}

	return (
		<main className="product-page">
			<Breadcrumbs
				links={[
					{ label: t("nav.products"), href: "/products" },
					{ label: product.name },
				]}
				locale={locale}
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
