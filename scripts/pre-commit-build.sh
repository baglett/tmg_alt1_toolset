#!/bin/bash
# Pre-commit build script for TMG Alt1 Toolset
# This script automatically builds all components and plugins before commit

set -e  # Exit on any error

echo "🔨 Pre-commit: Building all components and plugins..."

# Build all workspaces
npm run build:all

echo "✅ Pre-commit: All builds completed successfully"
echo "📦 Built dist/ files will be included in commit"

# Check if any dist files were modified
if git diff --cached --name-only | grep -q "dist/"; then
    echo "ℹ️  Pre-commit: dist/ files are staged for commit"
else
    echo "⚠️  Pre-commit: No dist/ files staged - this may indicate build didn't update anything"
fi