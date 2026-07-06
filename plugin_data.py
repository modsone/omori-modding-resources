import os
import json
import re

# Configurations
REPOS_ROOT = "."  # Scans the current folder and all subfolders
OUTPUT_FILE = "plugins.json"
BASE_GITHUB_URL = "https://github.com/modsone/omori-modding-resources/blob/main/"

def parse_tag(tag: str):
    tag = tag.lower().strip()
    # Remove trailing redundant words like "plugin" or "plugins"
    tag = re.sub(r"\s*(?:plugin|plugins)$", "", tag)
    # Normalize whitespace
    tag = re.sub(r"\s+", " ", tag).strip()
    return tag
    
    
def generate_plugin_list():
    plugin_list = []
    print("Building plugin database JSON from folder structure...")

    for root, dirs, files in os.walk(REPOS_ROOT):
        # Prevent searching inside hidden folders (like .git or system folders)
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            if file.endswith('.js'):
                full_path = os.path.join(root, file)
                plugin_name = os.path.splitext(file)[0] # Clean name without extension
                
                # Format relative URL path
                rel_path = os.path.relpath(full_path, REPOS_ROOT).replace(os.sep, '/')
                github_url = f"{BASE_GITHUB_URL}{rel_path}"
                
                # Parse plugin header for description and author
                description = ""
                authors_parsed = None
                try:
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as jf:
                        content = jf.read()
                    m_desc = re.search(r'@plugindesc\s+(.+)', content)
                    if m_desc:
                        description = m_desc.group(1).strip().strip('*/ ').strip()
                    m_author = re.search(r'@author\s+(.+)', content)
                    if m_author:
                        raw_auth = m_author.group(1).strip().strip('*/ ').strip()
                        authors_parsed = [a.strip() for a in re.split(r',|&| and ', raw_auth) if a.strip()]
                except Exception:
                    pass

                # Break up parent folder names as tags
                # Example: "plugins/battle/skills/heal.js" -> ["battle", "skills"]
                path_parts = rel_path.split('/')[:-1]
                tags = [parse_tag(part) for part in path_parts if part.lower() not in ['plugins', '.', 'src']]
                if not tags:
                    tags = []

                plugin_entry = {
                    "id": plugin_name.lower().replace(" ", "-"),
                    "name": plugin_name,
                    "description": description,
                    "authors": authors_parsed if authors_parsed else [], # As a list, there may be multiple
                    "tags": sorted(list(set(tags))), # Alphabetical, clean list
                    "url": github_url
                }
                
                plugin_list.append(plugin_entry)
                print(f"Added: {plugin_name} (Tags: {tags})")

    # Output JSON
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(
                plugin_list,
                f,
                ensure_ascii=False,
                indent=2,
                sort_keys=False
            )
        print(f"\nSuccess! Found {len(plugin_list)} plugins. Saved to '{OUTPUT_FILE}'.")
    except Exception as e:
        print(f"\nError writing JSON output file: {e}")

if __name__ == "__main__":
    generate_plugin_list()
