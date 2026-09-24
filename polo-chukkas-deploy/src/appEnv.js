// Which copy of the app this is: the club's own, or TPPC-Dev.
//
// TPPC-Dev (tppc-dev.poloact.co.uk, repo andyboudier/tppc-dev) is a clone of
// this app for design work that is later carried back here and on to the other
// clubs. It must never be mistaken for the real thing, by a person or by the
// code: it runs on its own Firebase project, and it says DEV on every screen.
//
// The same file ships in both repos, so bringing the dev work home never means
// remembering to leave a file out. On the club's own hosts IS_DEV is false and
// nothing here does anything.
//
// Two signals, either enough: the build says so (VITE_APP_ENV=dev, set on the
// tppc-dev Vercel project), or the page is served from a tppc-dev host — which
// also covers that project's preview URLs, and a dev build someone forgot to
// label.
const host = typeof location !== 'undefined' ? location.hostname : '';

export const IS_DEV = import.meta.env.VITE_APP_ENV === 'dev' || /^tppc-dev[.-]/.test(host);

// A ribbon, a title prefix and a noindex, so a dev tab left open, a screenshot
// or a search result can never pass for the club's live app.
export function markDev() {
  if (!IS_DEV || typeof document === 'undefined') return;
  if (!/^DEV · /.test(document.title)) document.title = `DEV · ${document.title}`;
  const robots = document.createElement('meta');
  robots.name = 'robots';
  robots.content = 'noindex, nofollow';
  document.head.appendChild(robots);
  const ribbon = document.createElement('div');
  ribbon.textContent = 'DEV';
  ribbon.setAttribute('aria-hidden', 'true');
  ribbon.style.cssText = [
    'position:fixed', 'top:10px', 'left:-28px', 'z-index:2147483647', 'transform:rotate(-45deg)',
    'background:#d97706', 'color:#fff', 'font:700 11px/1 system-ui,sans-serif', 'letter-spacing:2px',
    'padding:5px 32px', 'pointer-events:none', 'box-shadow:0 1px 4px rgba(0,0,0,.25)',
  ].join(';');
  document.body.appendChild(ribbon);
}
