// Temporary check for the store apps (October 2026): six quick taps anywhere
// inside the iOS or Android app show which native plugins the app reports, so
// a missing one (native Google and Apple sign-in) can be seen on a phone with
// no Mac to inspect it. Nothing shows on the web or without the taps.
// Remove once the store apps' sign-in is confirmed.
import { Capacitor } from '@capacitor/core';

export function installNativeDiag() {
  if (!Capacitor.isNativePlatform()) return;
  let taps = [];
  // iPhones do not always send a click for a tap on plain background, so
  // count touches (and clicks, for Android) — one per tap either way.
  let lastTouch = 0;
  const onTap = (e) => {
    if (e.type === 'touchend') lastTouch = Date.now();
    else if (Date.now() - lastTouch < 800) return;
    const now = Date.now();
    taps = taps.filter((t) => now - t < 3000).concat(now);
    if (taps.length < 6 || document.getElementById('native-diag')) return;
    taps = [];
    const cap = window.Capacitor || {};
    const headers = (cap.PluginHeaders || []).map((h) => h.name);
    const lines = [
      `Platform: ${Capacitor.getPlatform()}`,
      `Native sign-in plugin: ${Capacitor.isPluginAvailable('FirebaseAuthentication') ? 'yes' : 'NO'}`,
      `Plugins (${headers.length}): ${headers.join(', ') || 'none'}`,
      `Sign-in offered: ${((window.auth && window.auth.methods) || []).join(', ') || '(not loaded)'}`,
      `Page: ${location.host}`,
    ];
    const box = document.createElement('div');
    box.id = 'native-diag';
    box.style.cssText = 'position:fixed;left:12px;right:12px;top:80px;z-index:99999;background:#fff;color:#111;border:2px solid #6b1f2a;border-radius:12px;padding:14px;font:13px/1.5 system-ui;box-shadow:0 6px 24px rgba(0,0,0,.35);white-space:pre-wrap;word-break:break-word';
    box.textContent = `App check\n\n${lines.join('\n')}\n\n(Tap this box to close. A screenshot of it helps.)`;
    box.addEventListener('click', (e) => { e.stopPropagation(); box.remove(); });
    document.body.appendChild(box);
  };
  document.addEventListener('touchend', onTap, { capture: true, passive: true });
  document.addEventListener('click', onTap, true);
}
