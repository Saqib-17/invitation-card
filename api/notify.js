export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, message } = req.body || {};
  if (!name || !message) return res.status(400).json({ error: "Missing wish details" });
  if (!process.env.RESEND_API_KEY || !process.env.WEDDING_NOTIFICATION_EMAIL) {
    return res.status(200).json({ skipped: true });
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Saqib & Richie Guestbook <onboarding@resend.dev>",
        to: [process.env.WEDDING_NOTIFICATION_EMAIL],
        subject: `New wedding wish from ${name}`,
        text: `${name} left a wish in your wedding guestbook:\n\n${message}`
      })
    });
    if (!response.ok) return res.status(502).json({ error: "Email notification failed" });
    return res.status(200).json({ sent: true });
  } catch { return res.status(500).json({ error: "Unable to send notification" }); }
}
