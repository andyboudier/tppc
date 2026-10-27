import type { CapacitorConfig } from '@capacitor/cli';

// Which site the app shows. A store build loads the live site; a test build
// (TestFlight internal, Play internal testing) can load the dev site instead,
// so the native app can be tried against the new design before it is live.
// Set APP_SITE=dev in the build's environment for that: an Xcode Cloud
// workflow variable, or the Android workflow's "site" input. Anything else is
// the live site. The Firebase config the build uses follows the same switch
// (ci_scripts/ci_post_clone.sh and the Android workflow pick it).
const SITE_URL = process.env.APP_SITE === 'dev'
  ? 'https://tppc-dev.poloact.co.uk'
  : 'https://tppc.poloact.co.uk';

const config: CapacitorConfig = {
  appId: 'uk.co.tedworthparkpolo.chukkas',
  appName: 'TPPC PoloACT',
  webDir: 'dist', // Vite's default build output
  ios: {
    contentInset: 'always',
    backgroundColor: '#6b1f2a',
    // Allow Firestore + FCM long-lived connections through the WebView
    limitsNavigationsToAppBoundDomains: false,
    // Prevent gesture-based navigation overriding our React Router
    handleApplicationNotifications: true,
  },
  server: {
    // Remote-load mode: the app loads the live web app (the club's own
    // poloact.co.uk domain, served by Vercel), so web changes appear instantly
    // without re-archiving. Native/Watch changes still need an archive. To
    // revert to local-bundle (friendlier for App Store submission review),
    // comment out the url + cleartext lines below.
    // NOTE: changing this URL points the app at a different origin, so each
    // device re-downloads the shell once before caches warm up again.
    url: SITE_URL,
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      // src/main.jsx calls SplashScreen.hide() as soon as React paints, so on a
      // normal launch the splash clears well before this duration — it is not a
      // fixed wait. launchAutoHide stays true as the failsafe for the case where
      // that code never runs (bundle fails to load, offline cold start), so the
      // splash can never strand the app on a static image.
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#f4ecd8', // cream
      showSpinner: false,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK', // dark icons on the cream header
      backgroundColor: '#f4ecd8',
      overlaysWebView: false,
    },
    // Native push (@capacitor-firebase/messaging): admins hear of every
    // booking event, and a member booked in from a waiting list hears too,
    // through Firebase Cloud Messaging (APNs on iPhone). src/push.js keeps
    // each phone's token in push-subs; api/_push.js sends. Shown even with
    // the app open.
    FirebaseMessaging: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    // Native Google and Apple sign-in (@capacitor-firebase/authentication).
    // The app's web layer keeps the Firebase account: the plugin only fetches
    // the credential (skipNativeAuth) and src/authFirebase.js signs in with
    // it. Google refuses sign-in from inside a web view, so without this the
    // store apps can offer email and password only. Needs
    // ios/App/App/GoogleService-Info.plist and android/app/google-services.json
    // from the club's Firebase project — see docs/NATIVE_SIGN_IN.md.
    FirebaseAuthentication: {
      skipNativeAuth: true,
      providers: ['google.com', 'apple.com'],
    },
  },
  experimental: {
    ios: {
      spm: {
        swiftToolsVersion: '6.1',
        // Avoids a Swift package identity clash with the plugin's own
        // package name (capawesome-team/capacitor-firebase#959).
        packageOptions: {
          '@capacitor-firebase/authentication': { symlink: true },
          '@capacitor-firebase/messaging': { symlink: true },
        },
        // Google Sign-In only: leave the Facebook SDK out of the app.
        packageTraits: {
          '@capacitor-firebase/authentication': ['Google'],
        },
      },
    },
  },
};

export default config;
