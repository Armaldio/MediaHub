# Deep Link Registry — Real APK Analysis
Generated: 2026-09-05T12:54:35.910Z via `apk-deep-links.ts extract --full`
Source: 26 APKs in `downloads` (apkeep apk-pure) + 48 services in `src/data/services`

## Summary
| Service | Package | Ver | Size | Deep | AppLinks | Custom | Hosts | Valid |
|---|---|---|---|---|---|---|---|---|
| allocine | `com.allocine.androidapp` |  | 100.4 MB | 4 | 2 | com.allocine.androidapp,allocine,puballocine,http,https | www.allocine.fr | ✓ |
| prime_video | `com.amazon.avod.thirdpartyclient` |  | 186.5 MB | 35 | 2 | intent,https,aiv,content,http,com.amazon.avod.thirdparty | app.primevideo.com,watch.amazon.co.jp,www.primevideo.com | ✓ |
| apple_tv_plus | `com.apple.atve.sony.appletv` |  | 34.3 MB | 1 | 1 | https | tv.apple.com | ✓ |
| betaseries | `com.betaseriesnative` |  | 76.8 MB | 3 | 1 | betaseries,http,https,fbconnect | feed,agenda,episodes | ✓ |
| paramount_plus | `com.cbs.app` |  | 43.0 MB | 6 | 3 | http,https,pplus,tl-a48da0aa,viacom | www.paramountplus.com,open,paramount-us.smart.link | ✓ |
| disney_plus | `com.disney.disneyplus` |  | 41.1 MB | 5 | 4 | disneyplus,https | disneyplus.com,www.disneyplus.com,click.mail.disneyplus.com | ✓ |
| googleplay | `com.google.android.videos` |  | 24.1 MB | 2 | 2 | http,https | play.google.com,tv.google.com | ✓ |
| youtube | `com.google.android.youtube` |  | 121.7 MB | 7 | 4 | vnd.youtube.gdi,com.google.android.apps.youtube,https,http,vnd.youtube,vnd.youtube.launch | oauth2redirect,oauth-redirect.googleusercontent.com,youtube.com | ✓ |
| hulu | `com.hulu.plus` |  | 19.4 MB | 3 | 2 | http,https,hulu | www.hulu.com,hulu.onelink.me | ✓ |
| imdb | `com.imdb.mobile` |  | 50.2 MB | 17 | 13 | https,imdb,http,amzn | slyb.app.link,slyb-alternate.app.link,slyb.test-app.link | ✓ |
| justwatch | `com.justwatch.justwatch` |  | 67.6 MB | 11 | 4 | justwatch,https,http,fb794243977319785,fbconnect,genericidp,recaptcha,tagmanager.c.com.justwatch.justwatch | www.justwatch.com,justwatch.com,justwatch.onelink.me | ✓ |
| nzb360 | `com.kevinforeman.nzb360` |  | 18.1 MB | 28 | 0 | nzb360,http,https,file,content,magnet | overseerr,unraid,radarr | ✓ |
| letterboxd | `com.letterboxd.letterboxd` |  | 160.3 MB | 32 | 32 | https | letterboxd.com,st.letterboxd.com,boxd.it | ✓ |
| moviebase | `com.moviebase` |  | 38.4 MB | 27 | 2 | moviebase,https,http,genericidp,recaptcha | auth,auth.trakt,moviebase-54830.firebaseapp.com | ✓ |
| mubi | `com.mubi` |  | 15.0 MB | 3 | 1 | https,mubi | *.mubi.com,mubi.com,upgrade-yearly | ✓ |
| netflix | `com.netflix.mediaclient` |  | 44.9 MB | 6 | 4 | nflx,http,https | www.netflix.com,app.netflix.com,qr.netflix.com | ✓ |
| peacock | `com.peacocktv.peacockandroid` |  | 8.0 MB | 1 | 1 | https | www.peacocktv.com | ✓ |
| simkl | `com.simkl.lists` |  | 6.4 MB | 1 | 0 | simkllists | - | ✓ |
| tv_time | `com.tozelabs.tvshowtime` |  | 69.7 MB | 0 | 0 | - | - | ✓ |
| max | `com.wbd.stream` |  | 66.1 MB | 1 | 1 | https | play.hbomax.com,play.max.com | ✓ |
| ava_assistant | `de.ava` |  | 15.6 MB | 2 | 1 | http,https,ava | ava-assistant.app,trakt | ✓ |
| jellyfin | `org.jellyfin.mobile` |  | 7.8 MB | 0 | 0 | - | - | ✓ |
| wikidata | `org.wikipedia` |  | 44.3 MB | 2 | 1 | http,https,wikipedia | *.wikipedia.org | ✓ |
| kodi | `org.xbmc.kodi` |  | 64.7 MB | 1 | 0 | file,content,http,https,ftp,ftps,rtp,rtsp,mms,dav,davs,ssh,sftp,smb | - | ✓ |
| kinopoisk | `ru.kinopoisk` |  | 147.9 MB | 59 | 13 | kp,https,ru.kinopoisk.passport,plus,http | movielist,movie,film | ✓ |
| trakt | `tv.trakt.trakt` |  | 13.2 MB | 1 | 0 | trakt | auth | ✓ |

