// TODO: LEARN THIS
export async function POST(req: Request) {
	const lead = await req.json();

	const text =
		`🆕 New form submit (pavision.cz)\n\n` +
		`Jméno: ${lead.name ?? "—"}\n` +
		`Telefonní číslo: ${lead.tel ?? "—"}\n` +
		`Email: ${lead.email ?? "—"}\n` +
		`Zpráva: ${lead.message ?? "—"}`;

	try {
		const res = await fetch(
			`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					chat_id: process.env.TELEGRAM_CHAT_LEADS_ID,
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
