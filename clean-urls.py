#!/usr/bin/env python3
"""
BigToolz — Clean URL Converter
----------------------------------
Saare HTML files ke URLs ko clean karta hai:
- something.html → something
- /categories.html → /categories/
- /about.html → /about
- /blog/post.html?slug=abc → /blog/abc/
- /webstories/view.html?slug=xyz → /webstories/xyz/
- /index.html → /

Usage: python clean-urls.py
"""

import os
import re
import sys
import shutil
from datetime import datetime

# ============================================
# CONFIG
# ============================================
SKIP_FILES = ['index.html', '404.html', 'offline.html']

SKIP_DIRS = [
    'node_modules', '.git', 'dist', 'build',
    'assets', 'data', 'components', 'templates',
    'docs', '.github'
]

# Extensions ko skip karo (sirf HTML)
HTML_EXT = '.html'

# Backup folder
BACKUP_DIR = '.backup-urls'

# ============================================
# HELPER FUNCTIONS
# ============================================

def backup_file(filepath):
    """File ka backup banao."""
    try:
        rel_path = filepath.lstrip('./').lstrip('.\\')
        backup_path = os.path.join(BACKUP_DIR, rel_path)
        os.makedirs(os.path.dirname(backup_path), exist_ok=True)
        shutil.copy2(filepath, backup_path)
        return True
    except Exception as e:
        print(f'   ⚠️  Backup failed: {e}')
        return False


def clean_url(url):
    """
    URL ko clean karo.

    Examples:
    - '/categories.html' → '/categories/'
    - '/about.html' → '/about'
    - 'categories.html' → 'categories/'
    - './about.html' → './about'
    - '/blog/post.html?slug=abc' → '/blog/abc/'
    - '/webstories/view.html?slug=xyz' → '/webstories/xyz/'
    - '/blog/index.html' → '/blog/'
    - 'index.html' → '/'
    """
    if not url:
        return url

    # ---- SKIP EXTERNAL / SPECIAL ----
    if url.startswith((
        'http://', 'https://', 'mailto:', 'tel:',
        'javascript:', 'data:', '//', '#'
    )):
        return url

    # ---- BLOG POST ----
    # /blog/post.html?slug=abc → /blog/abc/
    url = re.sub(
        r'(/?blog/)post\.html\?slug=([^&#"\s]+)',
        lambda m: f'/{m.group(1).lstrip("/")}{m.group(2)}/',
        url
    )

    # ---- WEBSTORY ----
    # /webstories/view.html?slug=xyz → /webstories/xyz/
    url = re.sub(
        r'(/?webstories/)view\.html\?slug=([^&#"\s]+)',
        lambda m: f'/{m.group(1).lstrip("/")}{m.group(2)}/',
        url
    )

    # ---- ADMIN EDITOR ----
    # /admin/editor.html?id=abc → /admin/editor/?id=abc (keep query)
    url = re.sub(
        r'(/?admin/)editor\.html(\?id=[^&#"\s]+)?',
        lambda m: f'/{m.group(1).lstrip("/")}editor/{m.group(2) or ""}',
        url
    )

    # ---- INDEX.HTML → / ----
    # /blog/index.html → /blog/
    # /index.html → /
    # index.html → /
    url = re.sub(r'(^|/)index\.html$', r'\1', url)
    url = re.sub(r'(^|/)index\.html(?=[#?\s])', r'\1', url)

    # ---- CATEGORIES / TOOLS / ETC → trailing slash ----
    # Categories.html → categories/
    # /categories.html → /categories/
    url = re.sub(
        r'(^|/)(categories|tools|blog|webstories|search)\.html(?=[#?\s]|$)',
        r'\1\2/',
        url
    )

    # ---- GENERIC .HTML REMOVE ----
    # about.html → about
    # /about.html → /about
    # something.html#anchor → something#anchor
    url = re.sub(r'\.html(?=[#?\s]|$)', '', url)

    return url