## Per-APK Details (full --full)
### com.allocine.androidapp — downloads/com.allocine.androidapp.xapk
- Ver:  (), SDK 35, size 100.4 MB
- Deep links: 4/24 (AppLinks 2)
- Custom: com.allocine.androidapp, allocine, puballocine, http, https | Hosts: www.allocine.fr
- Perms: 26 | Queries pkgs: 30 [com.instagram.android, com.facebook.katana, com.allocine.androidapp, de.filmstarts.android, com.sensacine.android]
- URIs:
  - `com.allocine.androidapp://*  — activity net.openid.appauth.RedirectUriReceiverActivity`
  - `allocine://*  — activity com.allocine.archibien.base.deeplink.HandlePageLinkActivity`
  - `puballocine://*  — activity com.allocine.archibien.base.deeplink.HandlePageLinkActivity`
  - `http://www.allocine.fr/  — activity com.allocine.archibien.base.deeplink.HandleIncomingLinks [autoVerify]`
  - `http://www.allocine.fr/film/.*  — activity com.allocine.archibien.base.deeplink.HandleIncomingLinks [autoVerify]`
  - `http://www.allocine.fr/video/.*  — activity com.allocine.archibien.base.deeplink.HandleIncomingLinks [autoVerify]`
  - `http://www.allocine.fr/salle/.*  — activity com.allocine.archibien.base.deeplink.HandleIncomingLinks [autoVerify]`
  - `http://www.allocine.fr/series/.*  — activity com.allocine.archibien.base.deeplink.HandleIncomingLinks [autoVerify]`
  - `http://www.allocine.fr/video/.*  — activity com.allocine.archibien.base.deeplink.HandleIncomingLinks [autoVerify]`
  - `http://www.allocine.fr/seance/.*  — activity com.allocine.archibien.base.deeplink.HandleIncomingLinks [autoVerify]`

### com.amazon.avod.thirdpartyclient — downloads/com.amazon.avod.thirdpartyclient.apk
- Ver:  (), SDK 36, size 186.5 MB
- Deep links: 35/93 (AppLinks 2)
- Custom: intent, https, aiv, content, http, com.amazon.avod.thirdparty | Hosts: app.primevideo.com, watch.amazon.co.jp, www.primevideo.com, watch.amazon.com, watch.amazon.co.uk, watch.amazon.de, com.amazon.avod.detail, com.amazon.avod.primesignup, com.amazon.avod.signup, www.amazon.com
- Perms: 50 | Queries pkgs: 47 [com.amazon.appmanager, com.instagram.android, com.google.android.apps.nbu.paisa.user, com.phonepe.app, net.one97.paytm]
- URIs:
  - `intent://*  — activity com.amazon.avod.client.activity.HomeScreenActivity`
  - `app.primevideo.com  — activity com.amazon.avod.client.activity.HomeScreenActivity`
  - `watch.amazon.co.jp  — activity com.amazon.avod.client.activity.HomeScreenActivity`
  - `/home*  — activity com.amazon.avod.client.activity.HomeScreenActivity`
  - `https://*  — activity com.amazon.avod.client.activity.HomeScreenActivity [autoVerify]`
  - `/home*  — activity com.amazon.avod.client.activity.HomeScreenActivity [autoVerify]`
  - `/storefront*  — activity com.amazon.avod.client.activity.HomeScreenActivity [autoVerify]`
  - `/movie*  — activity com.amazon.avod.client.activity.HomeScreenActivity [autoVerify]`
  - `/tv*  — activity com.amazon.avod.client.activity.HomeScreenActivity [autoVerify]`
  - `/news*  — activity com.amazon.avod.client.activity.HomeScreenActivity [autoVerify]`

### com.apple.atve.sony.appletv — downloads/com.apple.atve.sony.appletv.apk
- Ver:  (), SDK 31, size 34.3 MB
- Deep links: 1/11 (AppLinks 1)
- Custom: https | Hosts: tv.apple.com
- Perms: 8 | Queries pkgs: 0 []
- URIs:
  - `https://tv.apple.com  — activity com.apple.atve.sony.appletv.MainActivity [autoVerify]`

### com.betaseriesnative — downloads/com.betaseriesnative.apk
- Ver:  (), SDK 36, size 76.8 MB
- Deep links: 3/33 (AppLinks 1)
- Custom: betaseries, http, https, fbconnect | Hosts: feed, agenda, episodes, notifications, profile, settings, article, serie, show, film
- Perms: 26 | Queries pkgs: 1 [com.facebook.katana]
- URIs:
  - `betaseries://feed  — activity com.betaseriesnative.MainActivity [autoVerify]`
  - `betaseries://agenda  — activity com.betaseriesnative.MainActivity [autoVerify]`
  - `betaseries://episodes  — activity com.betaseriesnative.MainActivity [autoVerify]`
  - `betaseries://notifications  — activity com.betaseriesnative.MainActivity [autoVerify]`
  - `betaseries://profile  — activity com.betaseriesnative.MainActivity [autoVerify]`
  - `betaseries://settings  — activity com.betaseriesnative.MainActivity [autoVerify]`
  - `betaseries://article  — activity com.betaseriesnative.MainActivity [autoVerify]`
  - `betaseries://serie  — activity com.betaseriesnative.MainActivity [autoVerify]`
  - `betaseries://show  — activity com.betaseriesnative.MainActivity [autoVerify]`
  - `betaseries://film  — activity com.betaseriesnative.MainActivity [autoVerify]`

