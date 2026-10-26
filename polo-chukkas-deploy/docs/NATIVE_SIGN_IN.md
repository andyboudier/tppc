# Sign-in inside the iOS and Android apps

The store apps show the club's site (tppc.poloact.co.uk) in a web view.
Google refuses to sign anyone in from a web view, and Apple expects its own
sign-in sheet in an iPhone app. So the apps carry the native sign-in plugin
`@capacitor-firebase/authentication`. It shows the phone's own Google or
Apple sheet and passes the result to the site, which signs in to the same
Firebase account as on the web (`src/authFirebase.js`).

An app without the plugin is an older store version. The site detects that
and offers email and password only, so nobody meets a dead end.

The plugin needs the club's Firebase files for each app. The iOS and Android
builds now **stop with an error** if those files are missing, rather than
shipping an app that would crash at launch.

## Two kinds of build: test against dev, ship against live

The site the app loads is built into each copy of the app, so it is chosen
when the app is built, by `APP_SITE`:

| Build | `APP_SITE` | Loads | Firebase project | Where it goes |
|---|---|---|---|---|
| Test build | `dev` | tppc-dev.poloact.co.uk | `tppc-dev` | TestFlight internal testers, Play internal testing |
| Store build | unset (`live`) | tppc.poloact.co.uk | `tedworth-park-polo` | App Store and Google Play review and release |

- **iOS.** In App Store Connect → Xcode Cloud, add a second workflow
  ("TestFlight – dev site"), with the environment variable `APP_SITE` = `dev`
  and TestFlight internal testing as its only post-action. The existing
  workflow stays as the store build.
- **Android.** Run Build Android AAB with **site: dev** and track
  **internal**. The workflow refuses a dev build on any other track.

Never send a dev-site build for review. The dev site says DEV on every screen
and holds test data, and a reviewer would reject it as a test build. A store
build always loads tppc.poloact.co.uk, and what that address serves can change
without a new app.

Do the steps below for **both** Firebase projects, `tppc-dev` for test builds
and `tedworth-park-polo` for the store build. The files go in
`ios/App/firebase/<dev|live>/` and `android/firebase/<dev|live>/`. The build
copies the right one into the app, so never commit one straight into
`ios/App/App/` or `android/app/`.

**Android and the dev project.** Google lets an Android package and signing
key be registered in one project only, and the club's are in the live
project. So every Android build uses the live `google-services.json`; the
native side only fetches the member's Google credential, and the dev site's
own Firebase signs in with it. For that, the dev project accepts the live
project's web client: in the **tppc-dev** console, Authentication →
Sign-in method → Google → *Safelist client IDs from external projects*, add
the live web client ID (the `client_type: 3` entry in the live
`google-services.json`). Never add the fingerprints to the dev Android app —
Google refuses them. iOS has no such limit: each project has its own iOS
app and plist.

## 1. Firebase console (each project: tppc-dev and tedworth-park-polo)

1. Project settings → Your apps. If they are not listed, add:
   - an **iOS app** with bundle ID `uk.co.tedworthparkpolo.chukkas`;
   - an **Android app** with package name `uk.co.tedworthparkpolo.chukkas`.
2. **Android SHA-1 fingerprints.** Add both of these to the Android app:
   - the upload key's fingerprint, from the keystore in the `TPPC_KEYSTORE_*` secrets;
   - the **app signing key** fingerprint, from Play Console → Test and release → App integrity → App signing.

   Without the second one, Google sign-in works only for builds you sign
   yourself, not for the copy installed from Google Play.
3. Download **GoogleService-Info.plist** and save it as
   `polo-chukkas-deploy/ios/App/firebase/<dev|live>/GoogleService-Info.plist`.
4. Download **google-services.json** and save it as
   `polo-chukkas-deploy/android/firebase/<dev|live>/google-services.json`.
5. Commit both files. They identify the apps to Firebase and are not secrets.
6. Authentication → Sign-in method. Enable **Google**, **Apple** and
   **Email/Password**, and its **Email link** switch if the app should offer
   links on the web.
7. Under Apple, fill in the Services ID, Apple Team ID, Key ID and private
   key (step 2 below). Firebase needs these to revoke Apple's tokens when a
   member deletes their account, which Apple requires.

## 2. Apple Developer

1. Certificates, Identifiers & Profiles → Identifiers → the App ID
   `uk.co.tedworthparkpolo.chukkas` → tick **Sign in with Apple** and save.
   The app now declares it in `App/App.entitlements`. Xcode Cloud's automatic
   signing picks it up once the App ID has it.
2. Keys → create a key with **Sign in with Apple**, if there isn't one. Note
   the Key ID and download the `.p8` file for the Firebase Apple provider.
3. For sign-in on the website, the Services ID needs
   `https://tppc.poloact.co.uk/__/auth/handler` as a return URL, and
   tppc.poloact.co.uk among its domains. The live-host steps are in
   CLAUDE.md under "Bringing sign-in to TPPC live".

## 3. Builds

- **Swift packages (Xcode Cloud).** Xcode Cloud resolves packages with
  automatic resolution off, so `ci_post_clone.sh` writes `Package.resolved`
  afresh after `cap sync` (lifting Xcode's machine-wide no-resolve default
  for that one step). A Mac developer can commit the resulting file, but the
  build no longer depends on it being current.
- **iOS (Xcode Cloud).** `ci_scripts/ci_post_clone.sh` checks for the plist.
  It adds Google's return URL scheme (`REVERSED_CLIENT_ID`) to Info.plist
  from that file, then builds as before. The plugin needs Xcode 16.3 or
  later, so check the workflow's Xcode version in App Store Connect.
- **Android (GitHub Actions → Build Android AAB).** The workflow checks for
  `google-services.json` before building.
- **Scene lifecycle (iOS 27).** An app built with the iOS 27 SDK that has
  not adopted UIScene stops at launch. `App/SceneDelegate.swift` and the
  scene manifest in `Info.plist` do that; keep both.
- **Version.** Both apps are now **1.1.0**. That is `MARKETING_VERSION` in the
  Xcode project for the app, widget and Watch targets, and `versionName` in
  `android/app/build.gradle`. Change them together.

## 4. Check before submitting

On a TestFlight build and an internal-testing Play build, check:

- Google sign-in.
- Apple sign-in, on iOS only.
- Email and password sign-in.
- Your profile → Add Google / Add Apple.
- Your profile → Delete my account, with each kind of account.

Both reviews need a **demo account**: an email-and-password member the
reviewers can sign in with. Give it in App Store Connect (App Review
Information) and in Play Console (App access).
