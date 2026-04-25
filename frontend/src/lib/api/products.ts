interface Product {
	id: number;
	img: string;
	name: string;
	type: string;
	technology: string;
	brand: string;
	is_active: boolean;
}

export const getProducts = async () => {
	const res = await fetch("https://pavision-backend.onrender.com/products");
	if (!res.ok) throw new Error("Failed to fetch products");
	const data = await res.json();
	return data.filter((product: Product) => product.is_active);
};
