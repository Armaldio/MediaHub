# Deep Linking in MediaHub

This document explains how deep linking works in the MediaHub app and how to test it.

## Supported Deep Link Formats

### Movies
- `mediahub://movie?tmdb=12345` - Open movie with TMDB ID 12345
- `mediahub://movie?imdb=tt1234567` - Open movie with IMDB ID tt1234567

### TV Shows
- `mediahub://show?tmdb=12345` - Open TV show with TMDB ID 12345
- `mediahub://show?imdb=tt1234567` - Open TV show with IMDB ID tt1234567
- `mediahub://show?tmdb=12345&season=1` - Open season 1 of TV show with TMDB ID 12345
- `mediahub://show?tmdb=12345&season=1&episode=5` - Open episode 5 of season 1 of TV show with TMDB ID 12345

## Testing Deep Links

### Android
1. Build and run the app on an Android device or emulator
2. Use the following ADB command to test deep links:
   ```bash
   adb shell am start -a android.intent.action.VIEW -d "mediahub://movie?tmdb=12345"
   ```
3. Replace the URL with any of the supported formats above

### Web
1. Run the app in development mode:
   ```bash
   npm run dev
   ```
2. Open a browser and navigate to:
   ```
   http://localhost:5173/mediahub/movie?tmdb=12345
   ```
   or any other supported format

### iOS
If you add iOS platform later, you can test deep links using:
```bash
xcrun simctl openurl booted "mediahub://movie?tmdb=12345"
```

## Implementation Details

- The app uses the `mediahub://` URL scheme for deep linking
- On Android, the URL scheme is registered in `android/app/src/main/AndroidManifest.xml`
- The deep link handler is implemented in `src/utils/deepLinkHandler.ts`
- The router configuration in `src/router/index.ts` handles the deep link routing

## Troubleshooting

1. If deep links don't work on Android:
   - Make sure the app is installed and running
   - Check the Android logcat for any errors
   - Try uninstalling and reinstalling the app

2. If deep links don't work on web:
   - Make sure you're using the correct URL format
   - Check the browser console for any errors
   - Ensure the app is running in development mode when testing