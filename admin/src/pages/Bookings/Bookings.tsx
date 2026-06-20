import { useEffect, useState } from "react";
import type { Booking, BookingSave } from "../../interfaces/booking";
import DotsIcon from "../../components/icons/DotsIcon";
import Pagination from "../../components/Pagination/Pagination";
import PencilIcon from "../../components/icons/PencilIcon";
import XIcon from "../../components/icons/XIcon";
import TrashIcon from "../../components/icons/TrashIcon";
import { bookingsService } from "../../services/bookings";
import "./styles.scss";

const EMPTY_FORM: BookingSave = {
	name: "",
	phone: "",
	message: "",
	date: "",
	time: "",
	status: "Scheduled",
};

const Bookings = () => {
	const [filter, setFilter] = useState("");
	const [visibleLength, setVisibleLength] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [bannerVisible, setBannerVisible] = useState(false);
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [bookingEditable, setBookingEditable] = useState(false);
	const [clientId, setClientId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [bookings, setBookings] = useState<Booking[]>([]);

	const getAllData = async () => {
		setLoading(true);
		setError(null);

		try {
			const { data, error } = await bookingsService.getAll();

			if (error) throw error;
			setBookings(data ?? []);
		} catch (error) {
			setError(error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getAllData();
	}, []);

	// TODO: learn this
	const filteredBookings = bookings.filter((b) =>
		Object.values(b).some((v) =>
			String(v).toLowerCase().includes(filter.toLowerCase()),
		),
	);

	const totalPages = Math.ceil(bookings.length / 50);

	const deleteData = async (id: string) => {
		setLoading(true);
		setError(null);
		try {
			const { error } = await bookingsService.delete(id);

			if (error) throw error;
			await getAllData();
			setBannerVisible(false);
		} catch (error) {
			setError(error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	// TODO: LEARN THIS
	// Supabase
	const insertData = async (data: Partial<BookingSave>) => {
		setError(null);
		setLoading(true);

		const { error } = await bookingsService.create([data]);
		if (error) {
			if (error.code === "23505") setError("Продукт з таким ID вже існує");
			else console.error("Insert error:", error.message);
			return false;
		}
		await getAllData();
		setFormData(EMPTY_FORM);
		setLoading(false);
		return true;
	};

	const updateData = async (clientId: string, data: Partial<BookingSave>) => {
		setError(null);
		setLoading(true);

		const { id: id, created_at: created_at, ...rest } = data as any;

		const { error } = await bookingsService.update(clientId, rest);

		if (error) {
			if (error.code === "23505") setError("Вакансія з таким ID вже існує");
			else console.error("Insert error:", error.message);
			return false;
		}
		await getAllData();
		setBookingEditable(false);
		setClientId(null);
		setLoading(false);

		return true;
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (bookingEditable && clientId) {
			updateData(clientId, formData);
		} else {
			insertData(formData);
		}
	};

	const handleFormData = (
		name: string,
		value: string | string[] | boolean | number | File | null,
	) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<>
			<div className={`banner ${bannerVisible ? "banner--visible" : ""}`}>
				<button
					className="close-btn"
					onClick={() => {
						setBookingEditable(false);
						setClientId(null);
						setBannerVisible(false);
					}}
				>
					<XIcon />
				</button>
				<p style={{ fontSize: "1.25rem", fontWeight: "500" }}>
					{bookingEditable ? "Edit Appointment" : "Add Appointment"}
				</p>
				{error && <p style={{ color: "#f00" }}>{error}</p>}
				<form className="form" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="">Name</label>
						<input
							className={`input ${!bookingEditable ? "input--disabled" : ""}`}
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.name}
							name="name"
							type="text"
							placeholder="Enter product name"
							disabled={!bookingEditable}
						/>
					</div>
					<div>
						<label htmlFor="">Phone</label>
						<input
							className={`input ${!bookingEditable ? "input--disabled" : ""}`}
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.phone}
							name="tel"
							type="tel"
							placeholder="Enter product name"
							disabled={!bookingEditable}
						/>
					</div>
					<div>
						<label htmlFor="">Subject</label>
						<textarea
							className={`input ${!bookingEditable ? "input--disabled" : ""}`}
							onChange={(e) => handleFormData(e.target.name, e.target.value)}
							value={formData.message}
							name="message"
							placeholder="Enter product name"
							rows={10}
							disabled={!bookingEditable}
						/>
					</div>
					{!bookingEditable ? (
						<div style={{ display: "flex", flexWrap: "wrap" }}>
							<button
								type="button"
								className="edit-btn"
								onClick={() => {
									setBookingEditable(true);
								}}
							>
								<span>
									<PencilIcon />
								</span>
								<span>Edit</span>
							</button>
							<button
								type="button"
								className="delete-btn"
								onClick={() => deleteData(String(clientId))}
							>
								<span>
									<TrashIcon />
								</span>
								<span>Delete</span>
							</button>
						</div>
					) : (
						<button className="form__submit-btn" type="submit">
							{loading
								? bookingEditable
									? "Updating..."
									: "Creating..."
								: bookingEditable
									? "Update"
									: "Create"}
						</button>
					)}
				</form>
			</div>
			<div
				className={`curtain ${bannerVisible ? "curtain--active" : ""}`}
			></div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<h1 className="main__title">Appointments</h1>
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
							// setBannerVisible(true);
						}}
					>
						+ Add appointment
					</button>
				</div>
			</div>
			<table className="table">
				<thead>
					<tr>
						<th style={{ width: "1%", whiteSpace: "wrap" }}>№</th>
						<th style={{ width: "1%", whiteSpace: "wrap" }}>Name</th>
						<th style={{ width: "1%", whiteSpace: "wrap" }}>Phone</th>
						<th style={{ width: "1%", whiteSpace: "wrap" }}>Message</th>
						<th>Date & Time</th>
						<th style={{ width: "1%", whiteSpace: "nowrap" }}>Created At</th>
						<th style={{ width: "1%", whiteSpace: "wrap" }}>Status</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{[...filteredBookings]
						.reverse()
						.slice(0, visibleLength)
						.map((client, i) => {
							const {
								id,
								name,
								phone,
								message,
								date,
								time,
								created_at,
								status,
							} = client;

							return (
								<tr key={id}>
									<td style={{ width: "1%", whiteSpace: "wrap" }}>{i + 1}</td>
									<td style={{ width: "1%", whiteSpace: "nowrap" }}>{name}</td>
									<td style={{ width: "1%", whiteSpace: "wrap" }}>{phone}</td>
									<td style={{ width: "99%", whiteSpace: "wrap" }}>
										{message}
									</td>
									<td>
										{new Date(date).toLocaleDateString()} {time}
									</td>
									<td>{new Date(created_at).toLocaleDateString()}</td>
									<td>
										<select
											className="status-select"
											value={status}
											name=""
											id=""
										>
											<option value="Scheduled">Scheduled</option>
											<option value="Completed">Completed</option>
											<option value="Canceled">Canceled</option>
										</select>
									</td>
									<td
										style={{
											width: "1%",
											whiteSpace: "nowrap",
										}}
									>
										{/* <div
											ref={(el) => {
												detailsRef.current[i] = el;
											}}
											className="details-dd"
										> */}
										<button
											className="details-btn"
											onClick={() => {
												setBannerVisible(true);
												setFormData(client);
												setClientId(client.id);
											}}
										>
											<DotsIcon />
										</button>
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					background: "white",
					marginTop: "auto",
					lineHeight: "1",
					paddingTop: "10px",
				}}
			>
				<div style={{ display: "flex", gap: "5px" }}>
					<p
						style={{
							background: "var(--bg-clr)",
							padding: "10px",
							borderRadius: "10px",
							fontWeight: "500",
							lineHeight: "1",
						}}
					>
						{(currentPage - 1) * 50 + 1} -{" "}
						{Math.min(currentPage * 50, filteredBookings.length)}
					</p>
					<p>
						Rows per page{" "}
						<select
							style={{
								border: "2px solid hsl(0, 0%, 90%)",
								padding: "5px",
								borderRadius: "10px",
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
							{bookings.length
								? bookings.length < visibleLength
									? bookings.length
									: visibleLength
								: "Loading..."}
						</span>{" "}
						of {bookings.length ? bookings.length : "Loading..."}
					</p>
					<p
						style={{
							background: "var(--bg-clr)",
							padding: "10px",
							borderRadius: "10px",
							fontWeight: "500",
						}}
					>
						Total: {filteredBookings.length}
					</p>
				</div>
				<Pagination
					totalPages={totalPages}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
				/>
			</div>
		</>
	);
};

export default Bookings;
