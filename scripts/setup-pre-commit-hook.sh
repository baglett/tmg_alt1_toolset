#!/bin/bash
# Setup script to install the pre-commit build hook

set -e

HOOK_DIR=".git/hooks"
HOOK_FILE="$HOOK_DIR/pre-commit"
SCRIPT_DIR="$(dirname "$0")"

# Create hooks directory if it doesn't exist
mkdir -p "$HOOK_DIR"

# Create the pre-commit hook
cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash
# Auto-generated pre-commit hook for TMG Alt1 Toolset
# Automatically builds all components and plugins before commit

# Run the build script
./scripts/pre-commit-build.sh

# Stage any newly built files
git add plugins/*/dist/ components/*/dist/ 2>/dev/null || true
EOF

# Make the hook executable
chmod +x "$HOOK_FILE"

echo "✅ Pre-commit hook installed successfully!"
echo "📦 All commits will now automatically build components and plugins"
echo "⚠️  To disable: remove .git/hooks/pre-commit"
echo "🔧 To reinstall: run ./scripts/setup-pre-commit-hook.sh"