import { supabase } from "../supabase";

export async function getProducts() {
	const { data, error } = await supabase.from("products").select("*");

	return { data, error };
}

export async function getProductBySlug(slug: string) {
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("slug", slug)
		// TODO: learn this
		.maybeSingle();

	return { data, error };
}
