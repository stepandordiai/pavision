export interface Product {
	id: string;
	img: string | null;
	name: string;
	is_active: boolean;
	created_at: string;
	type: string[];
	technology: string;
	brand: string;
}

export interface ProductSave extends Omit<
	Product,
	"img" | "created_at" | "id"
> {
	// local file before upload
	img: File | null;
	current_img: string | null;
}
