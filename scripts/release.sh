#!/usr/bin/env bash
set -euo pipefail

bump_semver() {
  TYPE="$1"  # patch | minor | major
  CURR=$(node -p "require('./package.json').version")
  BASE=$(echo "$CURR" | grep -oE '^[0-9]+\.[0-9]+\.[0-9]+')
  IFS='.' read -r MAJOR MINOR PATCH <<< "$BASE"
  case "$TYPE" in
    major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
    minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
    patch) PATCH=$((PATCH + 1)) ;;
    *) echo "bump type must be patch|minor|major (got: $TYPE)"; exit 1 ;;
  esac
  echo "$MAJOR.$MINOR.$PATCH"
}

do_bump() {
  VERSION="$1"
  if [ -z "$VERSION" ]; then
    echo "usage: $0 bump VERSION"
    echo "       $0 bump 1.3.1     (literal)"
    echo "       $0 bump patch     (auto-bump patch)"
    echo "       $0 bump minor|major"
    exit 1
  fi
  case "$VERSION" in
    patch|minor|major) VERSION=$(bump_semver "$VERSION") ;;
  esac
  node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.version='$VERSION';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');"
  BASE=$(node -e "const v='$VERSION'.match(/^[0-9]+\.[0-9]+\.[0-9]+/)[0].split('.').map(Number);console.log(v[0]*1000000+v[1]*1000+v[2]);")
  sed -i -E "s/versionName \".*\"/versionName \"$VERSION\"/" android/app/build.gradle
  sed -i -E "s/versionCode [0-9]+/versionCode $BASE/" android/app/build.gradle
  echo "Bumped to $VERSION (versionCode $BASE)"
}

do_release() {
  TYPE="$1"  # stable | beta
  ARG="${2:-}"

  if [ "$TYPE" = "stable" ]; then
    BUMP_TYPE="$ARG"
    if [ -z "$BUMP_TYPE" ]; then
      echo "usage: $0 release:stable [VERSION|patch|minor|major]"
      exit 1
    fi
    case "$BUMP_TYPE" in
      patch|minor|major) VERSION=$(bump_semver "$BUMP_TYPE") ;;
      *)
        if echo "$BUMP_TYPE" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
          VERSION="$BUMP_TYPE"
        else
          echo "Stable release requires X.Y.Z, patch, minor, or major. Got: $BUMP_TYPE"
          exit 1
        fi
        ;;
    esac
  elif [ "$TYPE" = "beta" ]; then
    if [ "$ARG" = "bump" ] || [ -z "$ARG" ]; then
      CURR=$(node -p "require('./package.json').version")
      BASE=$(echo "$CURR" | grep -oE '^[0-9]+\.[0-9]+\.[0-9]+')
      N=$(echo "$CURR" | grep -oE 'beta\.[0-9]+' | grep -oE '[0-9]+' || echo "0")
      VERSION="${BASE}-beta.$((N+1))"
    else
      VERSION="$ARG"
    fi
  else
    echo "usage: $0 release:stable [VERSION|patch|minor|major] | release:beta [VERSION|bump]"
    exit 1
  fi

  do_bump "$VERSION"
  git add package.json android/app/build.gradle
  git commit -m "chore: release v$VERSION"
  TAG="v$VERSION"
  if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "Tag $TAG already exists, skipping."
  else
    git tag -a "$TAG" -m "$TAG"
  fi
  git push origin main
  git push origin "$TAG"
  echo "» Pushed $TAG - Android build will run."
}

CMD="${1:-}"
if [ "$CMD" = "bump" ]; then
  do_bump "${2:-}"
elif [ "$CMD" = "release:stable" ]; then
  do_release stable "${2:-}"
elif [ "$CMD" = "release:beta" ]; then
  do_release beta "${2:-}"
else
  echo "usage: $0 bump [VERSION|patch|minor|major] | release:stable [VERSION|patch|minor|major] | release:beta [VERSION|bump]"
  exit 1
fi
