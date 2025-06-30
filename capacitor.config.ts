import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'xyz.armaldio.mediahub.app',
  appName: 'Media Hub',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    App: {
      launchUrl: 'moviehub://'
    }
  }
};

export default config;