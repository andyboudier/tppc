#!/bin/sh
# Xcode Cloud post-clone: install JS deps so the Capacitor Swift packages
# (referenced by CapApp-SPM/Package.swift at ../../../node_modules/@capacitor/*)
# exist before Xcode resolves Swift Package dependencies.
set -ex

# Resolve the web/Capacitor project dir from THIS script's location, so it works
# regardless of CI_PRIMARY_REPOSITORY_PATH. This script lives at
# polo-chukkas-deploy/ios/App/ci_scripts/ → ../../.. is polo-chukkas-deploy.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
echo "Project dir: $PROJECT_DIR"

# Ensure Node/npm are available (Xcode Cloud runners may not ship Node).
if ! command -v node >/dev/null 2>&1; then
  brew install node@22
  export PATH="$(brew --prefix node@22)/bin:$PATH"
fi
node --version
npm --version

cd "$PROJECT_DIR"

# Install JS deps — this is what creates node_modules/@capacitor/*.
npm install --legacy-peer-deps

# Fail loudly (with a directory listing) if the SPM-referenced packages are
# missing, so the cause is obvious in the build logs.
for p in app splash-screen status-bar local-notifications push-notifications; do
  if [ ! -d "node_modules/@capacitor/$p" ]; then
    echo "ERROR: node_modules/@capacitor/$p missing after npm install" >&2
    ls -la node_modules/@capacitor 2>/dev/null || echo "(no node_modules/@capacitor at all)"
    exit 1
  fi
done

# Build the web bundle, then sync web assets + plugin/SPM wiring into iOS.
npm run build
npx cap sync ios
