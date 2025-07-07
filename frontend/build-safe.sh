#!/bin/bash
# Safe build script for WSL/Windows environment

echo "🧹 Cleaning up previous builds..."
rm -rf .output .nuxt 2>/dev/null || true

echo "🔧 Setting permissions..."
chmod -R 755 . 2>/dev/null || true

echo "🚀 Building project..."
npm run build

echo "✅ Build completed successfully!"