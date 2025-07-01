import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'xyz.armaldio.mediahub.app',
  appName: 'Media Hub',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // This allows the app to handle custom URL schemes in development
    // url: 'http://YOUR_DEV_SERVER_IP:5173',
    // cleartext: true
    url: 'http://192.168.1.94:5173',
    cleartext: true
  },
  plugins: {
    // Configure the App plugin for deep linking
    App: {
      // This is the custom URL scheme your app will respond to
      customUrlScheme: 'mediahub',
      // This is the universal link domain (for iOS)
      iosScheme: 'mediahub',
      // This is the app's website domain (for Android App Links)
      androidScheme: 'https',
      // This is the host for universal links (for iOS)
      hostname: 'mediahub.app',
      // This is the path prefix for universal links
      path: '/',
      // Enable the new Capacitor 3.0+ web implementation
      // This is required for proper deep linking on web
      server: {
        url: 'http://192.168.1.94:5173',
        cleartext: true
      },
      launchUrl: 'moviehub://'
    }
  }
};

export default config;