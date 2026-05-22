#!/usr/bin/env node

/**
 * Fix Date Mismatch Script
 * Renames event files to match their content date
 *
 * Usage:
 *   node scripts/fix-date-mismatches.js --dry-run    (preview changes)
 *   node scripts/fix-date-mismatches.js --apply      (apply changes)
 *   node scripts/fix-date-mismatches.js --fix-first=30  (apply first 30 fixes)
 */

import { readdir, readFile, rename } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function fixDateMismatches() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run') || args.length === 0;
  const isApply = args.includes('--apply');
  const fixFirstArg = args.find(arg => arg.startsWith('--fix-first='));
  const fixFirstCount = fixFirstArg ? parseInt(fixFirstArg.split('=')[1]) : null;

  const eventsDir = './src/content/events';
  const files = await readdir(eventsDir);
  const renames = [];

  console.log('🔍 Finding date mismatches...\n');

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const content = await readFile(join(eventsDir, file), 'utf-8');
    const dateMatch = content.match(/^date:\s*(.+)$/m);

    if (!dateMatch) continue;

    const filenameYear = file.split('-')[0];
    const contentDateStr = dateMatch[1].trim();
    const contentYear = contentDateStr.split('-')[0];

    // Skip BCE files (they start with empty or have different naming)
    if (filenameYear === '') continue;
    // Skip files starting with "preinca" or other era prefixes
    if (filenameYear === 'preinca' || filenameYear === 'inca') continue;

    if (filenameYear !== contentYear) {
      // Extract rest of filename after year
      const restOfFilename = file.substring(filenameYear.length + 1);
      const newFilename = `${contentYear}-${restOfFilename}`;

      renames.push({
        oldFile: file,
        newFile: newFilename,
        oldPath: join(eventsDir, file),
        newPath: join(eventsDir, newFilename),
        year: { old: filenameYear, new: contentYear },
        contentDate: contentDateStr
      });
    }
  }

  if (renames.length === 0) {
    console.log('✅ No date mismatches found!\n');
    return;
  }

  console.log(`Found ${renames.length} files with date mismatches:\n`);

  // Determine how many to show/fix
  const countToProcess = fixFirstCount || renames.length;
  const renamesToProcess = renames.slice(0, countToProcess);

  // Show preview
  renamesToProcess.forEach((r, i) => {
    console.log(`${i + 1}. ${r.oldFile}`);
    console.log(`   → ${r.newFile}`);
    console.log(`   (Filename: ${r.year.old} | Content: ${r.contentDate})\n`);
  });

  if (renames.length > countToProcess) {
    console.log(`   ... and ${renames.length - countToProcess} more\n`);
  }

  if (isDryRun) {
    console.log('📋 DRY RUN MODE - No changes made\n');
    console.log('To apply changes, run:');
    console.log('  node scripts/fix-date-mismatches.js --apply\n');
    console.log('To fix only first N files:');
    console.log('  node scripts/fix-date-mismatches.js --fix-first=30\n');
    return;
  }

  if (isApply || fixFirstCount) {
    console.log('⚠️  APPLYING CHANGES - Make sure you have git backup!\n');
    console.log('🔄 Renaming files...\n');

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const r of renamesToProcess) {
      try {
        // Check if target filename already exists
        if (existsSync(r.newPath)) {
          console.log(`⚠️  SKIP: ${r.newFile} already exists`);
          skipCount++;
          continue;
        }

        await rename(r.oldPath, r.newPath);
        console.log(`✓ Renamed: ${r.oldFile} → ${r.newFile}`);
        successCount++;
      } catch (err) {
        console.error(`✗ Error renaming ${r.oldFile}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n✅ Rename operation complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Skipped: ${skipCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Remaining: ${renames.length - renamesToProcess.length}\n`);
  }
}

fixDateMismatches().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
