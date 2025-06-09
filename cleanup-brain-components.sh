#!/bin/bash

echo "🧠 Cleaning up unused brain components..."

# List of unused brain components to remove
UNUSED_COMPONENTS=(
    "src/components/3d/AnatomicalBrain.tsx"
    "src/components/3d/BrainBorderLayer.tsx"
    "src/components/3d/BrainUniverse.tsx"
    "src/components/3d/EnhancedBrainUniverse.tsx"
    "src/components/3d/Real3DBrain.tsx"
    "src/components/3d/RealBrainModel.tsx"
    "src/components/3d/RealBrainVisualization.tsx"
    "src/components/3d/SimpleBrainTest.tsx"
    "src/components/3d/SubtleBrainBackground.tsx"
    "src/components/3d/PartialAnatomicalBrain.tsx"
)

# Create backup directory
mkdir -p .brain-backup/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=".brain-backup/$(date +%Y%m%d_%H%M%S)"

echo "📁 Creating backup in $BACKUP_DIR"

# Backup and remove unused components
for component in "${UNUSED_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "🔄 Backing up and removing $component"
        cp "$component" "$BACKUP_DIR/"
        rm "$component"
    else
        echo "⚠️  $component not found"
    fi
done

# Also backup and remove unused brain-related directories if empty
for dir in src/app/brain-sample src/app/brain-test; do
    if [ -d "$dir" ]; then
        echo "🔄 Backing up and removing $dir"
        cp -r "$dir" "$BACKUP_DIR/"
        rm -rf "$dir"
    fi
done

echo "✅ Cleanup complete!"
echo "📊 Removed components:"
for component in "${UNUSED_COMPONENTS[@]}"; do
    echo "   - $(basename "$component")"
done

echo ""
echo "🎯 Active Brain System:"
echo "   ✅ LayeredBrainSystem.tsx (main system)"
echo "   ✅ VictorStyleBrain.tsx (new anatomical brain)"
echo "   ✅ BrainSystemDemo.tsx (demo page)"
echo "   ❌ OptimizedBrain.tsx (replaced by VictorStyleBrain)"
echo ""
echo "💾 Backups saved to: $BACKUP_DIR"
echo "🔄 You can restore any component from the backup if needed"