### com.cbs.app — downloads/com.cbs.app.xapk
- Ver:  (), SDK 37, size 43.0 MB
- Deep links: 6/22 (AppLinks 3)
- Custom: http, https, pplus, tl-a48da0aa, viacom | Hosts: www.paramountplus.com, open, paramount-us.smart.link, com.cbs.app
- Perms: 20 | Queries pkgs: 10 [com.sec.android.app.samsungapps, com.verizon.firetv.customization, com.verizon.tv.customization, com.tivo.hydra.app, com.tivo.atom]
- URIs:
  - `http://*  — activity com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity [autoVerify]`
  - `https://*  — activity com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity [autoVerify]`
  - `www.paramountplus.com  — activity com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity [autoVerify]`
  - `(empty)  — activity com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity [autoVerify]`
  - `/  — activity com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity [autoVerify]`
  - `/account/delete*  — activity com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity [autoVerify]`
  - `/account/switch*  — activity com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity [autoVerify]`
  - `/account/changePlan*  — activity com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity [autoVerify]`
  - `/account/signup*  — activity com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity [autoVerify]`
  - `/brands*  — activity com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity [autoVerify]`

### com.disney.disneyplus — downloads/com.disney.disneyplus.xapk
- Ver:  (), SDK 36, size 41.1 MB
- Deep links: 5/22 (AppLinks 4)
- Custom: disneyplus, https | Hosts: disneyplus.com, www.disneyplus.com, click.mail.disneyplus.com, links.messaging.disneyplus.com, us-east-1.mail2.disneyplus.com, us-east-2.mail2.disneyplus.com, us-west-2.mail2.disneyplus.com, eu-central-1.mail2.disneyplus.com, eu-west-1.mail2.disneyplus.com
- Perms: 13 | Queries pkgs: 2 [com.disney.disneyplus.jarvis, com.google.android.gms.policy_cast_dynamite]
- URIs:
  - `disneyplus://*  — activity com.bamtechmedia.dominguez.main.MainActivity`
  - `disneyplus.com  — activity com.bamtechmedia.dominguez.main.MainActivity`
  - `www.disneyplus.com  — activity com.bamtechmedia.dominguez.main.MainActivity`
  - `https://*  — activity com.bamtechmedia.dominguez.main.MainActivity [autoVerify]`
  - `www.disneyplus.com  — activity com.bamtechmedia.dominguez.main.MainActivity [autoVerify]`
  - `https://*  — activity com.bamtechmedia.dominguez.main.MainActivity [autoVerify]`
  - `click.mail.disneyplus.com  — activity com.bamtechmedia.dominguez.main.MainActivity [autoVerify]`
  - `/  — activity com.bamtechmedia.dominguez.main.MainActivity [autoVerify]`
  - `https://*  — activity com.bamtechmedia.dominguez.main.MainActivity [autoVerify]`
  - `links.messaging.disneyplus.com  — activity com.bamtechmedia.dominguez.main.MainActivity [autoVerify]`

### com.google.android.videos — downloads/com.google.android.videos.xapk
- Ver:  (), SDK 37, size 24.1 MB
- Deep links: 2/47 (AppLinks 2)
- Custom: http, https | Hosts: play.google.com, tv.google.com
- Perms: 32 | Queries pkgs: 1 [com.google.android.apps.chrome]
- URIs:
  - `http://*  — activity-alias com.google.android.videos.activity.LauncherActivity [autoVerify]`
  - `https://*  — activity-alias com.google.android.videos.activity.LauncherActivity [autoVerify]`
  - `play.google.com  — activity-alias com.google.android.videos.activity.LauncherActivity [autoVerify]`
  - `/movies*  — activity-alias com.google.android.videos.activity.LauncherActivity [autoVerify]`
  - `/movies/shop*  — activity-alias com.google.android.videos.activity.LauncherActivity [autoVerify]`
  - `http://*  — activity-alias com.google.android.videos.activity.GoogleTvLauncherActivity [autoVerify]`
  - `https://*  — activity-alias com.google.android.videos.activity.GoogleTvLauncherActivity [autoVerify]`
  - `tv.google.com  — activity-alias com.google.android.videos.activity.GoogleTvLauncherActivity [autoVerify]`

