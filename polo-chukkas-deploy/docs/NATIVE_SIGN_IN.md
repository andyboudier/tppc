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
shipping an app that would crash at launch. Do these steps once, for the live
project `tedworth-park-polo`, before the first store build after the
migration.

## 1. Firebase console (project tedworth-park-polo)

1. Project settings → Your apps. If they are not listed, add:
   - an **iOS app** with bundle ID `uk.co.tedworthparkpolo.chukkas`;
   - an **Android app** with package name `uk.co.tedworthparkpolo.chukkas`.
2. **Android SHA-1 fingerprints.** Add both of these to the Android app:
   - the upload key's fingerprint, from the keystore in the `TPPC_KEYSTORE_*` secrets;
   - the **app signing key** fingerprint, from Play Console → Test and release → App integrity → App signing.

   Without the second one, Google sign-in works only for builds you sign
   yourself, not for the copy installed from Google Play.
3. Download **GoogleService-Info.plist** and save it as
   `polo-chukkas-deploy/ios/App/App/GoogleService-Info.plist`.
4. Download **google-services.json** and save it as
   `polo-chukkas-deploy/android/app/google-services.json`.
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

- **iOS (Xcode Cloud).** `ci_scripts/ci_post_clone.sh` checks for the plist.
  It adds Google's return URL scheme (`REVERSED_CLIENT_ID`) to Info.plist
  from that file, then builds as before. The plugin needs Xcode 16.3 or
  later, so check the workflow's Xcode version in App Store Connect.
- **Android (GitHub Actions → Build Android AAB).** The workflow checks for
  `google-services.json` before building.
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
