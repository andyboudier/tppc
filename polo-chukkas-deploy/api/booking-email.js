// POST /api/booking-email — the app asks for a booking email straight after a
// booking is made, amended or cancelled. See _bookingEmail.js for what it
// checks and who it will write to.
import { sendBookingEmail } from './_bookingEmail.js';
import { logEmail } from './_reminders.js';

// A request refused before anything was sent is logged too: those are the
// ones that answer "why did no email come?". Not a malformed or signed-out
// one (400, 401), which anyone could send to fill the log.
const refused = (body, status, error) => logEmail(process.env, fetch, {
  at: Date.now(), type: 'booking', event: String((body && body.event) || ''), kind: String((body && body.kind) || ''),
  status, error: String(error || '').slice(0, 120),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only.' }); return; }
  const auth = String((req.headers && req.headers.authorization) || '');
  const idToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  try {
    const out = await sendBookingEmail({ req: body, idToken, env: process.env });
    if (out.status > 401) await refused(body, out.status, out.body && out.body.error);
    res.status(out.status).json(out.body);
  } catch (e) {
    await refused(body, 500, (e && e.message) || e);
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
