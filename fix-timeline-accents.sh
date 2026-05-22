#!/bin/bash
# Fix missing accents in EditorialTimeline.tsx

cd /Users/shiara/Documents/personal-projects/timeline-peru

echo "Fixing accents in EditorialTimeline.tsx..."

# Fix "Republica" to "República"
sed -i '' 's/label: "Republica"/label: "República"/g' src/components/EditorialTimeline.tsx

# Fix "Contemporaneo" to "Contemporáneo"
sed -i '' 's/label: "Contemporaneo"/label: "Contemporáneo"/g' src/components/EditorialTimeline.tsx

echo "Done! Accents fixed."
echo ""
echo "Changes made:"
echo "  - Line 51: 'Republica' → 'República'"
echo "  - Line 59: 'Contemporaneo' → 'Contemporáneo'"
