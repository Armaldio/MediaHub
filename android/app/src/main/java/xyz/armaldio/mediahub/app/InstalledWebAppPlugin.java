package xyz.armaldio.mediahub.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "InstalledWebApp")
public class InstalledWebAppPlugin extends Plugin {
    @PluginMethod
    public void canOpen(PluginCall call) {
        call.resolve(new JSObject().put("value", findWebAppIntent(call.getString("url")) != null));
    }

    @PluginMethod
    public void open(PluginCall call) {
        Intent intent = findWebAppIntent(call.getString("url"));
        if (intent != null) {
            try {
                getActivity().startActivity(intent);
                call.resolve(new JSObject().put("value", true));
                return;
            } catch (ActivityNotFoundException | SecurityException ignored) {
                // The app may have been removed or disabled since detection.
            }
        }
        call.resolve(new JSObject().put("value", false));
    }

    private Intent findWebAppIntent(String url) {
        if (url == null) return null;
        Uri uri = Uri.parse(url);
        if (!"https".equals(uri.getScheme()) || uri.getHost() == null) return null;

        Intent intent = new Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE);
        PackageManager packages = getContext().getPackageManager();
        for (ResolveInfo handler : packages.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)) {
            String packageName = handler.activityInfo.packageName;
            // Chromium generates this package per installed site. Its handler must match the full URL.
            if (packageName.startsWith("org.chromium.webapk.")) {
                return intent.setPackage(packageName);
            }
        }
        return null;
    }
}
