"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";
import { useLocale } from "next-intl";
import CalendarIcon from "@/components/icons/CalendarIcon";
import "./styles.scss";
import Breadcrumbs from "@/components/common/Breadcrumbs/Breadcrumbs";

const WEEKDAY_SLOTS = [
	"8:00",
	"9:00",
	"10:00",
	"11:00",
	"12:00",
	"13:00",
	"14:00",
	"15:00",
	"16:00",
];
const SATURDAY_SLOTS = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

function getSlots(date: Date) {
	return date.getDay() === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
}

interface BookingForm {
	name: string;
	phone: string;
	message: string;
}

const EMPTY_FORM: BookingForm = { name: "", phone: "", message: "" };

const isSunday = (date: Date) => date.getDay() === 0;

function toLocalDateStr(date: Date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export default function Appointment() {
	const locale = useLocale();
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

	// TODO: learn this
	function getMonthName(year: number, month: number, locale: string) {
		return new Intl.DateTimeFormat(locale, { month: "long" }).format(
			new Date(year, month, 1),
		);
	}

	function getDayLabels(locale: string) {
		return Array.from({ length: 7 }, (_, i) =>
			new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
				new Date(2024, 0, i + 1), // Monday = Jan 1 2024
			),
		);
	}

	// TODO: learn this
	// recalculates only when locale changes, not on every render
	const DAYS = useMemo(() => getDayLabels(locale), [locale]);

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

		const dateStr = toLocalDateStr(selectedDate);

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
		? selectedDate.toLocaleDateString(locale, {
				weekday: "long",
				day: "numeric",
				month: "long",
			})
		: null;

	const slots = selectedDate ? getSlots(selectedDate) : WEEKDAY_SLOTS;

	// const pathRef = useRef<SVGPathElement>(null);

	// useEffect(() => {
	// 	if (!pathRef) return;
	// 	const len = pathRef.current?.getTotalLength();

	// 	console.log(len);
	// }, [success]);

	return (
		<>
			{success && (
				<>
					<div className="appointment-success-banner">
						<div style={{ textAlign: "center" }}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="64"
								height="64"
								fill="none"
								className="bi bi-check-lg"
								viewBox="0 0 16 16"
							>
								<style>{`
								@keyframes drawCheck {
								0% { stroke-dashoffset: 33; stroke: #fff}
								80% { stroke-dashoffset: 0; stroke: #fff}
								100% { stroke-dashoffset: 0; stroke: #adff2f}
								}

								.check {
								stroke-dasharray: 33;
								stroke-dashoffset: 33;
								animation: drawCheck 3s ease forwards 
								}
							`}</style>
								<path
									// ref={pathRef}
									className="check"
									d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"
									stroke="#fff"
									strokeWidth="2"
								/>
							</svg>
						</div>
						<h2 className="apt-success__title">Consultation booked</h2>
						<strong className="appointment-success-date">
							{selectedDate?.toLocaleDateString(locale, {
								weekday: "long",
								day: "numeric",
								month: "long",
								year: "numeric",
							})}{" "}
							at {selectedSlot}
						</strong>
						<p className="apt-success__sub">
							We will contact you as soon as possible!
						</p>
						<button
							className="appointment__close-btn"
							onClick={() => {
								setSuccess(false);
								setSelectedDate(null);
								setSelectedSlot(null);
								setForm(EMPTY_FORM);
							}}
						>
							Close
						</button>
					</div>
					<div
						className={`appointment-success-curtain ${success ? "appointment-success-curtain--active" : ""}`}
					></div>
				</>
			)}
			<main className="appointment">
				<Breadcrumbs currentPage="Nezávazná technologická konzultace" />
				<div style={{ padding: "0 20px 20px" }}>
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
									{getMonthName(viewYear, viewMonth, locale)} {viewYear}
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
												isSunday(cellDate) ? "calendar-grid-btn--sunday" : "",
											].join(" ")}
											disabled={isPast || isSunday(cellDate)}
											onClick={() => handleDateSelect(cellDate)}
											aria-label={cellDate.toLocaleDateString(locale, {
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
									{dateLabel
										? `Available times - ${dateLabel}`
										: "Select a date"}
								</p>
								{!selectedDate && (
									<p className="apt-slots__hint">
										Pick a day on the calendar to see available slots
									</p>
								)}
								{selectedDate && slotsLoading && (
									<p style={{ marginTop: "20px" }}>Loading...</p>
								)}
								{selectedDate && !slotsLoading && (
									<div className="calendar-time-grid">
										{slots.map((slot) => {
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
									<p className="calendar-form-summary">
										<CalendarIcon />
										{dateLabel} at {selectedSlot}
									</p>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "40px",
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
												disabled={success}
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
												disabled={success}
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
												disabled={success}
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
				</div>
			</main>
		</>
	);
}
