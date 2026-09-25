import React, { useEffect, useRef, useState } from 'react';
import { greeting, firstName, readUsual, writeUsual, icsFor, initialsOf } from './home';
import { authErrorText } from './auth';

// The Home tab: who you are to the club at a glance, your next chukka, and
// booking in two taps — Book, then Confirm. The model is in home.js and every
// number on it comes from data the app already holds, priced by the same
// priceBooking the Chukkas tab uses; Home adds a way in, not a second system.
//
// It is drawn dark on purpose, in the club's own burgundy, gold and cream:
// the one screen a member opens every time gets the premium treatment, and
// the working tabs behind it stay as they are. The motion — a travelling
// border on your next chukka, a shimmer on Book, a soft blur-in — is there to
// point at something, and stops for anyone who has asked their phone for
// less motion.

const CSS = `
.hd { --hd-bg:#120d0b; --hd-card:#1f1714; --hd-card2:#2a1f1a; --hd-line:#3d2e24; --hd-burg:#6b1f2a;
  --hd-gold:#b8924a; --hd-gold2:#d4a85a; --hd-cream:#f4ecd8; --hd-muted:#b3a48c; --hd-dim:#9c8d77;
  color:var(--hd-cream); font-family:'Outfit',system-ui,sans-serif; position:relative; }
.hd * { box-sizing:border-box; }
.hd a { color:var(--hd-gold2); }
.hd-dots { position:absolute; left:-16px; right:-16px; top:-24px; height:260px; pointer-events:none;
  background-image:radial-gradient(rgba(212,168,90,.16) 1px,transparent 1px); background-size:14px 14px;
  -webkit-mask-image:linear-gradient(#000,transparent); mask-image:linear-gradient(#000,transparent); }
.hd-serif { font-family:'Fraunces',Georgia,serif; }
.hd-eyebrow { font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:var(--hd-muted); }
.hd-card { background:var(--hd-card); border:1px solid var(--hd-line); border-radius:20px; }
.hd-btn { font-family:inherit; cursor:pointer; color:var(--hd-cream); background:var(--hd-card); border:1px solid var(--hd-line);
  border-radius:14px; min-height:48px; padding:0 14px; font-size:14px; display:flex; align-items:center; justify-content:center; gap:8px; text-decoration:none; }
.hd-btn:hover { border-color:var(--hd-gold); }
.hd-btn:focus-visible, .hd-choice:focus-visible, .hd-link:focus-visible { outline:2px solid var(--hd-gold2); outline-offset:2px; }
.hd-link { background:none; border:0; padding:0; font:inherit; color:var(--hd-gold2); cursor:pointer; text-decoration:none; }
.hd-link:hover { color:#e8c47e; }
.hd-primary { position:relative; overflow:hidden; width:100%; min-height:56px; border-radius:16px; background:var(--hd-burg);
  border:1px solid var(--hd-gold); color:var(--hd-cream); font-family:'Fraunces',Georgia,serif; font-size:20px; cursor:pointer;
  display:flex; align-items:center; justify-content:center; gap:10px; box-shadow:0 10px 30px -12px rgba(107,31,42,.9); }
.hd-primary:disabled { opacity:.55; cursor:default; }
.hd-primary > span { position:relative; }
.hd-shimmer::before { content:''; position:absolute; inset:0; background-image:linear-gradient(105deg,transparent 35%,rgba(244,236,216,.28) 50%,transparent 65%);
  background-size:220% 100%; background-repeat:no-repeat; animation:hd-shimmer 3.2s ease-in-out infinite; }
@keyframes hd-shimmer { from { background-position:180% 0 } to { background-position:-80% 0 } }
@property --hd-a { syntax:'<angle>'; inherits:false; initial-value:0deg; }
.hd-beam { border:1.5px solid transparent; border-radius:20px;
  background:linear-gradient(var(--hd-card),var(--hd-card)) padding-box,
    conic-gradient(from var(--hd-a),var(--hd-line) 0deg,var(--hd-line) 270deg,var(--hd-gold2) 320deg,var(--hd-cream) 340deg,var(--hd-line) 360deg) border-box;
  animation:hd-spin 6s linear infinite; }
@keyframes hd-spin { to { --hd-a:360deg } }
.hd-in { animation:hd-blur .7s cubic-bezier(.2,.7,.2,1) both; animation-delay:var(--d,0s); }
@keyframes hd-blur { from { opacity:0; filter:blur(8px); transform:translateY(8px) } to { opacity:1; filter:blur(0); transform:none } }
.hd-pill { font-size:11px; padding:4px 10px; border-radius:999px; white-space:nowrap; }
.hd-pill-ok { background:#2d3b24; color:#cfe3b8; }
.hd-pill-gold { background:#3a2a1a; color:#e8c47e; }
.hd-pill-red { background:#4a1c20; color:#f0b9b9; }
.hd-pill-muted { background:var(--hd-card2); color:var(--hd-muted); }
.hd-stat { padding:12px 10px; border-radius:14px; background:var(--hd-card2); text-align:center; }
.hd-stat b { display:block; font-family:'Fraunces',Georgia,serif; font-weight:500; font-size:22px; line-height:1.1; }
.hd-stat span { display:block; font-size:11px; color:var(--hd-muted); margin-top:3px; }
.hd-row { display:flex; align-items:center; gap:12px; }
.hd-input { width:100%; min-height:52px; padding:0 16px; border-radius:14px; background:var(--hd-card); border:1.5px solid var(--hd-gold2);
  color:var(--hd-cream); font-size:16px; font-family:inherit; outline:none; }
.hd-input::placeholder { color:var(--hd-dim); }
.hd-choice { font-family:inherit; width:100%; cursor:pointer; color:var(--hd-cream); text-align:left; border-radius:14px;
  background:var(--hd-card); border:1px solid var(--hd-line); }
.hd-choice[aria-pressed="true"] { background:#2a1a17; border:1.5px solid var(--hd-gold2); }
.hd-choice:disabled { opacity:.5; cursor:default; }
.hd-choice.hd-stat { text-align:center; }
.hd-sheet { position:fixed; inset:0; z-index:90; background:var(--hd-bg); display:flex; flex-direction:column;
  padding-top:env(safe-area-inset-top,0px); animation:hd-up .4s cubic-bezier(.2,.7,.2,1) both; }
@keyframes hd-up { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:none } }
.hd-sheet-body { flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:4px 20px 20px; }
.hd-sheet-foot { padding:14px 20px calc(18px + env(safe-area-inset-bottom,0px)); background:#1a1311; border-top:1px solid var(--hd-line); }
.hd-sheet-inner { max-width:540px; margin:0 auto; width:100%; }
.hd-pop { animation:hd-pop .6s cubic-bezier(.2,.7,.2,1) both; }
@keyframes hd-pop { 0% { opacity:0; transform:scale(.6) } 70% { transform:scale(1.06) } 100% { opacity:1; transform:none } }
.hd-ring { animation:hd-ring 1.6s ease-out .3s 2 both; }
@keyframes hd-ring { from { opacity:.6; transform:scale(1) } to { opacity:0; transform:scale(1.9) } }
.hd-skel { background:linear-gradient(90deg,var(--hd-card) 0%,var(--hd-card2) 50%,var(--hd-card) 100%); background-size:200% 100%;
  animation:hd-skel 1.4s ease-in-out infinite; border-radius:20px; }
@keyframes hd-skel { from { background-position:200% 0 } to { background-position:-200% 0 } }
@media (prefers-reduced-motion:reduce) {
  .hd-in,.hd-sheet,.hd-pop,.hd-ring,.hd-skel,.hd-beam,.hd-shimmer::before { animation:none !important; }
  .hd-ring { opacity:0; }
}
`;