### com.google.android.youtube — downloads/com.google.android.youtube.xapk
- Ver:  (), SDK 37, size 121.7 MB
- Deep links: 7/51 (AppLinks 4)
- Custom: vnd.youtube.gdi, com.google.android.apps.youtube, https, http, vnd.youtube, vnd.youtube.launch | Hosts: oauth2redirect, oauth-redirect.googleusercontent.com, youtube.com, www.youtube.com, m.youtube.com, youtu.be, myaccount.google.com, studio.youtube.com
- Perms: 50 | Queries pkgs: 13 [com.google.android.apps.youtube.music, com.google.android.apps.youtube.gaming, com.google.android.apps.youtube.kids, com.google.android.apps.youtube.unplugged, com.google.android.apps.youtube.creator]
- URIs:
  - `vnd.youtube.gdi://*  — activity com.google.android.libraries.accountlinking.activity.AccountLinkingActivity`
  - `com.google.android.apps.youtube://oauth2redirect  — activity com.google.android.libraries.accountlinking.activity.AccountLinkingActivity`
  - `https://oauth-redirect.googleusercontent.com/youtube  — activity com.google.android.libraries.accountlinking.activity.AccountLinkingActivity [autoVerify]`
  - `http://*  — activity-alias com.google.android.youtube.UrlActivity [autoVerify]`
  - `https://*  — activity-alias com.google.android.youtube.UrlActivity [autoVerify]`
  - `youtube.com  — activity-alias com.google.android.youtube.UrlActivity [autoVerify]`
  - `www.youtube.com  — activity-alias com.google.android.youtube.UrlActivity [autoVerify]`
  - `m.youtube.com  — activity-alias com.google.android.youtube.UrlActivity [autoVerify]`
  - `youtu.be  — activity-alias com.google.android.youtube.UrlActivity [autoVerify]`
  - `.*  — activity-alias com.google.android.youtube.UrlActivity [autoVerify]`

### com.hulu.plus — downloads/com.hulu.plus.apk
- Ver:  (), SDK 36, size 19.4 MB
- Deep links: 3/27 (AppLinks 2)
- Custom: http, https, hulu | Hosts: www.hulu.com, hulu.onelink.me
- Perms: 18 | Queries pkgs: 5 [com.google.android.gms.policy_cast_dynamite, com.facebook.katana, com.instagram.android, com.facebook.lite, com.samsung.android.mapsagent]
- URIs:
  - `http://*  — activity com.hulu.features.splash.SplashActivity [autoVerify]`
  - `https://*  — activity com.hulu.features.splash.SplashActivity [autoVerify]`
  - `www.hulu.com  — activity com.hulu.features.splash.SplashActivity [autoVerify]`
  - `/open*  — activity com.hulu.features.splash.SplashActivity [autoVerify]`
  - `/shows/*  — activity com.hulu.features.splash.SplashActivity [autoVerify]`
  - `/videos/*  — activity com.hulu.features.splash.SplashActivity [autoVerify]`
  - `/entity/*  — activity com.hulu.features.splash.SplashActivity [autoVerify]`
  - `/watch/*  — activity com.hulu.features.splash.SplashActivity [autoVerify]`
  - `/movie/*  — activity com.hulu.features.splash.SplashActivity [autoVerify]`
  - `/series/*  — activity com.hulu.features.splash.SplashActivity [autoVerify]`

### com.imdb.mobile — downloads/com.imdb.mobile.apk
- Ver:  (), SDK 34, size 50.2 MB
- Deep links: 17/40 (AppLinks 13)
- Custom: https, imdb, http, amzn | Hosts: slyb.app.link, slyb-alternate.app.link, slyb.test-app.link, slyb-alternate.test-app.link, www.imdb.com, m.imdb.com, com.imdb.mobile
- Perms: 32 | Queries pkgs: 11 [com.facebook.katana, com.instagram.android, com.zhiliaoapp.musically, com.twitter.android, com.google.android.youtube]
- URIs:
  - `https://slyb.app.link  — activity com.imdb.mobile.intents.IntentsActivity [autoVerify]`
  - `https://slyb-alternate.app.link  — activity com.imdb.mobile.intents.IntentsActivity [autoVerify]`
  - `https://slyb.test-app.link  — activity com.imdb.mobile.intents.IntentsActivity [autoVerify]`
  - `https://slyb-alternate.test-app.link  — activity com.imdb.mobile.intents.IntentsActivity [autoVerify]`
  - `imdb://*  — activity com.imdb.mobile.intents.IntentsActivity [autoVerify]`
  - `(empty)  — activity com.imdb.mobile.intents.IntentsActivity [autoVerify]`
  - `www.imdb.com  — activity com.imdb.mobile.intents.IntentsActivity [autoVerify]`
  - `/video  — activity com.imdb.mobile.intents.IntentsActivity [autoVerify]`
  - `/video/  — activity com.imdb.mobile.intents.IntentsActivity [autoVerify]`
  - `/interest/all  — activity com.imdb.mobile.intents.IntentsActivity [autoVerify]`

