#!/bin/bash

# Cleanup script for unused files in epic-3d-portfolio
# Run this script to remove unused files and clean up the workspace

echo "🧹 Starting cleanup of unused files..."

# Create backup directory first
mkdir -p ./cleanup-backup
echo "📦 Created backup directory: ./cleanup-backup"

# Function to safely remove file with backup
safe_remove() {
    if [ -f "$1" ]; then
        echo "🗑️  Removing: $1"
        cp "$1" "./cleanup-backup/$(basename "$1")" 2>/dev/null
        rm "$1"
    else
        echo "⚠️  File not found: $1"
    fi
}

# Remove alternative page files
echo "📄 Cleaning up alternative page files..."
safe_remove "src/app/page-new.tsx"
safe_remove "src/app/page-old.tsx"
safe_remove "src/app/blog/page_fixed.tsx"

# Remove backup/fixed component files
echo "🔧 Cleaning up backup component files..."
safe_remove "src/components/3d/BrainUniverse_fixed.tsx"
safe_remove "src/app/studio/[[...tool]]/page-robust.tsx"

# Remove Galaxy-related components (replaced by Brain Universe)
echo "🌌 Cleaning up legacy Galaxy components..."
safe_remove "src/components/3d/Galaxy.tsx"
safe_remove "src/components/3d/GalaxyClient.tsx"
safe_remove "src/components/3d/GalaxyWrapper.tsx"
safe_remove "src/components/3d/CosmicBackground.tsx"
safe_remove "src/components/3d/NavigationPlanets.tsx"
safe_remove "src/components/3d/Starfield.tsx"
safe_remove "src/components/3d/Constellations.tsx"

# Remove embedded Sanity studio (using external :3333 instead)
echo "🎨 Cleaning up embedded studio components..."
safe_remove "src/app/studio"

# Remove backup configuration files
echo "⚙️ Cleaning up backup configuration files..."
safe_remove "sanity.config.simple.ts.backup"
safe_remove "sanity.config.minimal.ts"

# Remove technical documentation (if resolved)
echo "📚 Cleaning up resolved technical documentation..."
safe_remove "DARK_BACKGROUND_3D_FIX.md"
safe_remove "BACKGROUND_TRANSPARENCY_FIX.md"
safe_remove "studio-alternatives.md"

echo ""
echo "✅ Cleanup completed!"
echo "📦 Backup files saved in: ./cleanup-backup/"
echo ""
echo "⚠️ IMPORTANT: Using external Sanity studio at :3333"
echo "   - Run 'npm run sanity' or 'npx sanity dev' to start studio"
echo "   - Access studio at http://localhost:3333"
echo "   - Embedded studio at /studio has been removed"
echo ""
echo "🔍 Files that still need manual review:"
echo "   - BRAIN_UNIVERSE_COMPLETE.md (keep if useful)"
echo "   - BRAIN_UNIVERSE_GUIDE.md (keep if useful)"
echo "   - MODERN_3D_SYSTEM.md (keep if useful)"
echo ""
echo "📊 Before cleanup, run: du -sh . to see space usage"
echo "📊 After cleanup, run: du -sh . to see space saved"
