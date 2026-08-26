package xyz.armaldio.mediahub.app;

import android.os.Bundle;
import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Draw the app full-bleed behind the transparent system bars (edge-to-edge)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }
}
