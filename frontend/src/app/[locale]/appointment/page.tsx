"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "./styles.scss";
import ChevronIcon from "@/components/icons/ChevronIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const ALL_SLOTS = [
	"8:00",
	"9:00",
	"10:00",
	"11:00",
	"12:00",
	"13:00",
	"14:00",
	"15:00",
	"16:00",
	"17:00",
	"18:00",
	"19:00",
];

interface BookingForm {
	name: string;
	phone: string;
	message: string;
}

const EMPTY_FORM: BookingForm = { name: "", phone: "", message: "" };

export default function Appointment() {
	const now = new Date();
	const [viewYear, setViewYear] = useState(now.getFullYear());
	const [viewMonth, setViewMonth] = useState(now.getMonth());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
	const [bookedSlots, setBookedSlots] = useState<string[]>([]);
	const [form, setForm] = useState<BookingForm>(EMPTY_FORM);
	const [loading, setLoading] = useState(false);
	const [slotsLoading, setSlotsLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedDate) return;
		const fetchBooked = async () => {
			setSlotsLoading(true);
			const dateStr = selectedDate.toISOString().split("T")[0];
			const { data, error } = await supabase
				.from("bookings")
				.select("time")
				.eq("date", dateStr);
			if (!error && data)
				setBookedSlots(data.map((b: { time: string }) => b.time));
			setSlotsLoading(false);
		};
		fetchBooked();
	}, [selectedDate]);

	const prevMonth = () => {
		if (viewMonth === 0) {
			setViewMonth(11);
			setViewYear((y) => y - 1);
		} else setViewMonth((m) => m - 1);
	};
	const nextMonth = () => {
		if (viewMonth === 11) {
			setViewMonth(0);
			setViewYear((y) => y + 1);
		} else setViewMonth((m) => m + 1);
	};

	const handleDateSelect = (date: Date) => {
		setSelectedDate(date);
		setSelectedSlot(null);
		setBookedSlots([]);
		setError(null);
	};

	const handleSubmit = async () => {
		if (!selectedDate || !selectedSlot) return;
		if (!form.name.trim() || !form.phone.trim()) {
			setError("Please fill in your name and phone number.");
			return;
		}
		setLoading(true);
		setError(null);
		const dateStr = selectedDate.toISOString().split("T")[0];

		const { data: existing } = await supabase
			.from("bookings")
			.select("id")
			.eq("date", dateStr)
			.eq("time", selectedSlot)
			.single();

		if (existing) {
			setError("This slot was just booked. Please pick another time.");
			setBookedSlots((prev) => [...prev, selectedSlot]);
			setSelectedSlot(null);
			setLoading(false);
			return;
		}

		const { error } = await supabase.from("bookings").insert([
			{
				name: form.name.trim(),
				phone: form.phone.trim(),
				message: form.message.trim(),
				date: dateStr,
				time: selectedSlot,
			},
		]);

		setLoading(false);
		if (error) {
			setError("Something went wrong. Please try again.");
			return;
		}
		setSuccess(true);
	};

	// calendar grid
	const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
	const firstDay = new Date(viewYear, viewMonth, 1).getDay();
	const startOffset = firstDay === 0 ? 6 : firstDay - 1;
	const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const isPrevDisabled =
		viewYear === now.getFullYear() && viewMonth <= now.getMonth();

	const dateLabel = selectedDate
		? selectedDate.toLocaleDateString("en-GB", {
				weekday: "long",
				day: "numeric",
				month: "long",
			})
		: null;
	return (
		<main className="appointment">
			<h1 className="main__title">Nezávazná technologická konzultace</h1>
			<div className="appointment-container">
				<div className="calendar">
					<div className="calendar-header">
						<button
							className="calendar-nav-btn"
							onClick={prevMonth}
							disabled={isPrevDisabled}
							aria-label="Previous month"
						>
							<ChevronLeftIcon />
						</button>
						<span className="apt-cal__title">
							{MONTHS[viewMonth]} {viewYear}
						</span>
						<button
							className="calendar-nav-btn"
							onClick={nextMonth}
							aria-label="Next month"
						>
							<ChevronRightIcon />
						</button>
					</div>
					<div className="calendar-grid">
						{DAYS.map((d, i) => (
							<div key={i} style={{ textAlign: "center" }}>
								{d}
							</div>
						))}
						{Array.from({ length: startOffset }).map((_, i) => (
							<div key={`e-${i}`} />
						))}
						{Array.from({ length: daysInMonth }).map((_, i) => {
							const day = i + 1;
							const cellDate = new Date(viewYear, viewMonth, day);
							const isPast = cellDate < todayDate;
							const isToday =
								cellDate.toDateString() === todayDate.toDateString();
							const isSelected =
								selectedDate?.toDateString() === cellDate.toDateString();
							return (
								<button
									key={day}
									className={[
										"calendar-grid-btn",
										isPast ? "calendar-grid-btn--past" : "",
										isToday ? "apt-cal__cell--today" : "",
										isSelected ? "calendar-grid-btn--selected" : "",
									].join(" ")}
									disabled={isPast}
									onClick={() => handleDateSelect(cellDate)}
									aria-label={cellDate.toLocaleDateString("en-GB", {
										day: "numeric",
										month: "long",
									})}
									aria-pressed={isSelected}
								>
									{day}
								</button>
							);
						})}
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-around",
							alignItems: "center",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								gap: "5px",
							}}
						>
							<span
								style={{
									width: "20px",
									height: "20px",
									background: "#00d9ff",
									display: "inline-block",
									borderRadius: "50%",
								}}
							></span>
							<span>selected</span>
						</div>
					</div>
				</div>
				<div className="calendar">
					{/* Slots */}
					<div className="apt-slots">
						<p className="apt-slots__title">
							{dateLabel ? `Available times - ${dateLabel}` : "Select a date"}
						</p>
						{!selectedDate && (
							<p className="apt-slots__hint">
								Pick a day on the calendar to see available slots
							</p>
						)}
						{selectedDate && slotsLoading && (
							<p className="apt-slots__hint">Loading slots...</p>
						)}
						{selectedDate && !slotsLoading && (
							<div className="calendar-time-grid">
								{ALL_SLOTS.map((slot) => {
									const isBooked = bookedSlots.includes(slot);
									const isSelected = selectedSlot === slot;
									return (
										<button
											key={slot}
											className={[
												"calendar-time",
												isBooked ? "calendar-time--booked" : "",
												isSelected ? "calendar-time--selected" : "",
											].join(" ")}
											disabled={isBooked}
											onClick={() => {
												setSelectedSlot(slot);
												setError(null);
											}}
											aria-pressed={isSelected}
										>
											{slot}
										</button>
									);
								})}
							</div>
						)}
					</div>

					{/* Form */}
					{selectedSlot && (
						<div className="calendar-form">
							<p className="apt-form__summary">
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<rect x="3" y="4" width="18" height="18" rx="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
								{dateLabel} at <strong>{selectedSlot}</strong>
							</p>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "40px",
									marginTop: "40px",
								}}
							>
								<div
									className={`input-container ${form.name != "" ? "input-container--active" : ""}`}
								>
									<label className="apt-form__label" htmlFor="apt-name">
										Full name
									</label>
									<input
										id="apt-name"
										type="text"
										placeholder="Jan Novák"
										value={form.name}
										onChange={(e) =>
											setForm((p) => ({ ...p, name: e.target.value }))
										}
									/>
								</div>
								<div
									className={`input-container ${form.phone != "" ? "input-container--active" : ""}`}
								>
									<label className="apt-form__label" htmlFor="apt-phone">
										Phone number
									</label>
									<input
										id="apt-phone"
										className="apt-form__input"
										type="tel"
										placeholder="+420 123 456 789"
										value={form.phone}
										onChange={(e) =>
											setForm((p) => ({ ...p, phone: e.target.value }))
										}
									/>
								</div>
								<div
									className={`input-container ${form.message != "" ? "input-container--active" : ""}`}
								>
									<label className="apt-form__label" htmlFor="apt-msg">
										Message{" "}
										<span className="apt-form__optional">(optional)</span>
									</label>
									<textarea
										id="apt-msg"
										className="textarea"
										placeholder="Tell us about your project..."
										rows={3}
										value={form.message}
										onChange={(e) =>
											setForm((p) => ({ ...p, message: e.target.value }))
										}
									/>
								</div>
							</div>
							{error && <p className="apt-form__error">{error}</p>}
							<button
								className="calendar-submit-btn"
								onClick={handleSubmit}
								disabled={loading}
							>
								{loading ? "Booking..." : "Book consultation"}
							</button>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
