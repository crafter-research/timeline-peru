#!/usr/bin/env python3
"""Fix all event files to have valid YAML frontmatter."""

import os
import re
import sys

EVENTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'events')

def fix_date(date_str):
    """Convert date string to valid YYYY-MM-DD format."""
    date_str = date_str.strip().strip('"').strip("'")

    # Handle negative years (BC)
    if date_str.startswith('-'):
        parts = date_str[1:].split('-')
        year = str(abs(int(parts[0]))).zfill(4)
        month = parts[1].zfill(2) if len(parts) > 1 else '01'
        day = parts[2].zfill(2) if len(parts) > 2 else '01'
    else:
        parts = date_str.split('-')
        year = parts[0].zfill(4)
        month = parts[1].zfill(2) if len(parts) > 1 else '01'
        day = parts[2].zfill(2) if len(parts) > 2 else '01'

    return f'{year}-{month}-{day}'

def fix_file(filepath):
    """Fix a single event file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if it has valid frontmatter
        if not content.startswith('---'):
            return False, 'No frontmatter'

        # Extract frontmatter
        parts = content.split('---', 2)
        if len(parts) < 3:
            return False, 'Invalid frontmatter structure'

        frontmatter = parts[1].strip()
        body = parts[2]

        # Parse and fix each line
        new_lines = []
        for line in frontmatter.split('\n'):
            line = line.strip()
            if not line:
                continue

            if ':' not in line:
                continue

            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()

            # Fix date
            if key == 'date':
                value = fix_date(value)

            # Fix title (remove colons that break YAML)
            if key == 'title':
                # If value contains : and isn't quoted, quote it
                if ':' in value and not (value.startswith('"') or value.startswith("'")):
                    value = value.replace(':', ' -')

            new_lines.append(f'{key}: {value}')

        new_content = '---\n' + '\n'.join(new_lines) + '\n---' + body

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True, 'Fixed'

        return False, 'No changes needed'

    except Exception as e:
        return False, str(e)

def main():
    fixed = 0
    errors = []

    for filename in os.listdir(EVENTS_DIR):
        if not filename.endswith('.md'):
            continue

        filepath = os.path.join(EVENTS_DIR, filename)
        success, message = fix_file(filepath)

        if success:
            fixed += 1
        elif 'No changes' not in message:
            errors.append(f'{filename}: {message}')

    print(f'Fixed: {fixed} files')
    print(f'Errors: {len(errors)}')

    if errors and '-v' in sys.argv:
        for e in errors[:20]:
            print(f'  {e}')

if __name__ == '__main__':
    main()
