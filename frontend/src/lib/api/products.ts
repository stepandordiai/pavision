import { supabase } from "../supabase";

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
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("is_active", true);

	if (error) {
		console.error(error);
		throw new Error("Failed to fetch products");
	}

	return data ?? [];
};
