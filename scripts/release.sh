#!/usr/bin/env bash
set -euo pipefail

bump_semver() {
  TYPE="$1"
  CURR=$(node -p "require('./package.json').version")
  BASE=$(echo "$CURR" | grep -oE '^[0-9]+\.[0-9]+\.[0-9]+')
  IFS='.' read -r MAJOR MINOR PATCH <<< "$BASE"
  case "$TYPE" in
    major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
    minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
    patch) PATCH=$((PATCH + 1)) ;;
    *) echo "unknown bump type: $TYPE"; exit 1 ;;
  esac
  echo "$MAJOR.$MINOR.$PATCH"
}

apply_version() {
  VERSION="$1"
  node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.version='$VERSION';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');"
  BASE=$(node -e "const v='$VERSION'.match(/^[0-9]+\.[0-9]+\.[0-9]+/)[0].split('.').map(Number);console.log(v[0]*1000000+v[1]*1000+v[2]);")
  sed -i -E "s/versionName \".*\"/versionName \"$VERSION\"/" android/app/build.gradle
  sed -i -E "s/versionCode [0-9]+/versionCode $BASE/" android/app/build.gradle
  echo "→ $VERSION (versionCode $BASE)"
}

bump="${1:-patch}"
if [ "$bump" = "bump" ]; then bump="patch"; fi

case "$bump" in
  major|minor|patch) VERSION=$(bump_semver "$bump") ;;
  *)
    if echo "$bump" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+(-beta\.[0-9]+)?$'; then
      VERSION="$bump"
    else
      echo "usage: release [patch|minor|major|X.Y.Z|X.Y.Z-beta.N]"
      exit 1
    fi
    ;;
esac

apply_version "$VERSION"
git add package.json android/app/build.gradle
git commit -m "chore: release v$VERSION"
git tag -a "v$VERSION" -m "v$VERSION" 2>/dev/null || echo "(tag exists, skipping)"
git push origin main
git push origin "v$VERSION"
echo "» v$VERSION pushed — Android build will run."
