#!/usr/bin/env bash
# Regenerates every app icon from the SVG art defined below. Needs rsvg-convert.
# Palette comes from docs/design-system.md / src/style.css (charcoal + lavender).
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=assets/icon; R=android/app/src/main/res
mkdir -p "$SRC"

HEAD='<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">'
DEFS='<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#25222b"/><stop offset="1" stop-color="#111114"/></linearGradient>
<radialGradient id="bloom"><stop offset="0" stop-color="#ccb2fc" stop-opacity=".16"/><stop offset="1" stop-color="#ccb2fc" stop-opacity="0"/></radialGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ccb2fc" stop-opacity=".30"/><stop offset="1" stop-color="#ccb2fc" stop-opacity="0"/></radialGradient>
<linearGradient id="lav" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2d3ff"/><stop offset="1" stop-color="#c8aaf9"/></linearGradient>
<linearGradient id="tile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2933"/><stop offset="1" stop-color="#201e26"/></linearGradient>
<linearGradient id="tedge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#fff" stop-opacity=".06"/></linearGradient>
<linearGradient id="edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="sh" x="-30%" y="-30%" width="170%" height="170%"><feGaussianBlur stdDeviation="22"/></filter>
</defs>'

# Foreground art: 2x2 service picker. TV, website and app tiles are destinations;
# the lavender tile is the title (poster) being opened in one of them.
ART='<circle cx="706" cy="318" r="330" fill="url(#glow)"/>
<g fill="url(#tile)" stroke="url(#tedge)" stroke-width="7">
<rect x="138" y="138" width="360" height="360" rx="86"/><rect x="138" y="526" width="360" height="360" rx="86"/><rect x="526" y="526" width="360" height="360" rx="86"/></g>
<g fill="none" stroke="#a58fd0" stroke-width="24" stroke-linecap="round" stroke-linejoin="round">
<rect x="228" y="242" width="180" height="116" rx="28"/><path d="M 318 358 L 318 392 M 276 394 L 360 394"/>
<rect x="228" y="638" width="180" height="136" rx="28"/><path d="M 228 688 L 408 688"/>
<rect x="656" y="628" width="100" height="156" rx="28"/><path d="M 690 744 L 722 744"/></g>
<g fill="#a58fd0"><circle cx="266" cy="663" r="8"/><circle cx="292" cy="663" r="8"/></g>
<rect x="526" y="162" width="360" height="360" rx="86" fill="#000" fill-opacity=".55" filter="url(#sh)"/>
<rect x="526" y="138" width="360" height="360" rx="86" fill="url(#lav)"/>
<rect x="626" y="198" width="160" height="240" rx="30" fill="#241632"/>
<path d="M 672 352 L 740 284 M 700 284 L 740 284 L 740 324" fill="none" stroke="#e2d3ff" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>'
BGRECT='<rect width="1024" height="1024" fill="url(#bg)"/><circle cx="512" cy="512" r="440" fill="url(#bloom)"/>'
scale(){ echo "<g transform=\"translate(512 512) scale($1) translate(-512 -512)\">$ART</g>"; }

# Adaptive foreground (Android masks it itself; its background is the solid @color/ic_launcher_background).
echo "$HEAD$DEFS$(scale 1)</svg>" > $SRC/foreground.svg
# Web maskable icon: full-bleed square with the art inside the safe zone.
echo "$HEAD$DEFS$BGRECT$(scale .8)</svg>" > $SRC/maskable.svg
# Full icons: rounded (store/web/legacy), round (legacy round), square.
for v in rounded:224:1 square:0:1 round:512:.84; do IFS=: read n rx sc <<<"$v"
  echo "$HEAD$DEFS<clipPath id=\"c\"><rect width=\"1024\" height=\"1024\" rx=\"$rx\"/></clipPath><g clip-path=\"url(#c)\">$BGRECT$(scale $sc)<rect x=\"3\" y=\"3\" width=\"1018\" height=\"1018\" rx=\"$rx\" fill=\"none\" stroke=\"url(#edge)\" stroke-width=\"6\"/></g></svg>" > $SRC/$n.svg
done

r(){ rsvg-convert -w "$1" -h "$1" "$2" -o "$3"; }
cp $SRC/rounded.svg assets/icon.svg; r 512 $SRC/rounded.svg assets/icon.png
for s in 48 72 96 128 192 256 512; do r $s $SRC/rounded.svg icons/icon-$s.webp; done
r 512 $SRC/maskable.svg icons/icon-maskable-512.png
for d in ldpi:36 mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do dn=${d%%:*}; s=${d##*:}; f=$((s*9/4))
  r $s $SRC/rounded.svg $R/mipmap-$dn/ic_launcher.png
  r $s $SRC/round.svg $R/mipmap-$dn/ic_launcher_round.png
  r $f $SRC/foreground.svg $R/mipmap-$dn/ic_launcher_foreground.png
done