const Icon = ({ d, size = 18, stroke = 'currentColor', children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);
const I = {
  back: 'M15 6l-6 6 6 6',
  chev: 'M9 6l6 6-6 6',
  pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z',
  cal: 'M3 10h18M8 3v4M16 3v4M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z',
  share: 'M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M12 3v12M8 7l4-4 4 4',
  tick: 'M5 12.5l4.5 4.5L19 7.5',
  lock: 'M8 10V7a4 4 0 018 0v3M6 10h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2z',
  live: 'M20 13a8 8 0 11-16 0 8 8 0 0116 0zM12 9v4l2.5 2.5M10 2h4',
  cap: 'M2 9l10-5 10 5-10 5L2 9zM6 11v5c3 2 9 2 12 0v-5',
  camera: 'M4 8h3l2-3h6l2 3h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1zM12 17a4 4 0 100-8 4 4 0 000 8z',
};

// The club's own badge, cut from the app icon as a round (public/tppc-crest.png)
// and set in a thin gold ring so it sits on the dark ground like a medal.
const Crest = ({ size = 44 }) => (
  <img src="/tppc-crest.png" alt="Tedworth Park Polo Club" width={size} height={size}
    style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, display: 'block', background: '#fff',
      boxShadow: '0 0 0 1.5px var(--hd-gold), 0 6px 18px -6px rgba(0,0,0,.6)' }} />
);

