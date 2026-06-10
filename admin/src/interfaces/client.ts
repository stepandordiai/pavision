export interface Client {
	id: string;
	name: string;
	tel: string;
	email: string;
	message: string;
	created_at: string;
}

export interface ClientSave extends Omit<Client, "id" | "created_at"> {}
