#!/usr/bin/env bash
# exit on error
set -o errexit

npm install

# Download Chromium for Puppeteer
echo "Installing Puppeteer browser..."
npx puppeteer browsers install chrome
