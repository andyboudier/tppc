import React, { useState } from 'react';

// "Enter a team" as a note to the office, rather than a registration form.
//
// The fixtures list used to carry full team registration — squads per day,
// interest lists — inside every fixture card, which was too much form for a
// card. Where a club runs in contact mode (see TOURNAMENT_ENTRY in the app),
// a fixture carries this instead: name, email, team, a line or two, sent to
// the office, who build the team board from it as they always have.
//
// Sends to `endpoint` (a JSON POST; the PoloACT hub has one at
// /api/tournament-entry). With no endpoint, or if the send fails, it offers
// a mail link with everything filled in, so nobody is left without a way to
// enter.

const S = {
  label: { display: 'block', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', margin: '8px 0 4px' },
  note: { fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '10px' },
  err: { color: 'var(--danger)', fontSize: '13px', marginTop: '10px', lineHeight: 1.45 },
  ok: { fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5, padding: '12px 14px', background: 'var(--cream-warm)', borderRadius: '6px' },
  link: { color: 'var(--burgundy)', textDecoration: 'underline', textUnderlineOffset: '3px' },
};

export default function EntryContact({ fixture, club, clubId, endpoint, email: officeEmail, contactPrefill }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    name: (contactPrefill && contactPrefill.name) || '',
    email: (contactPrefill && contactPrefill.email) || '',
    mobile: (contactPrefill && contactPrefill.mobile) || '',
    team: '',
    message: '',
    company: '', // honeypot
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setError(''); };
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
  const ready = f.name.trim() && validEmail && f.team.trim();

  const subject = `Tournament entry — ${fixture.name}${f.team.trim() ? ` — ${f.team.trim()}` : ''}`;
  const bodyText = [
    `Fixture: ${fixture.name}${fixture.date ? ` (${fixture.date})` : ''}${fixture.level ? ` · ${fixture.level}` : ''}`,
    `Team: ${f.team.trim()}`,
    `Contact: ${f.name.trim()}`,
    `Email: ${f.email.trim()}`,
    f.mobile.trim() ? `Mobile: ${f.mobile.trim()}` : '',
    f.message.trim() ? `\n${f.message.trim()}` : '',
  ].filter(Boolean).join('\n');
  const mailto = officeEmail
    ? `mailto:${officeEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`
    : '';

  const send = async () => {
    if (!ready) return;
    setBusy(true); setError('');
    try {
      if (!endpoint) throw new Error('no-endpoint');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // clubId picks the office to mail; club is the name shown in it.
          club, clubId: clubId || '', fixture: fixture.name, fixtureDate: fixture.date || '', level: fixture.level || '',
          team: f.team.trim(), name: f.name.trim(), email: f.email.trim(), mobile: f.mobile.trim(),
          message: f.message.trim(), company: f.company,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'send-failed');
      setSent(true);
    } catch (e) {
      setError(mailto
        ? 'That didn’t send. You can email the office instead — the link below has everything filled in.'
        : 'That didn’t send — please try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div style={S.ok}>
        <strong>Sent.</strong> The office has your entry for {fixture.name} and will be in touch with {f.name.trim()} at {f.email.trim()}.
      </div>
    );
  }

  if (!open) {
    return (
      <button className="enter-team-btn" onClick={() => setOpen(true)}>
        ＋ Enter a team for this fixture
      </button>
    );
  }

  return (
    <div className="register-form" style={{ marginTop: '12px' }}>
      <div className="label-eyebrow" style={{ fontSize: '10px', marginBottom: '6px' }}>Enter a team</div>
      <div style={S.note}>Tell the office you’d like to enter and they’ll confirm your place and take the details. Squads and shirt numbers are sorted out nearer the day.</div>
      <label style={S.label} htmlFor={`ec-team-${fixture.id}`}>Team name</label>
      <input id={`ec-team-${fixture.id}`} className="input-field" type="text" value={f.team} onChange={set('team')} placeholder="e.g. Nomad" />
      <label style={S.label} htmlFor={`ec-name-${fixture.id}`}>Your name</label>
      <input id={`ec-name-${fixture.id}`} className="input-field" type="text" autoComplete="name" value={f.name} onChange={set('name')} />
      <label style={S.label} htmlFor={`ec-email-${fixture.id}`}>Email</label>
      <input id={`ec-email-${fixture.id}`} className="input-field" type="email" autoComplete="email" inputMode="email" value={f.email} onChange={set('email')} placeholder="you@example.com" />
      <label style={S.label} htmlFor={`ec-mobile-${fixture.id}`}>Mobile <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
      <input id={`ec-mobile-${fixture.id}`} className="input-field" type="tel" autoComplete="tel" value={f.mobile} onChange={set('mobile')} placeholder="07…" />
      <label style={S.label} htmlFor={`ec-msg-${fixture.id}`}>Anything else <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
      <textarea id={`ec-msg-${fixture.id}`} className="input-field" rows={3} value={f.message} onChange={set('message')} placeholder="Handicaps, who’s in the team, days you can’t do…" style={{ resize: 'vertical', fontFamily: 'inherit' }} />
      {/* Bots fill this; people never see it. */}
      <input type="text" name="company" value={f.company} onChange={set('company')} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button className="btn-primary" onClick={send} disabled={busy || !ready} style={{ flex: 1, padding: '13px', fontSize: '12px', opacity: busy || !ready ? 0.6 : 1 }}>
          {busy ? 'Sending…' : 'Send to the office'}
        </button>
        <button onClick={() => setOpen(false)} disabled={busy} style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', borderRadius: '4px', padding: '0 14px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
      </div>
      {error && (
        <div style={S.err}>
          {error}{' '}
          {mailto && <a href={mailto} style={S.link}>Email the office</a>}
        </div>
      )}
      {!error && mailto && (
        <div style={{ ...S.note, marginTop: '10px', marginBottom: 0 }}>
          Or <a href={mailto} style={S.link}>email the office</a> directly.
        </div>
      )}
    </div>
  );
}
