import { useEffect, useRef, useState } from "react";
import type { Client, ClientSave } from "../../interfaces/client";
import { supabase } from "../../lib/supabase";
import XIcon from "../../components/icons/XIcon";
import DotsIcon from "../../components/icons/DotsIcon";
import PencilIcon from "../../components/icons/PencilIcon";
import TrashIcon from "../../components/icons/TrashIcon";
import "./styles.scss";

const EMPTY_FORM = {
	name: "",
	tel: "",
	email: "",
	message: "",
};

type ClientsProps = {
	clients: Client[];
	setClients: React.Dispatch<React.SetStateAction<Client[]>>;
	loadClients: () => Promise<void>;
};

const Clients = ({ clients, loadClients }: ClientsProps) => {
	const [filter, setFilter] = useState("");
	const [bannerVisible, setBannerVisible] = useState(false);
	const [clientEditable, setClientEditable] = useState(false);
	const [clientId, setClientId] = useState<string | null>(null);
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [visibleLength, setVisibleLength] = useState(10);
	const [detailsVisible, setDetailsVisible] = useState<string | null>(null);

	console.log(error);

	const detailsRef = useRef<(HTMLDivElement | null)[]>([]);

	// TODO: LEARN THIS
	// Supabase
	const insertClient = async (data: Partial<ClientSave>) => {
		setError(null);
		setLoading(true);

		const { error } = await supabase.from("clients").insert([data]);
		if (error) {
			if (error.code === "23505") setError("Продукт з таким ID вже існує");
			else console.error("Insert error:", error.message);
			return false;
		}
		await loadClients();
		setBannerVisible(false);
		setFormData(EMPTY_FORM);
		setLoading(false);
		return true;
	};

	const updateClient = async (clientId: string, data: Partial<ClientSave>) => {
		setError(null);
		setLoading(true);

		const { id: id, created_at: created_at, ...rest } = data as any;

		const { error } = await supabase
			.from("clients")
			.update(rest)
			.eq("id", clientId);
		if (error) {
			if (error.code === "23505") setError("Вакансія з таким ID вже існує");
			else console.error("Insert error:", error.message);
			return false;
		}
		await loadClients();
		setBannerVisible(false);
		setFormData(EMPTY_FORM);
		setClientEditable(false);
		setClientId(null);
		setLoading(false);

		return true;
	};

	const deleteOne = async (id: string) => {
		const { error } = await supabase.from("clients").delete().eq("id", id);
		if (error) console.error("Delete error:", error.message);
		else loadClients();
	};

	const handleFormData = (
		name: string,
		value: string | string[] | boolean | number | File | null,
	) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (clientEditable && clientId) {
			updateClient(clientId, formData);
		} else {
			insertClient(formData);
		}
	};

	const handleClientDetails = (id: string) => {
		setDetailsVisible((prev) => (prev === id ? null : id));
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const clickedOutsideAll = detailsRef.current.every(
				(ref) => ref && !ref.contains(e.target as Node),
			);
			if (clickedOutsideAll) {
				setDetailsVisible(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// TODO: learn this
	const filteredClients = clients.filter((c) =>
		Object.values(c).some((value) =>
			String(value).toLowerCase().includes(filter.toLowerCase()),
		),
	);

	return (
		<>
			<div
				className={`banner ${bannerVisible || clientEditable ? "banner--visible" : ""}`}
			>
				<button
					className="close-btn"
					onClick={() => {
						setClientEditable(false);
						setClientId(null);
						setBannerVisible(false);
					}}
				>
					<XIcon />
				</button>
				<p style={{ fontSize: "1.25rem", fontWeight: "500" }}>
					{clientEditable ? "Edit client" : "Add new client"}
				</p>
				<form className="form" onSubmit={handleForm}>
					<div>
						<label htmlFor="">Name</label>
						<input
							className="input"
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.name}
							name="name"
							type="text"
							placeholder="Enter product name"
						/>
					</div>
					<div>
						<label htmlFor="">Phone</label>
						<input
							className="input"
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.tel}
							name="tel"
							type="tel"
							placeholder="Enter product name"
						/>
					</div>
					<div>
						<label htmlFor="">Email</label>
						<input
							className="input"
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.email}
							name="email"
							type="email"
							placeholder="Enter product name"
						/>
					</div>
					<div>
						<label htmlFor="">Subject</label>
						<textarea
							className="input"
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.message}
							name="message"
							placeholder="Enter product name"
							rows={10}
						/>
					</div>
					<button className="form__submit-btn" type="submit">
						{loading
							? clientEditable
								? "Updating..."
								: "Creating..."
							: clientEditable
								? "Update"
								: "Create"}
					</button>
				</form>
			</div>
			<div
				className={`curtain ${bannerVisible || clientEditable ? "curtain--active" : ""}`}
			></div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<h1 className="main__title">Clients</h1>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginBottom: "10px",
					}}
				>
					<input
						onChange={(e) => setFilter(e.target.value)}
						className="search-input"
						type="text"
						placeholder="Search..."
					/>
					<button
						className="create-btn"
						onClick={() => {
							setBannerVisible(true);
						}}
					>
						+ Add client
					</button>
				</div>
			</div>

			<table className="table">
				<thead>
					<tr>
						<th style={{ width: "1%", whiteSpace: "wrap" }}>№</th>
						<th style={{ width: "1%", whiteSpace: "wrap" }}>Name</th>
						<th style={{ width: "1%", whiteSpace: "wrap" }}>Phone</th>
						<th style={{ width: "1%", whiteSpace: "wrap" }}>Email</th>
						<th className="hide">Subject</th>
						<th className="hide">Created At</th>
						<th style={{ width: "1%", whiteSpace: "wrap" }} className="hide">
							Details
						</th>
					</tr>
				</thead>
				<tbody>
					{[...filteredClients]
						.reverse()
						.slice(0, visibleLength)
						.map((client, i) => {
							return (
								<tr key={client.id}>
									<td style={{ width: "1%", whiteSpace: "wrap" }}>{i + 1}</td>
									<td style={{ width: "1%", whiteSpace: "nowrap" }}>
										{client.name}
									</td>
									<td style={{ width: "1%", whiteSpace: "wrap" }}>
										{client.tel}
									</td>
									<td style={{ width: "1%", whiteSpace: "wrap" }}>
										{client.email}
									</td>
									<td
										style={{ width: "99%", whiteSpace: "wrap" }}
										className="hide"
									>
										{client.message}
									</td>
									<td className="hide">
										{new Date(client.created_at).toLocaleDateString()}
									</td>
									<td
										style={{
											width: "1%",
											whiteSpace: "nowrap",
										}}
									>
										<div
											ref={(el) => {
												detailsRef.current[i] = el;
											}}
											className="details-dd"
										>
											<button
												onClick={() => handleClientDetails(client.id)}
												style={{
													background: "rgba(0,0,0, 0.1)",
													padding: "5px",
													borderRadius: "5px",
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													justifySelf: "flex-end",
												}}
											>
												<DotsIcon />
											</button>
											<div
												className={`details-dd-inner ${detailsVisible === client.id ? "details-dd-inner--visible" : ""}`}
											>
												<button
													className="edit-btn"
													onClick={() => {
														setBannerVisible(true);
														setFormData(client);
														setClientEditable(true);
														setClientId(client.id);
														setDetailsVisible(null);
													}}
												>
													<span>
														<PencilIcon />
													</span>
													<span>Edit</span>
												</button>
												<button
													className="delete-btn"
													onClick={() => {
														deleteOne(client.id);
														setDetailsVisible(null);
													}}
												>
													<span>
														<TrashIcon />
													</span>
													<span>Delete</span>
												</button>
											</div>
										</div>
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
			<div style={{ marginTop: "auto", paddingTop: "10px" }}>
				<p>
					Clients per page{" "}
					<select
						style={{
							border: "2px solid hsl(0, 0%, 90%)",
							padding: "5px",
							borderRadius: "5px",
						}}
						onChange={(e) => setVisibleLength(Number(e.target.value))}
						value={visibleLength}
						name=""
						id=""
					>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>{" "}
					1-
					<span>
						{clients.length
							? clients.length < visibleLength
								? clients.length
								: visibleLength
							: "Loading..."}
					</span>{" "}
					of {clients.length ? clients.length : "Loading..."}
				</p>
				{/* <div>
				<span>1</span> <span>2</span> <span>3</span> <span>...</span>{" "}
				<span>{products.length < 100 ? visibleLength : 100}</span>
			</div> */}
			</div>
			{/* <Footer
				visibleLength={visibleLength}
				setVisibleLength={setVisibleLength}
				products.length={products.length}
			/> */}
		</>
	);
};

export default Clients;
