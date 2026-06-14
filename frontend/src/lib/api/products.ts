import { supabase } from "../supabase";

export const getProducts = async () => {
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("is_active", true);

	return { data, error };
};
