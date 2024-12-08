#!/bin/bash

set -e

echo "🚀 Building Readify extension..."

echo "📦 Building content script..."
bun run ./scripts/build-content.ts

echo "🛠 Building for Chrome/Edge..."
bun wxt zip &
CHROME_PID=$!

bun wxt zip -b firefox &
FIREFOX_PID=$!

bun wxt build -b safari && cp -R ./extension-build/safari-mv2/. ./apple-platform/Readify/Shared\ \(Extension\)/Resources/ &
SAFARI_PID=$!

wait $CHROME_PID $FIREFOX_PID $SAFARI_PID

echo "✨ Build complete! Check the extension-build directory for the output files."