### com.justwatch.justwatch — downloads/com.justwatch.justwatch.xapk
- Ver:  (), SDK 36, size 67.6 MB
- Deep links: 11/31 (AppLinks 4)
- Custom: justwatch, https, http, fb794243977319785, fbconnect, genericidp, recaptcha, tagmanager.c.com.justwatch.justwatch | Hosts: www.justwatch.com, justwatch.com, justwatch.onelink.me, justwatch.go.link, cct.com.justwatch.justwatch, firebase.auth
- Perms: 30 | Queries pkgs: 7 [com.android.vending, com.huawei.appmarket, com.facebook.katana, com.instagram.android, com.facebook.lite]
- URIs:
  - `justwatch://*  — activity com.justwatch.justwatch.MainActivity`
  - `justwatch://*  — activity com.justwatch.justwatch.MainActivity`
  - `https://www.justwatch.com  — activity com.justwatch.justwatch.MainActivity [autoVerify]`
  - `https://justwatch.com  — activity com.justwatch.justwatch.MainActivity [autoVerify]`
  - `https://justwatch.onelink.me  — activity com.justwatch.justwatch.MainActivity [autoVerify]`
  - `http://justwatch.go.link  — activity com.justwatch.justwatch.MainActivity [autoVerify]`
  - `https://justwatch.go.link  — activity com.justwatch.justwatch.MainActivity [autoVerify]`
  - `fb794243977319785://*  — activity com.facebook.CustomTabActivity`
  - `fbconnect://cct.com.justwatch.justwatch  — activity com.facebook.CustomTabActivity`
  - `genericidp://firebase.auth/  — activity com.google.firebase.auth.internal.GenericIdpActivity`

### com.kevinforeman.nzb360 — downloads/com.kevinforeman.nzb360.apk
- Ver:  (), SDK 37, size 18.1 MB
- Deep links: 28/38 (AppLinks 0)
- Custom: nzb360, http, https, file, content, magnet | Hosts: overseerr, unraid, radarr, sonarr, tracearr, tautulli, sabnzbd, torrents, nzbget, dashboard
- Perms: 21 | Queries pkgs: 1 [com.imdb.mobile]
- URIs:
  - `nzb360://overseerr  — activity com.kevinforeman.nzb360.overseerr.mainview.OverseerrView`
  - `nzb360://unraid  — activity com.kevinforeman.nzb360.unraid.UnraidView`
  - `nzb360://radarr  — activity com.kevinforeman.nzb360.radarr2.Radarr2View`
  - `nzb360://sonarr  — activity com.kevinforeman.nzb360.sonarr2.Sonarr2View`
  - `nzb360://tracearr  — activity com.kevinforeman.nzb360.tracearr.TracearrView`
  - `nzb360://tautulli  — activity com.kevinforeman.nzb360.tautulli.TautulliView`
  - `nzb360://sabnzbd  — activity com.kevinforeman.nzb360.sabnzbd.SABnzbdFragmentView`
  - `nzb360://torrents  — activity com.kevinforeman.nzb360.torrents.TorrentFragmentView`
  - `nzb360://nzbget  — activity com.kevinforeman.nzb360.nzbget.NZBgetFragmentView`
  - `nzb360://dashboard  — activity com.kevinforeman.nzb360.dashboard2.Screens.Dashboard2View.Dashboard2View`

### com.letterboxd.letterboxd — downloads/com.letterboxd.letterboxd.xapk
- Ver:  (), SDK 36, size 160.3 MB
- Deep links: 32/81 (AppLinks 32)
- Custom: https | Hosts: letterboxd.com, st.letterboxd.com, boxd.it, cast.letterboxd.com
- Perms: 21 | Queries pkgs: 7 [com.instagram.android, com.google.android.gms.policy_cast_dynamite, com.pubmatic.openwrapapp, com.google.android.apps.tv.launcherx, com.google.android.tvlauncher]
- URIs:
  - `https://*  — activity com.letterboxd.letterboxd.MainActivity [autoVerify]`
  - `letterboxd.com  — activity com.letterboxd.letterboxd.MainActivity [autoVerify]`
  - `st.letterboxd.com  — activity com.letterboxd.letterboxd.MainActivity [autoVerify]`
  - `boxd.it  — activity com.letterboxd.letterboxd.MainActivity [autoVerify]`
  - `https://cast.letterboxd.com/join  — activity com.letterboxd.letterboxd.ui.activities.videoplayer.BasicPlayerActivity [autoVerify]`
  - `https://*  — activity-alias com.letterboxd.letterboxd.MainActivity_icon_pride_transgender [autoVerify]`
  - `letterboxd.com  — activity-alias com.letterboxd.letterboxd.MainActivity_icon_pride_transgender [autoVerify]`
  - `st.letterboxd.com  — activity-alias com.letterboxd.letterboxd.MainActivity_icon_pride_transgender [autoVerify]`
  - `boxd.it  — activity-alias com.letterboxd.letterboxd.MainActivity_icon_pride_transgender [autoVerify]`
  - `https://*  — activity-alias com.letterboxd.letterboxd.MainActivity_icon_pride_bisexual [autoVerify]`

