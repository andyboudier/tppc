#!/bin/sh
set -e

# Xcode Cloud runners ship without Node; install it via Homebrew.
brew install node@22
export PATH="$(brew --prefix node@22)/bin:$PATH"

# Move into the Capacitor/web project inside the monorepo.
cd "$CI_PRIMARY_REPOSITORY_PATH/polo-chukkas-deploy"

# Install JS deps. This is what creates node_modules/@capacitor/* — the local
# Swift packages the Xcode build referenced but couldn't find.
npm install --legacy-peer-deps

# Build the web bundle, then sync web assets + plugin/SPM wiring into iOS.
npm run build
npx cap sync ios
