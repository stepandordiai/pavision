export interface Booking {
	id: string;
	name: string;
	phone: string;
	message: string;
	date: string;
	time: string;
	created_at: string;
	status: string;
}

export interface BookingSave extends Omit<Booking, "id" | "created_at"> {}
