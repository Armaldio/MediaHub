#!/usr/bin/env bash
set -euo pipefail

VER="${1:-}"
if [ -z "$VER" ]; then
  echo "Usage: mise run release <version>   (e.g. mise run release 1.0.19)"
  exit 1
fi

VER="${VER#v}"
TAG="v$VER"

echo "» Releasing $TAG"

node -e "const f='package.json';const p=require('./'+f);p.version='$VER';require('fs').writeFileSync(f,JSON.stringify(p,null,2)+'\n')"

git add -A
git commit -m "chore(release): $TAG"
git tag -a "$TAG" -m "$TAG"
git push origin "$TAG"

echo "» Pushed $TAG - GitHub Actions will build the AAB/APK and upload to the Play Console internal track."