### com.moviebase — downloads/com.moviebase.xapk
- Ver:  (), SDK 36, size 38.4 MB
- Deep links: 27/41 (AppLinks 2)
- Custom: moviebase, https, http, genericidp, recaptcha | Hosts: auth, auth.trakt, moviebase-54830.firebaseapp.com, www.moviebase.app, moviebase.app, www.themoviedb.org, trakt.tv, www.imdb.com, firebase.auth
- Perms: 22 | Queries pkgs: 1 [com.facebook.katana]
- URIs:
  - `moviebase://*  — activity com.moviebase.ui.main.MainActivity`
  - `auth  — activity com.moviebase.ui.main.MainActivity`
  - `auth.trakt  — activity com.moviebase.ui.main.MainActivity`
  - `https://moviebase-54830.firebaseapp.com/__/auth/links*  — activity com.moviebase.ui.main.MainActivity [autoVerify]`
  - `https://*  — activity com.moviebase.ui.main.MainActivity`
  - `www.moviebase.app  — activity com.moviebase.ui.main.MainActivity`
  - `/home  — activity com.moviebase.ui.main.MainActivity`
  - `https://*  — activity com.moviebase.ui.main.MainActivity`
  - `moviebase.app  — activity com.moviebase.ui.main.MainActivity`
  - `/discover_overview  — activity com.moviebase.ui.main.MainActivity`

### com.mubi — downloads/com.mubi.xapk
- Ver:  (), SDK 36, size 15.0 MB
- Deep links: 3/30 (AppLinks 1)
- Custom: https, mubi | Hosts: *.mubi.com, mubi.com, upgrade-yearly, blackfriday, subscription-settings, subscribe, retrospective, sign-in
- Perms: 20 | Queries pkgs: 5 [com.mubi.go, com.zhiliaoapp.musically, com.google.android.gms.policy_cast_dynamite, com.android.vending, com.google.android.engage.verifyapp]
- URIs:
  - `https://*  — activity com.mubi.ui.MainActivity [autoVerify]`
  - `*.mubi.com  — activity com.mubi.ui.MainActivity [autoVerify]`
  - `mubi.com  — activity com.mubi.ui.MainActivity [autoVerify]`
  - `/showing  — activity com.mubi.ui.MainActivity [autoVerify]`
  - `/.*/showing  — activity com.mubi.ui.MainActivity [autoVerify]`
  - `/.*/.*/showing  — activity com.mubi.ui.MainActivity [autoVerify]`
  - `/films/*  — activity com.mubi.ui.MainActivity [autoVerify]`
  - `/.*/films/.*  — activity com.mubi.ui.MainActivity [autoVerify]`
  - `/.*/.*/films/.*  — activity com.mubi.ui.MainActivity [autoVerify]`
  - `/films/.*/trailer  — activity com.mubi.ui.MainActivity [autoVerify]`

### com.netflix.mediaclient — downloads/com.netflix.mediaclient.xapk
- Ver:  (), SDK 37, size 44.9 MB
- Deep links: 6/29 (AppLinks 4)
- Custom: nflx, http, https | Hosts: www.netflix.com, app.netflix.com, qr.netflix.com, games.netflix.com, msg.netflix.com
- Perms: 37 | Queries pkgs: 20 [com.facebook.katana, com.facebook.lite, com.facebook.orca, com.facebook.mlite, com.instagram.android]
- URIs:
  - `nflx://www.netflix.com  — activity .acquisition.screens.signupContainer.SignupNativeDeepLinkActivity [autoVerify]`
  - `/confirmpageinfosignout*  — activity .acquisition.screens.signupContainer.SignupNativeDeepLinkActivity [autoVerify]`
  - `/loginfromregistration*  — activity .acquisition.screens.signupContainer.SignupNativeDeepLinkActivity [autoVerify]`
  - `http://www.netflix.com  — activity .ui.launch.NetflixComLaunchActivity [autoVerify]`
  - `https://www.netflix.com  — activity .ui.launch.NetflixComLaunchActivity [autoVerify]`
  - `/browse  — activity .ui.launch.NetflixComLaunchActivity [autoVerify]`
  - `/.*/browse  — activity .ui.launch.NetflixComLaunchActivity [autoVerify]`
  - `/browse/genre/.*  — activity .ui.launch.NetflixComLaunchActivity [autoVerify]`
  - `/.*/browse/genre/.*  — activity .ui.launch.NetflixComLaunchActivity [autoVerify]`
  - `/browse/coming-soon  — activity .ui.launch.NetflixComLaunchActivity [autoVerify]`

### com.peacocktv.peacockandroid — downloads/com.peacocktv.peacockandroid.xapk
- Ver:  (), SDK 36, size 8.0 MB
- Deep links: 1/16 (AppLinks 1)
- Custom: https | Hosts: www.peacocktv.com
- Perms: 11 | Queries pkgs: 0 []
- URIs:
  - `https://www.peacocktv.com/deeplink  — activity com.peacock.peacocktv.GoogleMainActivity [autoVerify]`

### com.simkl.lists — downloads/com.simkl.lists.apk
- Ver:  (), SDK 36, size 6.4 MB
- Deep links: 1/10 (AppLinks 0)
- Custom: simkllists | Hosts: -
- Perms: 7 | Queries pkgs: 0 []
- URIs:
  - `simkllists://*  — activity com.simkl.lists.MainActivity`

### com.tozelabs.tvshowtime — downloads/com.tozelabs.tvshowtime.xapk
- Ver:  (), SDK , size 69.7 MB
- Deep links: 0/0 (AppLinks 0)
- Custom: - | Hosts: -
- Perms: 0 | Queries pkgs: 0 []

