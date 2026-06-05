import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uk.co.tedworthparkpolo.chukkas',
  appName: 'TPPC Chukkas',
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
    // Local-bundle mode: the JS lives inside the .ipa.
    // To switch to remote-load (instant updates without resubmission), set:
    //   url: 'https://tppc-chukkas.vercel.app',
    //   cleartext: false,
    // Apple's review team is friendlier to local bundles — recommended.
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#f4ecd8', // cream
      showSpinner: false,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'DARK', // dark icons on the cream header
      backgroundColor: '#f4ecd8',
      overlaysWebView: false,
    },
    FirebaseMessaging: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
