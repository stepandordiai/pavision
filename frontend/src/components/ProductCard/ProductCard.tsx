import ArrowRightUpIcon from "../icons/ArrowRightUpIcon";
import { TransitionLink } from "../TransitionLink";
import "./styles.scss";

interface Product {
	id: number;
	img: string;
	name: string;
	type: string;
	technology: string;
	brand: string;
}

type ProductCardProps = {
	product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
	return (
		<TransitionLink href={`/products/${product.id}`} className="product-card">
			<p className="product-card__title">{product.name}</p>
			<img src={product.img} alt="" />
			<p
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: 5,
					alignSelf: "flex-end",
				}}
			>
				<span>Zjistěte více</span>
				<span className="product-card__icon-wrapper">
					<ArrowRightUpIcon />
				</span>
			</p>
		</TransitionLink>
	);
}