### com.wbd.stream — downloads/com.wbd.stream.xapk
- Ver:  (), SDK 36, size 66.1 MB
- Deep links: 1/11 (AppLinks 1)
- Custom: https | Hosts: play.hbomax.com, play.max.com
- Perms: 23 | Queries pkgs: 9 [com.partner.device, com.hbo.asia.androidtv, com.dsmart.blu.android, com.discovery.discoplus, com.discovery.dplay]
- URIs:
  - `https://play.hbomax.com  — activity com.wbd.beam.BeamActivity [autoVerify]`
  - `https://play.max.com  — activity com.wbd.beam.BeamActivity [autoVerify]`

### de.ava — downloads/de.ava.xapk
- Ver:  (), SDK 37, size 15.6 MB
- Deep links: 2/12 (AppLinks 1)
- Custom: http, https, ava | Hosts: ava-assistant.app, trakt
- Perms: 12 | Queries pkgs: 18 [com.imdb.mobile, com.amazon.avod.thirdpartyclient, com.whatsapp, com.facebook.orca, com.facebook.mlite]
- URIs:
  - `http://*  — activity de.ava.link.AvaLinkActivity [autoVerify]`
  - `https://*  — activity de.ava.link.AvaLinkActivity [autoVerify]`
  - `ava-assistant.app  — activity de.ava.link.AvaLinkActivity [autoVerify]`
  - `/de/filme.*  — activity de.ava.link.AvaLinkActivity [autoVerify]`
  - `/de/filme/.*  — activity de.ava.link.AvaLinkActivity [autoVerify]`
  - `/de/personen.*  — activity de.ava.link.AvaLinkActivity [autoVerify]`
  - `/de/personen/.*  — activity de.ava.link.AvaLinkActivity [autoVerify]`
  - `/movie.*  — activity de.ava.link.AvaLinkActivity [autoVerify]`
  - `/movie/.*  — activity de.ava.link.AvaLinkActivity [autoVerify]`
  - `/person.*  — activity de.ava.link.AvaLinkActivity [autoVerify]`

### org.jellyfin.mobile — downloads/org.jellyfin.mobile.xapk
- Ver:  (), SDK 36, size 7.8 MB
- Deep links: 0/14 (AppLinks 0)
- Custom: - | Hosts: -
- Perms: 12 | Queries pkgs: 6 [com.mxtech.videoplayer.ad, com.mxtech.videoplayer.pro, is.xyz.mpv, org.videolan.vlc, live.mehiz.mpvkt]

### org.wikipedia — downloads/org.wikipedia.xapk
- Ver:  (), SDK 37, size 44.3 MB
- Deep links: 2/21 (AppLinks 1)
- Custom: http, https, wikipedia | Hosts: *.wikipedia.org
- Perms: 19 | Queries pkgs: 1 [com.google.android.apps.maps]
- URIs:
  - `http://*  — activity org.wikipedia.page.PageActivity [autoVerify]`
  - `https://*  — activity org.wikipedia.page.PageActivity [autoVerify]`
  - `*.wikipedia.org/wiki/*  — activity org.wikipedia.page.PageActivity [autoVerify]`
  - `*.wikipedia.org/zh.*  — activity org.wikipedia.page.PageActivity [autoVerify]`
  - `*.wikipedia.org/sr.*  — activity org.wikipedia.page.PageActivity [autoVerify]`
  - `wikipedia://*  — activity org.wikipedia.page.PageActivity`
  - `*.wikipedia.org  — activity org.wikipedia.page.PageActivity`

### org.xbmc.kodi — downloads/org.xbmc.kodi.apk
- Ver:  (), SDK 34, size 64.7 MB
- Deep links: 1/5 (AppLinks 0)
- Custom: file, content, http, https, ftp, ftps, rtp, rtsp, mms, dav, davs, ssh, sftp, smb | Hosts: -
- Perms: 10 | Queries pkgs: 0 []
- URIs:
  - `(empty)  — activity org.xbmc.kodi.Splash`
  - `(empty)  — activity org.xbmc.kodi.Splash`
  - `(empty)  — activity org.xbmc.kodi.Splash`
  - `file://*  — activity org.xbmc.kodi.Splash`
  - `content://*  — activity org.xbmc.kodi.Splash`
  - `http://*  — activity org.xbmc.kodi.Splash`
  - `https://*  — activity org.xbmc.kodi.Splash`
  - `ftp://*  — activity org.xbmc.kodi.Splash`
  - `ftps://*  — activity org.xbmc.kodi.Splash`
  - `rtp://*  — activity org.xbmc.kodi.Splash`

