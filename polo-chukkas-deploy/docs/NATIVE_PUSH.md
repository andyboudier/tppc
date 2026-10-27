# Notifications inside the iOS and Android apps

From **1.2.0** the store apps take the phone's own notifications. The same
**Turn on notifications** switch at the foot of Home works in the app: it asks
the phone's permission, and the phone's Firebase Cloud Messaging token goes
into the shared `push-subs` list beside the browsers' subscriptions
(`src/push.js`). The server (`api/_push.js`) sends to both kinds: admins hear
of every booking, change and cancellation, and a member hears when a
waiting-list place comes up. Tapping a notification opens the app.

An app older than 1.2.0 has no native notifications: the switch says
notifications are not supported there, as before. Browsers carry on as they
were.

## Owner steps (once per Firebase project)

Do these for **tppc-dev** (test builds) and **tedworth-park-polo** (store
builds).

1. **Apple Developer → Identifiers → `uk.co.tedworthparkpolo.chukkas`**: tick
   **Push Notifications** and save. The app now declares `aps-environment`
   in `App/App.entitlements`; Xcode Cloud's automatic signing picks it up.
2. **Apple Developer → Keys → +**: create a key with **Apple Push
   Notifications service (APNs)**, download the `.p8` (it can be downloaded
   only once) and note its Key ID. One key serves every app on the team.
3. **Firebase console → Project settings → Cloud Messaging → Apple app
   configuration → APNs Authentication Key → Upload**: the `.p8`, its Key ID
   and the Team ID. Do it in both projects.
4. **Firebase console → Project settings → Service accounts → Generate new
   private key**: a JSON file. In Vercel, add it as a **Sensitive** variable
   whose name starts `FIREBASE_SERVICE_ACCOUNT`:
   - `tppc-chukkas` (live): `FIREBASE_SERVICE_ACCOUNT` = the
     **tedworth-park-polo** key.
   - `tppc-dev`: `FIREBASE_SERVICE_ACCOUNT` = the **tppc-dev** key, and
     `FIREBASE_SERVICE_ACCOUNT_LIVE` = the **tedworth-park-polo** key — the
     Android test app carries the live project's `google-services.json`, so
     its phones' tokens belong to the live project.

   Then redeploy. Without a key for a token's project, that phone is simply
   skipped. These keys are secrets: paste them into Vercel yourself.

Android needs nothing more: FCM comes with the live project's
`google-services.json` already in the build, and the plugin asks for
Android 13's notification permission itself.

## Check

On the dev TestFlight build and the Android internal build: sign in as an
admin, Home → **Turn on notifications** → allow. Book and cancel a chukka from
another account: the admin's phone should show both, on the lock screen too.
