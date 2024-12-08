#!/bin/bash

set -e

echo "🚀 Starting Readify development environment..."

echo "📦 Building initial content script..."
bun run ./scripts/build-content.ts

echo "🔧 Starting WXT dev server..."
bun wxt &
WXT_PID=$!

echo "👀 Watching for rebuild triggers (press Enter to rebuild)..."
while true; do
    read -r

    echo "🔄 Rebuilding content script..."
    bun run ./scripts/build-content.ts
    sleep 1

    echo "🔄 Triggering WXT reload..."
    touch ./wxt-src/entrypoints/content.ts
done

trap 'kill $WXT_PID' EXIT
