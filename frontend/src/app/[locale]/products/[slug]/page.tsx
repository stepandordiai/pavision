import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/api/products";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import Breadcrumbs from "@/components/common/Breadcrumbs/Breadcrumbs";
import { TransitionLink } from "@/components/TransitionLink";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import "./styles.scss";

export const revalidate = 3600;

const PAGE = "products";

export async function generateStaticParams() {
	const { data: products, error } = await getProducts();

	if (!products || error) return [];

	return routing.locales.flatMap((locale) =>
		products.map((p) => ({
			locale,
			slug: p.slug,
		})),
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
	const { locale, slug } = await params;

	// TODO: learn this
	const { data: product } = await getProductBySlug(slug);

	if (!product) {
		return {
			title: "Product not found",
			robots: { index: false, follow: false },
		};
	}

	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `/${l}/${PAGE}/${slug}`]),
	);

	const description = product.description
		? product.description.replace(/\s+/g, " ").slice(0, 155)
		: undefined;

	return {
		title: product.name,
		description,
		alternates: {
			canonical: `/${locale}/${PAGE}/${slug}`,
			languages: {
				...languages,
				"x-default": `/${routing.defaultLocale}/${PAGE}/${slug}`,
			},
		},

		openGraph: {
			title: product.name,
			url: `/${locale}/${PAGE}/${slug}`,
			type: "website",
			images: product.img || "/pavision-og.png",
		},
	};
}

type ProductPageProps = {
	params: Promise<{ slug: string; locale: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
	const { slug, locale } = await params;
	setRequestLocale(locale);

	// TODO: learn this
	const { data: product, error } = await getProductBySlug(slug);

	if (error) throw error;
	if (!product) notFound();

	const t = await getTranslations();

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
					<div className="product-page__img-container">
						<img
							style={{ margin: "0 auto" }}
							width={500}
							src={product.img}
							alt={product.name}
						/>
					</div>
					<div className="product-page__content">
						<p style={{ fontWeight: "500" }}>{product.brand}</p>
						<h1 className="product-page__title">{product.name}</h1>
						<p style={{ whiteSpace: "pre-wrap" }}>{product.description}</p>
						<TransitionLink href="/contacts" className="product-page__btn">
							{t("products.askForPricing")}
						</TransitionLink>
					</div>
				</div>
			</section>
			<RelatedProducts category={product.category} />
		</main>
	);
}
