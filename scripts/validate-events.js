#!/usr/bin/env node

/**
 * Event Data Validation Script
 * Validates all event markdown files for:
 * - Date field exists
 * - Filename year matches content year
 * - Required fields present
 * - Valid era and category values
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const VALID_ERAS = ['preinca', 'inca', 'conquista', 'colonia', 'republica', 'contemporaneo'];
const VALID_CATEGORIES = ['politica', 'cultura', 'economia', 'conflictos'];

async function validateEvents() {
  const eventsDir = './src/content/events';
  const files = await readdir(eventsDir);
  const errors = [];
  const warnings = [];
  let totalFiles = 0;

  console.log('🔍 Validating event files...\n');

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    totalFiles++;
    const filePath = join(eventsDir, file);
    const content = await readFile(filePath, 'utf-8');

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
    if (!frontmatterMatch) {
      errors.push({ file, issue: 'Missing or invalid frontmatter' });
      continue;
    }

    const frontmatter = frontmatterMatch[1];

    // Check required fields
    const dateMatch = frontmatter.match(/^date:\s*(.+)$/m);
    const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
    const categoryMatch = frontmatter.match(/^category:\s*(.+)$/m);
    const eraMatch = frontmatter.match(/^era:\s*(.+)$/m);

    if (!dateMatch) {
      errors.push({ file, issue: 'Missing date field' });
      continue;
    }

    if (!titleMatch) {
      errors.push({ file, issue: 'Missing title field' });
    }

    if (!categoryMatch) {
      errors.push({ file, issue: 'Missing category field' });
    } else if (!VALID_CATEGORIES.includes(categoryMatch[1].trim())) {
      errors.push({ file, issue: `Invalid category: ${categoryMatch[1]}` });
    }

    if (!eraMatch) {
      errors.push({ file, issue: 'Missing era field' });
    } else if (!VALID_ERAS.includes(eraMatch[1].trim())) {
      errors.push({ file, issue: `Invalid era: ${eraMatch[1]}` });
    }

    // Check filename vs content date match
    const filenameYear = file.split('-')[0];
    const contentDateStr = dateMatch[1].trim();
    const contentYear = contentDateStr.split('-')[0];

    // Handle negative years (BCE)
    const isFileBCE = filenameYear === '';
    const actualFilenameYear = isFileBCE ? file.split('-')[1] : filenameYear;

    if (!isFileBCE && filenameYear !== contentYear) {
      errors.push({
        file,
        issue: 'Date mismatch',
        filename: filenameYear,
        content: contentYear,
        contentDate: contentDateStr
      });
    }

    // Validate date format
    const dateObj = new Date(contentDateStr);
    if (isNaN(dateObj.getTime()) && parseInt(contentYear) < 10000) {
      warnings.push({ file, issue: `Potentially invalid date: ${contentDateStr}` });
    }

    // Check if content body exists
    const bodyMatch = content.match(/^---\n[\s\S]+?\n---\n\n(.+)/);
    if (!bodyMatch || bodyMatch[1].trim().length < 20) {
      warnings.push({ file, issue: 'Missing or very short content body' });
    }
  }

  // Print results
  console.log(`\n📊 Validation Results:`);
  console.log(`Total files checked: ${totalFiles}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}\n`);

  if (errors.length > 0) {
    console.log('❌ ERRORS:\n');
    errors.forEach((e, i) => {
      console.log(`${i + 1}. ${e.file}`);
      console.log(`   Issue: ${e.issue}`);
      if (e.filename && e.content) {
        console.log(`   Filename year: ${e.filename} | Content year: ${e.content}`);
        console.log(`   Content date: ${e.contentDate}`);
      }
      console.log();
    });
  }

  if (warnings.length > 0 && errors.length < 50) {
    console.log('\n⚠️  WARNINGS (first 10):\n');
    warnings.slice(0, 10).forEach((w, i) => {
      console.log(`${i + 1}. ${w.file}: ${w.issue}`);
    });
    if (warnings.length > 10) {
      console.log(`\n   ... and ${warnings.length - 10} more warnings`);
    }
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All events validated successfully!\n');
    process.exit(0);
  } else if (errors.length > 0) {
    console.log(`\n💡 Fix errors using: node scripts/fix-date-mismatches.js\n`);
    process.exit(1);
  } else {
    console.log('\n✅ No errors found (warnings are informational)\n');
    process.exit(0);
  }
}

validateEvents().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
