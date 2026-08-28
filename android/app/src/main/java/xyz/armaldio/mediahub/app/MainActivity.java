package xyz.armaldio.mediahub.app;

import android.content.Intent;
import android.os.Bundle;
import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        handleShareIntent(getIntent());
        super.onCreate(savedInstanceState);
        // Draw the app full-bleed behind the transparent system bars (edge-to-edge)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleShareIntent(intent);
    }

    private void handleShareIntent(Intent intent) {
        if (intent == null) return;
        if (Intent.ACTION_SEND.equals(intent.getAction()) && "text/plain".equals(intent.getType())) {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            if (sharedText != null && !sharedText.trim().isEmpty()) {
                try {
                    String query = sharedText.trim();
                    // If shared text is a URL, the search will handle it as query
                    String encoded = java.net.URLEncoder.encode(query, "UTF-8");
                    Intent viewIntent = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse("mediahub://search?q=" + encoded));
                    viewIntent.setPackage(getPackageName());
                    setIntent(viewIntent);
                } catch (Exception e) {
                    // ignore
                }
            }
        }
    }
}
