import React, { useEffect, useMemo, useState } from 'react';

// Admin area → Rate card. Every price the app charges, in one place an admin
// can change: lessons and coaching (with the own-pony price where a line has
// one), non-member chukka fees, pony hire per chukka with the military
// discount, and tournament entry. Saving writes the shared `rate-card`
// document (see mergeRateCard in PoloChukkas.jsx); new bookings use it at
// once.
//
// Props: rates (the card in force), defaults (the printed card), doc (the
// saved changes, for who changed it and when), ponyLabels, entryLabels,
// ownPony (false for a club that sells no own-pony lesson price),
// onSave(doc | null) — null goes back to the printed card.

const S = {
  card: { border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 14px', marginBottom: '10px', background: 'var(--cream-pale)' },
  h: { fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', margin: '22px 0 8px' },
  label: { display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' },
  hint: { fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 },
  num: { width: '100%', padding: '9px 10px', fontSize: '15px' },
  btn: { background: 'transparent', border: '1px solid var(--line)', color: 'var(--ink)', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' },
};

const str = (v) => (v == null ? '' : String(v));
const toDraft = (r) => ({
  lessons: r.lessons.map(l => ({ id: l.id, label: l.label, civ: str(l.civ), mil: str(l.mil), ownCiv: l.own ? str(l.own.civ) : '', ownMil: l.own ? str(l.own.mil) : '' })),
  chukkaFee: { civ: str(r.chukkaFee.civ), mil: str(r.chukkaFee.mil) },
  ponyHire: Object.fromEntries(Object.entries(r.ponyHire).map(([k, v]) => [k, str(v)])),
  milPonyDiscount: str(r.milPonyDiscount),
  entry: Object.fromEntries(Object.entries(r.entry).map(([c, opts]) => [c, opts.map(o => ({ id: o.id, label: o.label, fee: str(o.fee) }))])),
});
const ok = (v) => v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0;
const n = (v) => Math.round(Number(v) * 100) / 100;

function Money({ id, label, value, onChange, optional }) {
  const bad = value !== '' ? !ok(value) : !optional;
  return (
    <label htmlFor={id} style={{ display: 'block', minWidth: 0 }}>
      <span style={S.label}>{label}</span>
      <div style={{ position: 'relative' }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 14 }}>£</span>
        <input id={id} className="input-field" type="number" inputMode="decimal" min="0" step="0.01" value={value}
          placeholder={optional ? '—' : ''} onChange={e => onChange(e.target.value)} aria-invalid={bad}
          style={{ ...S.num, paddingLeft: 22, borderColor: bad ? 'var(--danger)' : undefined }} />
      </div>
    </label>
  );
}

export default function RateCardEditor({ rates, defaults, doc, ponyLabels = {}, entryLabels = {}, ownPony = true, onSave }) {
  const start = useMemo(() => toDraft(rates), [rates]);
  const [d, setD] = useState(start);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ kind: '', text: '' });
  useEffect(() => { setD(start); }, [start]);

  const changed = JSON.stringify(d) !== JSON.stringify(start);
  const problems = [];
  d.lessons.forEach(l => {
    if (!l.label.trim()) problems.push('Every lesson line needs a name.');
    if (!ok(l.civ) || !ok(l.mil)) problems.push(`${l.label || 'A lesson'}: civilian and military prices are needed.`);
    if ((l.ownCiv !== '' || l.ownMil !== '') && !(ok(l.ownCiv) && ok(l.ownMil))) problems.push(`${l.label}: give both own-pony prices, or leave both blank.`);
  });
  if (!ok(d.chukkaFee.civ) || !ok(d.chukkaFee.mil)) problems.push('Chukka fees need both prices.');
  Object.entries(d.ponyHire).forEach(([k, v]) => { if (!ok(v)) problems.push(`Pony hire (${ponyLabels[k] || k}) needs a price.`); });
  if (!ok(d.milPonyDiscount)) problems.push('The military pony discount needs a figure (0 for none).');
  Object.entries(d.entry).forEach(([c, opts]) => opts.forEach(o => { if (!o.label.trim() || !ok(o.fee)) problems.push(`${entryLabels[c] || c} entry: each line needs a name and a fee.`); }));
  const uniqueProblems = [...new Set(problems)];

  const setLesson = (i, k, v) => setD(x => ({ ...x, lessons: x.lessons.map((l, j) => (j === i ? { ...l, [k]: v } : l)) }));
  const setEntry = (c, i, k, v) => setD(x => ({ ...x, entry: { ...x.entry, [c]: x.entry[c].map((o, j) => (j === i ? { ...o, [k]: v } : o)) } }));

  const save = async () => {
    if (!changed || uniqueProblems.length) return;
    setBusy(true); setMsg({ kind: '', text: '' });
    const printedOwn = new Set(defaults.lessons.filter(l => l.own).map(l => l.id));
    const out = {
      lessons: d.lessons.map(l => {
        const row = { id: l.id, label: l.label.trim(), civ: n(l.civ), mil: n(l.mil) };
        if (l.ownCiv !== '' && l.ownMil !== '') row.own = { civ: n(l.ownCiv), mil: n(l.ownMil) };
        else if (printedOwn.has(l.id)) row.own = null; // the printed card has one; the admin took it away
        return row;
      }),
      chukkaFee: { civ: n(d.chukkaFee.civ), mil: n(d.chukkaFee.mil) },
      ponyHire: Object.fromEntries(Object.entries(d.ponyHire).map(([k, v]) => [k, n(v)])),
      milPonyDiscount: n(d.milPonyDiscount),
      entry: Object.fromEntries(Object.entries(d.entry).map(([c, opts]) => [c, opts.map(o => ({ id: o.id, label: o.label.trim(), fee: n(o.fee) }))])),
    };
    try { await onSave(out); setMsg({ kind: 'ok', text: 'Saved. New bookings use these prices from now on.' }); }
    catch (e) { setMsg({ kind: 'err', text: 'That didn’t save — check your connection and try again.' }); }
    setBusy(false);
  };
  const backToPrinted = async () => {
    if (!window.confirm('Go back to the printed rate card? Every change made here is removed. Invoices already raised are not changed.')) return;
    setBusy(true);
    try { await onSave(null); setMsg({ kind: 'ok', text: 'Back to the printed rate card.' }); }
    catch (e) { setMsg({ kind: 'err', text: 'That didn’t save — check your connection and try again.' }); }
    setBusy(false);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '90px' }}>
      <h2 className="display" style={{ margin: '0 0 4px', fontSize: '26px' }}>Rate card</h2>
      <div style={S.hint}>
        The prices members see when they book. Changes apply to new bookings at once.
        {doc && doc.updatedAt ? <> Last changed {new Date(doc.updatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}{doc.updatedBy ? ` by ${doc.updatedBy}` : ''}.</> : ' Showing the printed card.'}
      </div>

      <div style={S.h}>Lessons and coaching</div>
      <div style={{ ...S.hint, marginBottom: '8px' }}>{ownPony ? 'The first two prices include a club pony. The own-pony prices are used when the rider brings their own; leave them blank where there is no separate price.' : 'Civilian and military prices for each lesson.'}</div>
      {d.lessons.map((l, i) => (
        <div key={l.id} style={S.card}>
          <label style={S.label} htmlFor={`rc-${l.id}-label`}>Name</label>
          <input id={`rc-${l.id}-label`} className="input-field" type="text" value={l.label} onChange={e => setLesson(i, 'label', e.target.value)} style={{ width: '100%', padding: '9px 10px', fontSize: '14px', marginBottom: '10px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '8px' }}>
            <Money id={`rc-${l.id}-civ`} label="Civilian" value={l.civ} onChange={v => setLesson(i, 'civ', v)} />
            <Money id={`rc-${l.id}-mil`} label="Military" value={l.mil} onChange={v => setLesson(i, 'mil', v)} />
            {ownPony && <Money id={`rc-${l.id}-ownciv`} label="Own pony · civilian" value={l.ownCiv} optional onChange={v => setLesson(i, 'ownCiv', v)} />}
            {ownPony && <Money id={`rc-${l.id}-ownmil`} label="Own pony · military" value={l.ownMil} optional onChange={v => setLesson(i, 'ownMil', v)} />}
          </div>
        </div>
      ))}

      <div style={S.h}>Chukka fees · non-members</div>
      <div style={S.card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '8px' }}>
          <Money id="rc-cf-civ" label="Civilian, per chukka" value={d.chukkaFee.civ} onChange={v => setD(x => ({ ...x, chukkaFee: { ...x.chukkaFee, civ: v } }))} />
          <Money id="rc-cf-mil" label="Military / veteran, per chukka" value={d.chukkaFee.mil} onChange={v => setD(x => ({ ...x, chukkaFee: { ...x.chukkaFee, mil: v } }))} />
        </div>
        <div style={{ ...S.hint, marginTop: '8px' }}>Memberships that include chukka fees pay nothing here.</div>
      </div>

      <div style={S.h}>Pony hire · per chukka</div>
      <div style={S.card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '8px' }}>
          {Object.keys(d.ponyHire).map(k => (
            <Money key={k} id={`rc-ph-${k}`} label={ponyLabels[k] || k} value={d.ponyHire[k]} onChange={v => setD(x => ({ ...x, ponyHire: { ...x.ponyHire, [k]: v } }))} />
          ))}
          <Money id="rc-ph-mil" label="Military discount, per chukka" value={d.milPonyDiscount} onChange={v => setD(x => ({ ...x, milPonyDiscount: v }))} />
        </div>
      </div>

      <div style={S.h}>Tournament entry · per team</div>
      {Object.entries(d.entry).map(([c, opts]) => (
        <div key={c} style={S.card}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{entryLabels[c] || c}</div>
          {opts.map((o, i) => (
            <div key={o.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 120px', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
              <label style={{ display: 'block', minWidth: 0 }}>
                <span style={S.label}>Entry</span>
                <input className="input-field" type="text" value={o.label} onChange={e => setEntry(c, i, 'label', e.target.value)} style={{ width: '100%', padding: '9px 10px', fontSize: '14px' }} />
              </label>
              <Money id={`rc-en-${o.id}`} label="Fee" value={o.fee} onChange={v => setEntry(c, i, 'fee', v)} />
            </div>
          ))}
        </div>
      ))}

      {uniqueProblems.length > 0 && changed && (
        <div role="alert" style={{ ...S.card, borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: '13px' }}>
          {uniqueProblems.slice(0, 4).map(p => <div key={p}>{p}</div>)}
        </div>
      )}
      {msg.text && (
        <div role="status" style={{ fontSize: '13px', margin: '8px 0', color: msg.kind === 'err' ? 'var(--danger)' : 'var(--burgundy)' }}>{msg.text}</div>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
        <button type="button" className="btn-primary" disabled={!changed || uniqueProblems.length > 0 || busy} onClick={save}
          style={{ flex: '1 1 180px', opacity: !changed || uniqueProblems.length > 0 || busy ? 0.55 : 1 }}>
          {busy ? 'Saving…' : changed ? 'Save the rate card' : 'No changes yet'}
        </button>
        {changed && <button type="button" style={S.btn} disabled={busy} onClick={() => { setD(start); setMsg({ kind: '', text: '' }); }}>Undo changes</button>}
        {doc && <button type="button" style={S.btn} disabled={busy} onClick={backToPrinted}>Back to the printed card</button>}
      </div>
    </div>
  );
}
