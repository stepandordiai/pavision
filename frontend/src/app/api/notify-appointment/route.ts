// TODO: LEARN THIS
export async function POST(req: Request) {
	const appointment = await req.json();

	console.log("chat id:", process.env.TELEGRAM_CHAT_APPOINTMENTS_ID);

	// FIXME:
	const text =
		`🆕 Nová konzultace (pavision.cz)\n\n` +
		`Date: ${appointment.date ?? "—"}\n` +
		`Time: ${appointment.time ?? "—"}\n` +
		`Jméno: ${appointment.name ?? "—"}\n` +
		`Telefonní číslo: ${appointment.tel ?? "—"}\n` +
		`Email: ${appointment.email ?? "—"}\n` +
		`Zpráva: ${appointment.message ?? "—"}`;

	try {
		const res = await fetch(
			`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					chat_id: process.env.TELEGRAM_CHAT_APPOINTMENTS_ID,
					text,
				}),
			},
		);

		if (!res.ok) {
			const error = await res.text();
			console.error("Telegram API error:", error);
			return Response.json(
				{ ok: false, error: "Failed to send notification" },
				{ status: 502 },
			);
		}

		return Response.json({ ok: true });
	} catch (err) {
		console.error("Lead submission error:", err);
		return Response.json(
			{ ok: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}