// ── Profile picture ─────────────────────────────────────────────────────────
// Google's photo loads from googleusercontent, which refuses some referrers,
// hence no-referrer. A broken picture falls back to initials.
function Avatar({ src, name, size = 56, onClick }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  const inner = src && !broken
    ? <img src={src} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }} />
    : <span className="hd-serif" style={{ fontSize: size * 0.38, color: 'var(--hd-gold2)' }}>{initialsOf(name) || '?'}</span>;
  const ring = { width: size, height: size, borderRadius: '50%', flexShrink: 0, position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--hd-card2)',
    boxShadow: '0 0 0 1.5px var(--hd-gold), 0 6px 18px -6px rgba(0,0,0,.6)' };
  if (!onClick) return <div style={ring} aria-hidden="true">{inner}</div>;
  return (
    <button type="button" onClick={onClick} aria-label="Change your picture" style={{ ...ring, border: 0, padding: 0, cursor: 'pointer' }}>
      {inner}
      <span aria-hidden="true" style={{ position: 'absolute', right: -2, bottom: -2, width: 22, height: 22, borderRadius: '50%',
        background: 'var(--hd-burg)', border: '1.5px solid var(--hd-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon d={I.camera} size={12} stroke="var(--hd-cream)" />
      </span>
    </button>
  );
}

// Shrink a chosen picture to a 256px square, centre-cropped, as a JPEG data
// URL — small enough (~20–40 kB) to keep on the member's own profile document.
const shrinkPicture = (file) => new Promise((resolve, reject) => {
  if (!file || !/^image\//.test(file.type)) { reject(new Error('Choose a picture.')); return; }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    c.getContext('2d').drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, 256, 256);
    URL.revokeObjectURL(url);
    resolve(c.toDataURL('image/jpeg', 0.85));
  };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That picture could not be read.')); };
  img.src = url;
});

function PhotoSheet({ account, name, onSave, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const own = account.ownPhoto;              // '' | 'none' | data URL
  const provider = account.providerPhoto;    // Google's, if any
  const shown = own === 'none' ? '' : own || provider;
  const run = async (value) => {
    setBusy(true); setError('');
    try { await onSave(value); onClose(); } catch (e) { setError(String((e && e.message) || e)); }
    setBusy(false);
  };
  const pick = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try { await run(await shrinkPicture(f)); } catch (err) { setError(String((err && err.message) || err)); }
  };
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="hd" role="dialog" aria-modal="true" aria-labelledby="hd-photo-title"
      style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(0,0,0,.66)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={busy ? undefined : onClose}>
      <div onClick={(e) => e.stopPropagation()} className="hd-card"
        style={{ width: '100%', maxWidth: 480, borderRadius: '24px 24px 0 0', padding: '22px 20px calc(22px + env(safe-area-inset-bottom,0px))',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', animation: 'hd-up .35s cubic-bezier(.2,.7,.2,1) both' }}>
        <Avatar src={shown} name={name} size={96} />
        <h2 id="hd-photo-title" className="hd-serif" style={{ fontSize: '22px', fontWeight: 500, margin: '6px 0 0' }}>Your picture</h2>
        <div style={{ fontSize: '13px', color: 'var(--hd-muted)', textAlign: 'center', lineHeight: 1.5 }}>Shown on your Home screen. Kept on your own profile.</div>
        <input ref={fileRef} type="file" accept="image/*" onChange={pick} style={{ display: 'none' }} />
        <button type="button" className="hd-primary" disabled={busy} onClick={() => fileRef.current && fileRef.current.click()}>
          <span>{busy ? 'Saving\u2026' : shown ? 'Change picture' : 'Add a picture'}</span>
        </button>
        {provider && own && (
          <button type="button" className="hd-btn" disabled={busy} onClick={() => run('')} style={{ width: '100%' }}>Use my Google picture</button>
        )}
        {shown && (
          <button type="button" className="hd-btn" disabled={busy} onClick={() => run('none')} style={{ width: '100%' }}>Remove picture</button>
        )}
        {error && <div role="alert" style={{ fontSize: '13px', color: '#f0b9b9' }}>{error}</div>}
        <button type="button" className="hd-link" onClick={onClose} disabled={busy} style={{ minHeight: '40px', fontSize: '14px' }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Your profile ────────────────────────────────────────────────────────────
// Everything a member keeps about themselves, in one place: picture, name,
// handicap, mobile and HPA number (these travel to the club's record through
// the profile ↔ record reconcile), the email they sign in with (read-only —
// the club matches on it), their password, and the ways they sign in.
const PROVIDER_NAMES = { 'google.com': 'Google', 'apple.com': 'Apple', password: 'Email and password', emailLink: 'Email link' };
const fld = { width: '100%', minHeight: 48, padding: '0 14px', borderRadius: 12, background: 'var(--hd-card2)', border: '1px solid var(--hd-line)', color: 'var(--hd-cream)', fontSize: 16, fontFamily: 'inherit', outline: 'none' };
const lbl = { display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--hd-muted)', margin: '14px 0 6px' };

function ProfileSheet({ account, profile, me, handicapOptions, onSave, onChangePassword, onResetEmail, onLinkProvider, onSignOut, onPhoto, onClose }) {
  const p = profile || {};
  const [draft, setDraft] = useState({
    name: p.name || (me && me.name) || account.name || '',
    handicap: p.handicap != null && p.handicap !== '' ? String(p.handicap) : (me && me.handicapRaw != null ? String(me.handicapRaw) : ''),
    mobile: p.mobile || (me && me.mobile) || '',
    hpa: p.hpa || '',
  });
  const [pw, setPw] = useState({ a: '', b: '' });
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState({ kind: '', text: '' });
  const headRef = useRef(null);
  const providers = account.providers || [];
  const hasPassword = providers.includes('password');
  const set = (k) => (e) => setDraft(d => ({ ...d, [k]: e.target.value }));

  useEffect(() => {
    headRef.current && headRef.current.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('hd-sheet-open');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.body.classList.remove('hd-sheet-open'); window.removeEventListener('keydown', onKey); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const run = async (what, fn, ok) => {
    setBusy(what); setMsg({ kind: '', text: '' });
    try { await fn(); setMsg({ kind: 'ok', text: ok }); return true; }
    catch (e) { setMsg({ kind: 'err', text: authErrorText(e) || String((e && e.message) || e) }); return false; }
    finally { setBusy(''); }
  };
  const save = () => {
    if (!draft.name.trim()) { setMsg({ kind: 'err', text: 'Please give your name.' }); return; }
    run('save', () => onSave({ name: draft.name.trim(), handicap: draft.handicap === '' ? null : Number(draft.handicap), mobile: draft.mobile.trim(), hpa: draft.hpa.trim() }),
      'Saved. The club\u2019s list is updated too.');
  };
  const changePw = async () => {
    if (pw.a.length < 8) { setMsg({ kind: 'err', text: 'Use at least 8 characters.' }); return; }
    if (pw.a !== pw.b) { setMsg({ kind: 'err', text: 'The two passwords don\u2019t match.' }); return; }
    if (await run('pw', () => onChangePassword(pw.a), hasPassword ? 'Password changed.' : 'Password added \u2014 you can now sign in with your email too.')) setPw({ a: '', b: '' });
  };

  return (
    <div className="hd hd-sheet" role="dialog" aria-modal="true" aria-labelledby="hd-prof-title">
      <div className="hd-sheet-inner hd-row" style={{ padding: '18px 20px 8px' }}>
        <button type="button" onClick={onClose} aria-label="Back to Home" className="hd-btn" style={{ width: 44, height: 44, minHeight: 44, padding: 0, borderRadius: '50%', background: 'var(--hd-card2)' }}>
          <Icon d={I.back} size={20} />
        </button>
        <h2 id="hd-prof-title" ref={headRef} tabIndex={-1} className="hd-serif" style={{ fontSize: 24, fontWeight: 500, margin: 0, outline: 'none' }}>Your profile</h2>
      </div>
      <div className="hd-sheet-body">
        <div className="hd-sheet-inner">
          <div className="hd-row" style={{ gap: 16, padding: '8px 0 6px' }}>
            <Avatar src={account.photo} name={draft.name} size={72} onClick={onPhoto} />
            <div style={{ minWidth: 0 }}>
              <div className="hd-serif" style={{ fontSize: 20 }}>{draft.name || 'Your name'}</div>
              <div style={{ fontSize: 13, color: 'var(--hd-muted)' }}>{account.email}</div>
              {account.team ? <div style={{ fontSize: 13, color: 'var(--hd-muted)' }}>Team: {account.team}</div> : null}
            </div>
          </div>

          <label style={lbl} htmlFor="pf-name">Name</label>
          <input id="pf-name" style={fld} value={draft.name} onChange={set('name')} autoComplete="name" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl} htmlFor="pf-hcp">Handicap</label>
              <select id="pf-hcp" style={fld} value={draft.handicap} onChange={set('handicap')}>
                <option value="">Not set</option>
                {handicapOptions.map(h => <option key={h} value={String(h)}>{h < 0 ? `\u2212${Math.abs(h)}` : h}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl} htmlFor="pf-hpa">HPA number</label>
              <input id="pf-hpa" style={fld} value={draft.hpa} onChange={set('hpa')} placeholder="Optional" />
            </div>
          </div>
          <label style={lbl} htmlFor="pf-mob">Mobile</label>
          <input id="pf-mob" style={fld} type="tel" value={draft.mobile} onChange={set('mobile')} autoComplete="tel" placeholder="07…" />
          <label style={lbl} htmlFor="pf-email">Email</label>
          <input id="pf-email" style={{ ...fld, opacity: .7 }} value={account.email} readOnly />
          <div style={{ fontSize: 12, color: 'var(--hd-dim)', marginTop: 6 }}>Your email is how you sign in and how the club finds your record, so it can only be changed by the club.</div>
          <button type="button" className="hd-primary" style={{ marginTop: 18 }} disabled={!!busy} onClick={save}><span>{busy === 'save' ? 'Saving\u2026' : 'Save details'}</span></button>

          <div style={{ borderTop: '1px solid var(--hd-line)', margin: '26px 0 4px' }} />
          <div className="hd-serif" style={{ fontSize: 19, marginTop: 14 }}>{hasPassword ? 'Change password' : 'Add a password'}</div>
          <div style={{ fontSize: 13, color: 'var(--hd-muted)', marginTop: 4, lineHeight: 1.5 }}>
            {hasPassword ? 'At least 8 characters.' : 'You sign in with ' + (providers.map(x => PROVIDER_NAMES[x] || x).join(' and ') || 'another method') + '. Add a password to sign in with your email as well.'}
          </div>
          <label style={lbl} htmlFor="pf-pw1">New password</label>
          <input id="pf-pw1" style={fld} type="password" autoComplete="new-password" value={pw.a} onChange={e => setPw(v => ({ ...v, a: e.target.value }))} />
          <label style={lbl} htmlFor="pf-pw2">Again</label>
          <input id="pf-pw2" style={fld} type="password" autoComplete="new-password" value={pw.b} onChange={e => setPw(v => ({ ...v, b: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: hasPassword ? '1fr 1fr' : '1fr', gap: 10, marginTop: 14 }}>
            <button type="button" className="hd-btn" disabled={!!busy || !pw.a} onClick={changePw} style={{ borderColor: 'var(--hd-gold)' }}>{busy === 'pw' ? 'Saving\u2026' : hasPassword ? 'Change password' : 'Add password'}</button>
            {hasPassword && <button type="button" className="hd-btn" disabled={!!busy} onClick={() => run('reset', onResetEmail, `We\u2019ve emailed a reset link to ${account.email}.`)}>Email me a reset link</button>}
          </div>

          <div style={{ borderTop: '1px solid var(--hd-line)', margin: '26px 0 4px' }} />
          <div className="hd-serif" style={{ fontSize: 19, marginTop: 14 }}>How you sign in</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {providers.map(x => <span key={x} className="hd-pill hd-pill-ok" style={{ fontSize: 12, padding: '6px 12px' }}>{PROVIDER_NAMES[x] || x}</span>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
            {!providers.includes('google.com') && <button type="button" className="hd-btn" disabled={!!busy} onClick={() => run('google', () => onLinkProvider('google'), 'Google added \u2014 either will sign you in.')}>Add Google</button>}
            {!providers.includes('apple.com') && <button type="button" className="hd-btn" disabled={!!busy} onClick={() => run('apple', () => onLinkProvider('apple'), 'Apple added \u2014 either will sign you in.')}>Add Apple</button>}
          </div>

          {msg.text && <div role={msg.kind === 'err' ? 'alert' : 'status'} style={{ marginTop: 16, fontSize: 14, lineHeight: 1.5, color: msg.kind === 'err' ? '#f0b9b9' : '#cfe3b8' }}>{msg.text}</div>}

          <div style={{ borderTop: '1px solid var(--hd-line)', margin: '26px 0 12px' }} />
          <button type="button" className="hd-btn" style={{ width: '100%', marginBottom: 24 }} onClick={() => { onClose(); onSignOut(); }}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

// ── Logged out: the sign-in screen ──────────────────────────────────────────
// Home is the way in. Booking chukkas and lessons, your draw and what you owe
// need you signed in; the fixtures and the live scores are open to anyone, and
// their tabs stay in the bar for exactly that.
function Logon({ onSignIn, openFixtures, openLive }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '6px' }}>
      <div className="hd-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
        <Crest size={120} />
        <div className="hd-eyebrow" style={{ marginTop: '8px' }}>Tedworth Park Polo Club</div>
        <h2 className="hd-serif" style={{ fontSize: '32px', fontWeight: 500, lineHeight: 1.12, margin: 0 }}>Welcome back</h2>
        <p style={{ fontSize: '14px', color: 'var(--hd-muted)', maxWidth: '320px', lineHeight: 1.55, margin: 0 }}>
          Sign in to book chukkas and lessons, see your team when the draw is out, and keep track of what you owe.
        </p>
      </div>
      <div className="hd-in" style={{ '--d': '.12s', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
        <button type="button" className="hd-primary hd-shimmer" onClick={() => onSignIn('signin')}><span>Sign in</span></button>
        <button type="button" className="hd-btn" onClick={() => onSignIn('create')} style={{ minHeight: '52px', fontSize: '15px' }}>
          <Icon d={I.lock} stroke="var(--hd-gold2)" />New here? Create an account
        </button>
        <div style={{ fontSize: '12px', color: 'var(--hd-dim)', textAlign: 'center', lineHeight: 1.5 }}>
          Google, Apple or your email. Use the email the club has for you and we&rsquo;ll find your record.
        </div>
      </div>
      <div className="hd-in" style={{ '--d': '.24s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
        <button type="button" className="hd-btn" onClick={openFixtures}><Icon d={I.cal} stroke="var(--hd-gold2)" />Fixtures</button>
        <button type="button" className="hd-btn" onClick={openLive}><Icon d={I.live} stroke="var(--hd-gold2)" />Live scores</button>
      </div>
    </div>
  );
}

// ── The booking sheet ───────────────────────────────────────────────────────
function BookSheet({ me, sessions: mySessions, people = [], sessionsFor, initialKey, quote, book, undo, onClose, directions }) {
  const usual = readUsual(me.id);
  // Who is being booked: 'me', or a teammate's player id. Each person has
  // their own standing — booked, blocked by handicap — so the list follows.
  const [who, setWho] = useState('me');
  const sessions = who === 'me' || !sessionsFor ? mySessions : sessionsFor(who);
  const person = people.find(p => p.id === who) || { id: 'me', name: me.name, me: true };
  const first = firstName(person.name);
  const [dayKey, setDayKey] = useState(initialKey);
  const [n, setN] = useState(usual.chukkas);
  const [pony, setPony] = useState(usual.pony);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null); // the booking result, once confirmed
  const headRef = useRef(null);

  useEffect(() => {
    headRef.current && headRef.current.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('hd-sheet-open');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('hd-sheet-open');
      window.removeEventListener('keydown', onKey);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Move focus to the heading as the view changes, so a screen reader hears
  // the confirmation rather than silence.
  useEffect(() => { headRef.current && headRef.current.focus(); }, [done]);

  const cur = sessions.find(s => s.key === dayKey) || null;
  const fixed = cur && cur.fixed ? cur.fixed : null;
  const max = cur ? cur.max : 4;
  const chukkas = fixed || Math.min(n, max);
  const ponyOn = cur && cur.instructional ? true : pony;
  const q = cur ? quote(cur.key, chukkas, ponyOn, who) : null;
  const waitlist = cur && cur.status === 'full';
  const canConfirm = cur && (cur.status === 'open' || waitlist) && !busy;

  const confirm = async () => {
    if (!canConfirm) return;
    setBusy(true); setError('');
    const r = await book(cur.key, chukkas, ponyOn, waitlist, who);
    setBusy(false);
    if (!r || r.error) { setError((r && r.error) || 'That didn’t go through — please try again.'); return; }
    if (!cur.fixed && who === 'me') writeUsual(me.id, { chukkas, pony: ponyOn });
    setDone({ ...r, session: cur, chukkas, pony: ponyOn, price: q, person });
  };

  const doUndo = async () => {
    if (!done) return;
    setBusy(true);
    await undo(done);
    setBusy(false);
    setDone(null);
  };

  // Called as a function, not mounted as a component, so a re-render does not
  // remount the heading and lose focus.
  const head = ({ title, sub, onBack, backLabel }) => (
    <div className="hd-sheet-inner hd-row" style={{ padding: '18px 20px 12px' }}>
      <button type="button" onClick={onBack} aria-label={backLabel} className="hd-btn" style={{ width: 44, height: 44, minHeight: 44, padding: 0, borderRadius: '50%', background: 'var(--hd-card2)' }}>
        <Icon d={I.back} size={20} />
      </button>
      <div>
        <div className="hd-eyebrow">{sub}</div>
        <h2 ref={headRef} tabIndex={-1} className="hd-serif" style={{ fontSize: '24px', fontWeight: 500, lineHeight: 1.2, margin: 0, outline: 'none' }}>{title}</h2>
      </div>
    </div>
  );

  if (done) {
    const s = done.session;
    const where = s.ground ? ` · ${s.ground}` : '';
    const addToCalendar = () => {
      const blob = new Blob([icsFor({ title: `${s.name} · Tedworth Park`, start: s.start, minutes: 60 + 15 * Math.max(0, done.chukkas - 2), location: s.ground || 'Tedworth Park Polo Club', note: `${done.chukkas} chukka${done.chukkas === 1 ? '' : 's'}` })], { type: 'text/calendar' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `tppc-${s.key}.ics`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    };
    const booked = done.person || { name: me.name, me: true };
    const shareText = `${booked.name} is on for ${s.name}, ${s.dateLabel} at ${s.time}${where}.`;
    const share = async () => {
      if (navigator.share) { try { await navigator.share({ text: shareText }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener');
    };
    return (
      <div className="hd hd-sheet" role="dialog" aria-modal="true" aria-labelledby="hd-done-title">
        <div className="hd-sheet-body">
          <div className="hd-sheet-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '56px' }}>
            <div style={{ position: 'relative', width: 96, height: 96 }}>
              <div className="hd-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--hd-gold2)' }} />
              <div className="hd-pop" style={{ position: 'relative', width: 96, height: 96, borderRadius: '50%', background: 'var(--hd-burg)', border: '1.5px solid var(--hd-gold2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={I.tick} size={44} stroke="var(--hd-cream)" />
              </div>
            </div>
            <div className="hd-in" style={{ '--d': '.25s', textAlign: 'center', marginTop: '26px' }}>
              <h2 id="hd-done-title" ref={headRef} tabIndex={-1} className="hd-serif" style={{ fontSize: '30px', fontWeight: 500, lineHeight: 1.15, margin: 0, outline: 'none' }}>
                {done.waitlisted
                  ? `${booked.me ? 'Number' : `${firstName(booked.name)} is number`} ${done.place} on the waiting list`
                  : booked.me ? `You\u2019re on ${s.fullDay}\u2019s list` : `${firstName(booked.name)}\u2019s on ${s.fullDay}\u2019s list`}
              </h2>
              <div style={{ fontSize: '14px', color: 'var(--hd-muted)', marginTop: '8px' }}>{s.dateLabel} &middot; {s.time}{where}</div>
            </div>
            <div className="hd-card hd-in" style={{ '--d': '.4s', width: '100%', marginTop: '26px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', borderRadius: '18px' }}>
              <div style={{ display: 'flex' }}><span style={{ color: 'var(--hd-muted)', flex: 1 }}>Chukkas</span><span>{done.chukkas}</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: 'var(--hd-muted)', flex: 1 }}>Pony</span><span>{done.pony ? 'Club pony' : 'My own pony'}</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: 'var(--hd-muted)', flex: 1 }}>{done.waitlisted ? 'Charged' : booked.me ? 'On your invoice' : `On ${firstName(booked.name)}\u2019s invoice`}</span><span style={{ color: 'var(--hd-gold2)' }}>{done.waitlisted ? 'Only if a place comes up' : done.owedText || 'No charge'}</span></div>
              <div style={{ fontSize: '12px', color: 'var(--hd-muted)', borderTop: '1px solid var(--hd-line)', paddingTop: '10px', lineHeight: 1.5 }}>
                {done.waitlisted ? 'The captain will be in touch if a place comes up.'
                  : booked.me ? 'Your team and chukkas show on Home as soon as the captain publishes the draw.'
                  : `${firstName(booked.name)}\u2019s team and chukkas show on their Home once the captain publishes the draw. You can take them off the list if plans change.`}
              </div>
            </div>
            {!done.waitlisted && (
              <div className="hd-in" style={{ '--d': '.4s', width: '100%', marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button type="button" className="hd-btn" onClick={addToCalendar}><Icon d={I.cal} stroke="var(--hd-gold2)" />Add to calendar</button>
                <button type="button" className="hd-btn" onClick={share}><Icon d={I.share} stroke="var(--hd-gold2)" />Share</button>
              </div>
            )}
          </div>
        </div>
        <div className="hd-sheet-foot">
          <div className="hd-sheet-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <button type="button" className="hd-primary" onClick={onClose}><span>Back to Home</span></button>
            <button type="button" className="hd-link" onClick={doUndo} disabled={busy} style={{ minHeight: '44px', fontSize: '14px' }}>
              {busy ? 'Undoing…' : done.waitlisted ? 'Take me off the waiting list' : 'Undo this booking'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ponyOptions = [
    { id: true, label: 'Club pony', sub: cur && cur.instructional ? 'Included in the session' : 'Hired from the club' },
    { id: false, label: 'My own pony', sub: cur && cur.instructional ? 'Not for this session' : 'No hire charge' },
  ];
  const countOptions = Array.from({ length: Math.min(max, 6) }, (_, i) => i + 1);

  return (
    <div className="hd hd-sheet" role="dialog" aria-modal="true" aria-label="Book a chukka">
      {head({ title: 'Book a chukka', sub: who === 'me' ? `${me.name}${me.handicapText != null ? ` · ${me.handicapText}` : ''}` : `For ${person.name}`, onBack: onClose, backLabel: 'Back to Home' })}
      <div className="hd-sheet-body">
        <div className="hd-sheet-inner" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {people.length > 1 && (
            <div>
              <div className="hd-eyebrow" style={{ marginBottom: '8px' }} id="hd-who-label">Who&rsquo;s playing</div>
              <div role="group" aria-labelledby="hd-who-label" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
                {people.map(p => (
                  <button key={p.id} type="button" className="hd-choice" aria-pressed={who === p.id}
                    onClick={() => { setWho(p.id); setError(''); }}
                    style={{ width: 'auto', flexShrink: 0, minHeight: '44px', padding: '0 14px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                    {p.me ? 'Me' : p.name}{p.handicapText ? <span style={{ color: 'var(--hd-muted)', marginLeft: '6px', fontSize: '12px' }}>{p.handicapText}</span> : null}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--hd-dim)', marginTop: '6px' }}>
                You can book anyone on your team{people[0] && people[0].team ? ` (${people[0].team})` : ''}. Their charge goes on their own invoice.
              </div>
            </div>
          )}
          {people.length <= 1 && (
            <div style={{ fontSize: '12px', color: 'var(--hd-dim)', lineHeight: 1.5 }}>
              Booking for your team too? Once the club puts you and your teammates in the same team (Players &rarr; Team), you can book them from here.
            </div>
          )}
          <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <legend className="hd-eyebrow" style={{ marginBottom: '8px' }}>When</legend>
            {sessions.map(s => {
              const on = s.key === dayKey;
              const pickable = s.status === 'open' || s.status === 'full';
              const tag = s.status === 'booked' ? ['Booked', 'ok'] : s.status === 'waitlisted' ? [`Waiting #${s.waitPlace}`, 'gold']
                : s.status === 'full' ? ['Full · waiting list', 'gold'] : s.status === 'closed' ? ['Closed', 'muted']
                : s.status === 'blocked' ? ['Beginners only', 'muted'] : on ? ['Selected', 'gold'] : null;
              return (
                <button key={s.key} type="button" className="hd-choice hd-row" aria-pressed={on} disabled={!pickable}
                  onClick={() => { setDayKey(s.key); setError(''); }} style={{ minHeight: '60px', padding: '10px 14px' }}>
                  <span style={{ width: 44, textAlign: 'center', flexShrink: 0 }}>
                    <span style={{ display: 'block', fontSize: '11px', letterSpacing: '1px', color: 'var(--hd-muted)' }}>{s.dow}</span>
                    <span className="hd-serif" style={{ display: 'block', fontSize: '21px' }}>{s.dayNum}</span>
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: '15px', fontWeight: 500 }}>{s.name}</span>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--hd-muted)' }}>{s.time}{s.ground ? ` · ${s.ground}` : ''} &middot; {s.blurb}</span>
                  </span>
                  {tag && <span className={`hd-pill hd-pill-${tag[1]}`}>{tag[0]}</span>}
                </button>
              );
            })}
          </fieldset>

          {cur && (
            <>
              <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
                <legend className="hd-eyebrow" style={{ marginBottom: '8px' }}>
                  Chukkas{fixed ? <span style={{ textTransform: 'none', letterSpacing: 0, marginLeft: '8px' }}>&middot; fixed at {fixed} for this session</span> : null}
                </legend>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${countOptions.length}, minmax(0,1fr))`, gap: '8px' }}>
                  {countOptions.map(k => {
                    const on = k === chukkas;
                    const off = !!fixed && k !== fixed;
                    return (
                      <button key={k} type="button" className="hd-choice" aria-pressed={on} disabled={off} onClick={() => setN(k)}
                        style={{ minHeight: '48px', textAlign: 'center', fontSize: '18px', background: on ? 'var(--hd-burg)' : undefined }}>{k}</button>
                    );
                  })}
                </div>
              </fieldset>
              <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
                <legend className="hd-eyebrow" style={{ marginBottom: '8px' }}>Pony</legend>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {ponyOptions.map(p => {
                    const off = !!(cur.instructional && !p.id);
                    return (
                      <button key={String(p.id)} type="button" className="hd-choice" aria-pressed={ponyOn === p.id} disabled={off} onClick={() => setPony(p.id)} style={{ minHeight: '62px', padding: '10px 12px' }}>
                        <span style={{ display: 'block', fontSize: '14px', fontWeight: 500 }}>{p.label}</span>
                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--hd-muted)', marginTop: '2px' }}>{p.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              {cur.ground && directions(cur.ground) && (
                <a href={directions(cur.ground)} target="_blank" rel="noopener noreferrer" className="hd-row" style={{ fontSize: '13px', textDecoration: 'none', gap: '6px' }}>
                  <Icon d={I.pin} size={16} />Directions to {cur.ground}
                </a>
              )}
            </>
          )}
          {!cur && (
            <div style={{ fontSize: '14px', color: 'var(--hd-muted)', lineHeight: 1.5 }}>
              Nothing is open to book just now. Sessions open again once this week&rsquo;s have been played.
            </div>
          )}
        </div>
      </div>
      <div className="hd-sheet-foot">
        <div className="hd-sheet-inner" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {cur && q && (
            <div>
              <div className="hd-row" style={{ alignItems: 'baseline', gap: '8px' }}>
                <div style={{ fontSize: '13px', color: 'var(--hd-muted)', flex: 1 }}>{cur.name}, {cur.dow.charAt(0) + cur.dow.slice(1).toLowerCase()} {cur.dayNum} &middot; {chukkas} chukka{chukkas === 1 ? '' : 's'}</div>
                <div className="hd-serif" style={{ fontSize: '26px', color: 'var(--hd-gold2)' }}>{waitlist ? 'Free' : q.price}</div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--hd-muted)', marginTop: '2px' }}>{waitlist ? 'Joining the waiting list costs nothing — you’re charged only if a place comes up.' : q.note}</div>
            </div>
          )}
          {error && <div role="alert" style={{ fontSize: '13px', color: '#f0b9b9', lineHeight: 1.45 }}>{error}</div>}
          <button type="button" className="hd-primary hd-shimmer" disabled={!canConfirm} onClick={confirm}>
            <span>{busy ? 'Booking…' : waitlist ? 'Join the waiting list' : 'Confirm booking'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Pieces of Home ──────────────────────────────────────────────────────────
function NextChukka({ s, directions, onOpen }) {
  const url = s.ground ? directions(s.ground) : null;
  return (
    <div className="hd-beam hd-in" style={{ '--d': '.18s', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="hd-row" style={{ gap: '8px' }}>
        <div className="hd-eyebrow" style={{ flex: 1 }}>{s.status === 'waitlisted' ? 'Waiting list' : 'Your next chukka'}</div>
        {s.status === 'waitlisted'
          ? <span className="hd-pill hd-pill-gold">Number {s.waitPlace}</span>
          : s.slots.length ? <span className="hd-pill hd-pill-ok">Draw is out</span> : <span className="hd-pill hd-pill-muted">Draw to come</span>}
      </div>
      <div className="hd-row" style={{ alignItems: 'flex-end', gap: '14px' }}>
        <div className="hd-serif" style={{ fontSize: '44px', lineHeight: 1, color: 'var(--hd-gold2)' }}>{s.time}</div>
        <div style={{ paddingBottom: '4px' }}>
          <div style={{ fontSize: '16px' }}>{s.name}</div>
          <div style={{ fontSize: '13px', color: 'var(--hd-muted)' }}>{s.dateLabel}</div>
        </div>
      </div>
      {s.slots.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {s.slots.map(c => (
            <span key={c.number} className="hd-pill" style={{ background: c.team === 'Blue' ? '#1e3552' : '#efe6d0', color: c.team === 'Blue' ? '#dde6f0' : '#4a1419', fontSize: '12px', padding: '5px 10px' }}>
              Chukka {c.number} &middot; {c.time} &middot; {c.team}
            </span>
          ))}
        </div>
      )}
      <div className="hd-row" style={{ fontSize: '13px', color: 'var(--hd-muted)', gap: '14px', flexWrap: 'wrap' }}>
        <span>{s.entry ? `${s.entry.chukkas} chukka${s.entry.chukkas === 1 ? '' : 's'}` : ''}{s.entry && s.entry.ponyHire ? ' · club pony' : ''}</span>
        {s.ground && (url
          ? <a href={url} target="_blank" rel="noopener noreferrer" className="hd-row" style={{ gap: '4px', textDecoration: 'none' }}><Icon d={I.pin} size={15} />{s.ground}</a>
          : <span>{s.ground}</span>)}
        <button type="button" className="hd-link" onClick={onOpen} style={{ marginLeft: 'auto', fontSize: '13px' }}>See the list</button>
      </div>
    </div>
  );
}

function Fixtures({ items, onOpen, onLive, delay }) {
  if (!items.length) return null;
  return (
    <section className="hd-in" style={{ '--d': delay, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h3 className="hd-serif" style={{ fontSize: '19px', fontWeight: 500, margin: '4px 0' }}>Coming up</h3>
      {items.map(f => (
        <div key={f.id} className="hd-card hd-row" style={{ padding: '12px 14px', borderRadius: '16px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '15px' }}>{f.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--hd-muted)' }}>{f.date}{f.where ? ` · ${f.where}` : ''}</div>
          </div>
          {f.live
            ? <button type="button" className="hd-pill hd-pill-red" onClick={onLive} style={{ border: 0, cursor: 'pointer', fontFamily: 'inherit', minHeight: '32px' }}>On now &middot; Live</button>
            : f.entered ? <span className="hd-pill hd-pill-ok">Entered</span>
            : f.closed ? <span className="hd-pill hd-pill-muted">Closed</span>
            : <button type="button" className="hd-link" onClick={() => onOpen(f.id)} style={{ fontSize: '13px', minHeight: '40px', whiteSpace: 'nowrap' }}>Register interest</button>}
        </div>
      ))}
    </section>
  );
}

function CaptainPanel({ c, go }) {
  return (
    <section className="hd-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} aria-label="Captain">
      <div className="hd-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="hd-row" style={{ gap: '8px' }}>
          <span className="hd-pill" style={{ background: 'var(--hd-burg)', border: '1px solid var(--hd-gold)' }}>Captain</span>
          <span style={{ flex: 1, fontSize: '13px', color: 'var(--hd-muted)' }}>{c.sessionName} &middot; {c.dateLabel}</span>
        </div>
        <div className="hd-row" style={{ alignItems: 'baseline', gap: '8px' }}>
          <span className="hd-serif" style={{ fontSize: '38px', lineHeight: 1, color: 'var(--hd-gold2)' }}>{c.players}</span>
          <span style={{ fontSize: '14px', color: 'var(--hd-muted)' }}>player{c.players === 1 ? '' : 's'} &middot; {c.chukkas} chukka{c.chukkas === 1 ? '' : 's'} asked for</span>
        </div>
        {c.cap != null && (
          <div style={{ height: 8, borderRadius: 999, background: 'var(--hd-card2)', overflow: 'hidden' }} role="img" aria-label={`${c.players} of ${c.cap} places taken`}>
            <div style={{ width: `${Math.min(100, (c.players / c.cap) * 100)}%`, height: 8, background: 'var(--hd-gold)' }} />
          </div>
        )}
        <div style={{ fontSize: '12px', color: 'var(--hd-muted)' }}>{c.closes}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button type="button" className="hd-btn" style={{ background: 'var(--hd-burg)', borderColor: 'var(--hd-gold)' }} onClick={() => go('draw')}>Open the list</button>
          <button type="button" className="hd-btn" onClick={() => go('payments')}>Payments</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '8px' }}>
        <button type="button" className="hd-stat hd-choice" onClick={() => go('payments')}><b>{c.owedText}</b><span>Invoices waiting</span></button>
        <button type="button" className="hd-stat hd-choice" onClick={() => go('draw')}><b>{c.waiting}</b><span>Waiting lists</span></button>
        <button type="button" className="hd-stat hd-choice" onClick={() => go('lessons')}><b>{c.lessons}</b><span>Lessons this week</span></button>
      </div>
    </section>
  );
}

// ── Home ────────────────────────────────────────────────────────────────────
export default function HomeDashboard(props) {
  const {
    ready, account, me, onSignIn, onSignOut, onSavePhoto, people, sessionsFor,
    profile, handicapOptions = [], onSaveProfile, onChangePassword, onResetEmail, onLinkProvider,
    sessions, fixtures, captain, quote, book, undo,
    openChukkas, openLessons, openFixtures, openFixture, openLive, goCaptain, directions,
  } = props;
  const [booking, setBooking] = useState(null); // the day the sheet opened on
  const [photoOpen, setPhotoOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!ready) {
    return (
      <div className="hd" aria-busy="true">
        <style>{CSS}</style>
        <div className="hd-skel" style={{ height: 150, marginBottom: 14 }} />
        <div className="hd-skel" style={{ height: 56, marginBottom: 14 }} />
        <div className="hd-skel" style={{ height: 170 }} />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="hd">
        <style>{CSS}</style>
        <div className="hd-dots" />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {captain && <CaptainPanel c={captain} go={goCaptain} />}
          <Logon onSignIn={onSignIn} openFixtures={openFixtures} openLive={openLive} />
        </div>
      </div>
    );
  }

  const nextOpen = sessions.find(s => s.status === 'open') || sessions.find(s => s.status === 'full') || null;
  const mine = sessions.filter(s => s.status === 'booked' || s.status === 'waitlisted');
  const next = mine[0] || null;
  const later = mine.slice(1);
  const now = new Date();
  const dateLine = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const shownName = (me && me.name) || account.name || '';

  return (
    <div className="hd">
      <style>{CSS}</style>
      <div className="hd-dots" />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {captain && <CaptainPanel c={captain} go={goCaptain} />}

        <header className="hd-row hd-in" style={{ gap: '12px' }}>
          <Crest size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="hd-eyebrow">{dateLine}</div>
            <h2 className="hd-serif" style={{ fontSize: '24px', fontWeight: 500, lineHeight: 1.2, margin: 0 }}>
              {shownName ? `${greeting(now)}, ${firstName(shownName)}` : greeting(now)}
            </h2>
          </div>
        </header>

        {me ? (
          <div className="hd-card hd-in" style={{ '--d': '.06s', padding: '18px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#2a1a17 0%,#1f1714 55%,#1a1311 100%)' }}>
            <div aria-hidden="true" style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,168,90,.18),transparent 70%)' }} />
            <div className="hd-row" style={{ alignItems: 'center', position: 'relative', gap: '14px' }}>
              <Avatar src={account.photo} name={me.name} size={58} onClick={() => setPhotoOpen(true)} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="hd-serif" style={{ fontSize: '21px' }}>{me.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--hd-muted)', marginTop: '2px' }}>{me.membershipText}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="hd-serif" style={{ fontSize: '42px', lineHeight: 1, color: 'var(--hd-gold2)' }}>{me.handicapText ?? '\u2014'}</div>
                <div className="hd-eyebrow" style={{ fontSize: '10px', marginTop: '4px' }}>Handicap</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '8px', marginTop: '16px', position: 'relative' }}>
              <div className="hd-stat"><b>{mine.filter(s => s.status === 'booked').length}</b><span>Booked this week</span></div>
              <div className="hd-stat"><b>{me.tokens}</b><span>Lesson token{me.tokens === 1 ? '' : 's'}</span></div>
              <div className="hd-stat"><b style={{ color: me.owed > 0 ? '#e8c47e' : undefined }}>{me.owedText}</b><span>{me.owed > 0 ? 'To settle' : 'Owed'}</span></div>
            </div>
          </div>
        ) : (
          <div className="hd-card hd-in" style={{ '--d': '.06s', padding: '16px 18px', fontSize: '14px', color: 'var(--hd-muted)', lineHeight: 1.55 }}>
            <div style={{ color: 'var(--hd-cream)', marginBottom: '4px' }}>You&rsquo;re signed in{account.email ? ` as ${account.email}` : ''}.</div>
            {account.ambiguous
              ? 'More than one player on the club\u2019s list matches your details, so we haven\u2019t guessed. The captain can link you to the right one from Players.'
              : 'We haven\u2019t matched you to the club\u2019s player list yet. If the club has a different email for you, the captain can link your account from Players. Until then you can book from the Chukkas tab.'}
          </div>
        )}

        <div className="hd-in" style={{ '--d': '.12s', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button type="button" className="hd-primary hd-shimmer" disabled={!nextOpen}
            onClick={() => (me ? setBooking(nextOpen.key) : openChukkas(nextOpen && nextOpen.key))}>
            <span>{nextOpen ? 'Book a chukka' : 'Nothing open to book'}</span>
            {nextOpen && <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '13px', opacity: .8 }}>&middot; {nextOpen.dow.charAt(0) + nextOpen.dow.slice(1).toLowerCase()} {nextOpen.dayNum}</span>}
          </button>
          <button type="button" className="hd-btn" onClick={openLessons}
            style={{ minHeight: '52px', borderRadius: '16px', border: '1px solid var(--hd-gold)', fontFamily: "'Fraunces',Georgia,serif", fontSize: '18px' }}>
            <Icon d={I.cap} size={20} stroke="var(--hd-gold2)" />Book a lesson
          </button>
        </div>

        {next && <NextChukka s={next} directions={directions} onOpen={() => openChukkas(next.key)} />}

        {me && !next && (
          <div className="hd-card hd-in" style={{ '--d': '.18s', padding: '16px 18px', fontSize: '14px', color: 'var(--hd-muted)', lineHeight: 1.5 }}>
            Nothing booked this week yet. {nextOpen ? `${nextOpen.name} on ${nextOpen.fullDay} is open \u2014 Book takes two taps.` : ''}
          </div>
        )}

        {later.length > 0 && (
          <div className="hd-in" style={{ '--d': '.22s', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {later.map(s => (
              <button key={s.key} type="button" className="hd-choice hd-row" onClick={() => openChukkas(s.key)} style={{ padding: '12px 14px', minHeight: '52px' }}>
                <span style={{ flex: 1 }}>{s.name} &middot; <span style={{ color: 'var(--hd-muted)' }}>{s.dateLabel}, {s.time}</span></span>
                <span className={`hd-pill ${s.status === 'booked' ? 'hd-pill-ok' : 'hd-pill-gold'}`}>{s.status === 'booked' ? 'Booked' : `Waiting #${s.waitPlace}`}</span>
              </button>
            ))}
          </div>
        )}

        <Fixtures items={fixtures} onOpen={openFixture} onLive={openLive} delay=".28s" />

        <div className="hd-row" style={{ justifyContent: 'center', gap: '16px', fontSize: '12px', color: 'var(--hd-dim)', paddingTop: '4px', flexWrap: 'wrap' }}>
          <button type="button" className="hd-link" onClick={() => setProfileOpen(true)} style={{ fontSize: '12px', minHeight: '40px' }}>Your profile</button>
          <span aria-hidden="true">&middot;</span>
          <button type="button" className="hd-link" onClick={() => setPhotoOpen(true)} style={{ fontSize: '12px', minHeight: '40px' }}>Your picture</button>
          <span aria-hidden="true">&middot;</span>
          <button type="button" className="hd-link" onClick={onSignOut} style={{ fontSize: '12px', minHeight: '40px' }}>Sign out</button>
        </div>
      </div>

      {profileOpen && (
        <ProfileSheet account={account} profile={profile} me={me} handicapOptions={handicapOptions}
          onSave={onSaveProfile} onChangePassword={onChangePassword} onResetEmail={onResetEmail}
          onLinkProvider={onLinkProvider} onSignOut={onSignOut} onPhoto={() => setPhotoOpen(true)}
          onClose={() => setProfileOpen(false)} />
      )}

      {photoOpen && (
        <PhotoSheet account={account} name={shownName} onSave={onSavePhoto} onClose={() => setPhotoOpen(false)} />
      )}

      {booking && me && (
        <BookSheet me={me} sessions={sessions} people={people} sessionsFor={sessionsFor} initialKey={booking} quote={quote} book={book} undo={undo}
          directions={directions} onClose={() => setBooking(null)} />
      )}
    </div>
  );
}