def process_html_file(filepath):
    """HTML file ke saare URLs clean karo."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f'   ❌ Read error: {e}')
        return False, 0

    original = content
    changes = 0

    # ===== 1. href="..." =====
    def replace_href(match):
        nonlocal changes
        quote = match.group(1)
        url = match.group(2)
        cleaned = clean_url(url)
        if cleaned != url:
            changes += 1
        return f'href={quote}{cleaned}{quote}'

    content = re.sub(r'href=(["\'])([^"\']*)\1', replace_href, content)

    # ===== 2. action="..." (forms) =====
    def replace_action(match):
        nonlocal changes
        quote = match.group(1)
        url = match.group(2)
        cleaned = clean_url(url)
        if cleaned != url:
            changes += 1
        return f'action={quote}{cleaned}{quote}'

    content = re.sub(r'action=(["\'])([^"\']*)\1', replace_action, content)

    # ===== 3. canonical =====
    def replace_canonical(match):
        nonlocal changes
        prefix = match.group(1)
        url = match.group(2)
        cleaned = clean_url(url)
        if cleaned != url:
            changes += 1
        return f'{prefix}{cleaned}"'

    content = re.sub(
        r'(rel="canonical"\s+href=")([^"]*)"',
        replace_canonical,
        content
    )

    # ===== 4. og:url =====
    def replace_og(match):
        nonlocal changes
        prefix = match.group(1)
        url = match.group(2)
        cleaned = clean_url(url)
        if cleaned != url:
            changes += 1
        return f'{prefix}{cleaned}"'

    content = re.sub(
        r'(property="og:url"\s+content=")([^"]*)"',
        replace_og,
        content
    )

    # ===== 5. twitter:url =====
    content = re.sub(
        r'(name="twitter:url"\s+content=")([^"]*)"',
        replace_og,
        content
    )

    # ===== 6. JS: window.location.href = "..." =====
    def replace_location(match):
        nonlocal changes
        prefix = match.group(1)
        url = match.group(2)
        quote = match.group(3)
        cleaned = clean_url(url)
        if cleaned != url:
            changes += 1
        return f'{prefix}{cleaned}{quote}'

    content = re.sub(
        r'(window\.location\.href\s*=\s*)(["\'])([^"\']*)\2',
        lambda m: replace_location(
            type('obj', (), {
                'group': lambda self, n: [None, m.group(1), m.group(3), m.group(2)][n]
            })()
        ),
        content
    )

    # ===== 7. JS: location.href = "..." =====
    content = re.sub(
        r'(location\.href\s*=\s*)(["\'])([^"\']*)\2',
        lambda m: f'{m.group(1)}{m.group(2)}{clean_url(m.group(3))}{m.group(2)}',
        content
    )

    # ===== 8. JSON-LD "url": "..." =====
    content = re.sub(
        r'("url"\s*:\s*")([^"]*)"',
        lambda m: f'{m.group(1)}{clean_url(m.group(2))}"',
        content
    )

    # ===== 9. fetch('something.html') =====
    content = re.sub(
        r"(fetch\s*\(\s*['\"])([^'\"]+?)\.html(['\"])",
        lambda m: f'{m.group(1)}{clean_url(m.group(2))}{m.group(3)}',
        content
    )

    if content != original:
        # Backup
        backup_file(filepath)

        # Write updated content
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, changes
        except Exception as e:
            print(f'   ❌ Write error: {e}')
            return False, 0

    return False, 0


# ============================================
# MAIN
# ============================================

def main():
    print('\n' + '=' * 60)
    print('🚀 BigToolz — Clean URL Converter')
    print('=' * 60)
    print(f'📁 Working directory: {os.getcwd()}')
    print(f'📦 Backup folder: {BACKUP_DIR}/')
    print('=' * 60 + '\n')

    # Backup folder clean karo
    if os.path.exists(BACKUP_DIR):
        shutil.rmtree(BACKUP_DIR)
    os.makedirs(BACKUP_DIR, exist_ok=True)

    updated = 0
    skipped = 0
    errors = 0
    total_changes = 0

    for root, dirs, files in os.walk('.'):
        # Skip folders
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        for filename in files:
            if not filename.endswith(HTML_EXT):
                continue

            if filename in SKIP_FILES:
                skipped += 1
                continue

            filepath = os.path.join(root, filename)
            rel = os.path.relpath(filepath)

            try:
                changed, count = process_html_file(filepath)

                if changed:
                    print(f'✅ Updated: {rel}  ({count} URLs)')
                    updated += 1
                    total_changes += count
                else:
                    print(f'⏭  No change: {rel}')

            except Exception as e:
                print(f'❌ Error in {rel}: {e}')
                errors += 1

    # Summary
    print('\n' + '=' * 60)
    print('📊 SUMMARY')
    print('=' * 60)
    print(f'✅ Files updated:    {updated}')
    print(f'🔗 URLs cleaned:     {total_changes}')
    print(f'⏭  Files skipped:    {skipped}')
    print(f'❌ Errors:           {errors}')
    print(f'💾 Backup location:  {BACKUP_DIR}/')
    print('=' * 60)

    if updated > 0:
        print('\n🎉 Clean URLs applied!')
        print('📝 To restore: delete files and copy from backup folder')
        print('🚀 Next: host karo — URLs automatically clean ho jayenge')
    else:
        print('\n✨ No changes needed — already clean!')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n\n⚠️  Cancelled by user')
        sys.exit(1)