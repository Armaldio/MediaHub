import { CapacitorConfig } from "@capacitor/cli";

const keyAlias = process.env.KEY_ALIAS;
const keyPassword = process.env.KEY_PASSWORD;
const storePassword = process.env.KEYSTORE_PASSWORD;

const buildOptions: NonNullable<CapacitorConfig["android"]>["buildOptions"] =
  {};

// if (process.env.CI) {
buildOptions.keystoreAlias = keyAlias;
buildOptions.keystoreAliasPassword = keyPassword;
buildOptions.keystorePath = "./media-hub-keystore.jks"; // generated at runtie by CI using KEYSTORE_FILE;
buildOptions.keystorePassword = storePassword;
// }

// Base configuration shared between environments
const baseConfig: CapacitorConfig = {
  appId: "xyz.armaldio.mediahub.app",
  appName: "Media Hub",
  webDir: "dist",
  plugins: {
    // Configure the App plugin for deep linking
    App: {
      // This is the custom URL scheme your app will respond to
      customUrlScheme: "mediahub",
      // This is the universal link domain (for iOS)
      iosScheme: "mediahub",
      // This is the app's website domain (for Android App Links)
      androidScheme: "https",
      // This is the host for universal links (for iOS)
      hostname: "mediahub.app",
      // This is the path prefix for universal links
      path: "/",
      launchUrl: "mediahub://",
    },
  },
  android: {
    buildOptions,
  },
};

// Development configuration
const devConfig: CapacitorConfig = {
  ...baseConfig,
  server: {
    androidScheme: "http",
    // Update this to your local development server IP
    url: "http://192.168.1.94:5173",
    cleartext: true,
  },
};

// Production configuration
const prodConfig: CapacitorConfig = {
  ...baseConfig,
  // Production-specific overrides can go here
};

// Use NODE_ENV to determine which config to use
const isProduction = process.env.NODE_ENV === "production";
console.log("Is production:", isProduction);
const config = isProduction ? prodConfig : devConfig;

export default config;
