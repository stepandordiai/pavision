import { supabase } from "../supabase";

export async function getProducts() {
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("is_active", true);

	return { data, error };
}

export async function getProductById(id: string) {
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("id", id)
		.single();

	return { data, error };
}