### ru.kinopoisk — downloads/ru.kinopoisk.xapk
- Ver:  (), SDK 36, size 147.9 MB
- Deep links: 59/110 (AppLinks 13)
- Custom: kp, https, ru.kinopoisk.passport, plus, http | Hosts: movielist, movie, film, player, filmDetail, peopleDetail, premiere, series, search, trailers
- Perms: 37 | Queries pkgs: 20 [com.android.providers.downloads, com.android.vending, com.huawei.appmarket, com.xiaomi.mipicks, com.sec.android.app.samsungapps]
- URIs:
  - `kp://*  — activity ru.kinopoisk.presentation.screen.tabs.RedirectTabsIntentsActivity`
  - `movielist  — activity ru.kinopoisk.presentation.screen.tabs.RedirectTabsIntentsActivity`
  - `kp://*  — activity ru.kinopoisk.presentation.screen.tabs.RedirectTabsIntentsActivity`
  - `movie  — activity ru.kinopoisk.presentation.screen.tabs.RedirectTabsIntentsActivity`
  - `kp://*  — activity ru.kinopoisk.presentation.screen.tabs.RedirectTabsIntentsActivity`
  - `film  — activity ru.kinopoisk.presentation.screen.tabs.RedirectTabsIntentsActivity`
  - `kp://*  — activity ru.kinopoisk.presentation.screen.tabs.RedirectTabsIntentsActivity`
  - `player  — activity ru.kinopoisk.presentation.screen.tabs.RedirectTabsIntentsActivity`
  - `kp://*  — activity ru.kinopoisk.presentation.screen.tabs.RedirectTabsIntentsActivity`
  - `filmDetail  — activity ru.kinopoisk.presentation.screen.tabs.RedirectTabsIntentsActivity`

### tv.trakt.trakt — downloads/tv.trakt.trakt.xapk
- Ver:  (), SDK 37, size 13.2 MB
- Deep links: 1/15 (AppLinks 0)
- Custom: trakt | Hosts: auth
- Perms: 15 | Queries pkgs: 39 [com.amazon.avod.thirdpartyclient, com.netflix.mediaclient, com.apple.atve.androidtv.appletv, com.wbd.stream, com.hulu.plus]
- URIs:
  - `trakt://auth  — activity tv.trakt.trakt.MainActivity`

## Service Coverage
- Services with androidAppId: 30, web-only: 20, downloaded: 26, missing (Play-only): crunchyroll, dubbingbase, emby, plex
## Remaining 3 — Deep Dive (2026-09-05)

**Crunchyroll `com.crunchyroll.crunchyroid` — FOUND via Aptoide**
- Play Store 200, `apkeep apk-pure -l` 0, `huawei`/`f-droid` 0, `apkcombo`/`apkmirror` Cloudflare, but `ws75.aptoide.com/api/7/getApp?package_name=com.crunchyroll.crunchyroid` → `https://pool.apk.aptoide.com/appstvcommunity/com-crunchyroll-crunchyroid-17752-...apk` 121 MB
- Extracted: 10 filters, 1 deep link `crunchyroll://`, icon `res/drawable-xxxhdpi/icon.png` 192×192 (handled via updated `extractIconInfo` fallback to `drawable/icon.png`)
- `apkeep -a com.crunchyroll.crunchyroid downloads` now succeeds via Aptoide pool

**Emby — WRONG ID `com.emby.emby` → CORRECT `com.mb.android`**
- `com.emby.emby` / `com.emby.mobile` → Play Store 404, `apkeep -l` 0, `ws75.aptoide` `APP-1 not found`, `apkcombo`/`apkmirror` 404/Cloudflare
- Search `play.google.com/store/search?q=Emby` → `com.embywatch.app` (wrong), web search `Emby Android APK package` → `https://apkpure.com/emby-for-android/com.mb.android` (APKPure) — **correct package is `com.mb.android`** (Emby for Android)
- `apkeep -a com.mb.android -l` → 33 versions (3.5.55), `apkeep -a com.mb.android downloads` → 51 MB `com.mb.android.xapk` ✓
- Fixed `src/data/services/emby.ts:49` → `androidAppId: "com.mb.android"` + `appUrl` `...?id=com.mb.android`
- Extracted: 24 filters, 3 deep links, `extract-icon` → 3.5 KB

**Dubbingbase `com.dubbingbase.app` — Play-only, not mirrored**
- Play Store 200, `apkeep apk-pure -l` 0, `huawei`/`f-droid`/`aptoide` (`com.dubbingbase`/`com.dubbingbase.app` both `APP-1 not found`), `apkcombo` homepage, `apkmirror` Cloudflare, `en.uptodown` 404, `evozi`/`apk-dl` 404
- Not on any alternative store (checked `apk-pure`, `huawei-app-gallery`, `f-droid`, `ws75.aptoide.com/api/7/getApp`, `apkcombo.com`, `m.apkpure.com`, `apkmirror.com`, `en.uptodown.com`, `en.aptoide.com`, `apps.evozi.com`, `apk-dl.com`)
- Requires `apkeep -d google-play -e <email> -t <aas_token>` or manual `downloads/com.dubbingbase.app.apk`; icon via Play Store fallback in `download-app-images` (now tries APK first, then Play Store)

**Icons from APK (better than Play Store):**
- `scripts/apk-deep-links.ts extract-icon <apk> --out <path>` now handles `mipmap-xxxhdpi/ic_launcher.png` + `drawable-xxxhdpi/icon.png` (crunchyroll) via `unzip -l` + `xxxhdpi` pref
- `src/scripts/download-app-images/index.ts:tryExtractIconFromApk()` tries `downloads/<pkg>.{apk,xapk}` first, then Play Store
- Verified: `moviebase` 384×384 48 KB, `crunchyroll` 192×192 3.8 KB, `emby` 3.5 KB
