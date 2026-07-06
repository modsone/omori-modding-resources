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
    
    
def load_existing_plugins():
    """Load existing plugins.json if it exists."""
    if not os.path.exists(OUTPUT_FILE):
        return {}
    
    try:
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            plugin_list = json.load(f)
            # Convert list to dict indexed by plugin ID for easier lookup
            return {p['id']: p for p in plugin_list}
    except Exception as e:
        print(f"Warning: Could not load existing {OUTPUT_FILE}: {e}")
        return {}


def generate_plugin_list():
    plugin_list = []
    print("Building plugin database JSON from folder structure...")
    
    # Load existing plugins to preserve manual edits
    existing_plugins = load_existing_plugins()
    print(f"Loaded {len(existing_plugins)} existing plugins from {OUTPUT_FILE}.")

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
                
                plugin_id = plugin_name.lower().replace(" ", "-")
                existing_entry = existing_plugins.get(plugin_id)
                
                # Check if this plugin should be auto-updated
                auto_update = True  # Default for new entries
                if existing_entry:
                    auto_update = existing_entry.get('auto-update', True)  # Default True for old entries
                    if not auto_update:
                        # Skip updating this entry, but keep it in the list
                        plugin_list.append(existing_entry)
                        print(f"Skipped: {plugin_name} (auto-update = false)")
                        continue
                
                # Parse plugin header for description and author
                description, authors = get_desc(full_path)

                # Break up parent folder names as tags
                # Example: "plugins/battle/skills/heal.js" -> ["battle", "skills"]
                path_parts = rel_path.split('/')[:-1]
                tags = [parse_tag(part) for part in path_parts if part.lower() not in ['plugins', '.', 'src']]
                if not tags:
                    tags = []

                plugin_entry = {
                    "id": plugin_id,
                    "name": plugin_name,
                    "description": description,
                    "authors": authors,
                    "tags": sorted(list(set(tags))), # Alphabetical, clean list
                    "url": github_url,
                    "auto-update": auto_update
                }
                
                plugin_list.append(plugin_entry)
                status = "Updated" if existing_entry else "Added"
                print(f"{status}: {plugin_name} (auto-update = {auto_update})")

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

def get_desc(full_path):
    description = ""
    authors = [] # As a list, there may be multiple
    try:
        with open(full_path, 'r', encoding='utf-8', errors='ignore') as jf:
            content = jf.read()
        # Use re.DOTALL to let '.' match newlines
        # Use a lookahead '(?=\s*@|\s*\*\/)' to stop at the next tag or end of comment block
        m_desc = re.search(r'@plugindesc\s+(.*?)(?=\s*@|\s*\*\/)', content, re.DOTALL)

        if m_desc:
            raw_desc = m_desc.group(1)
            
            # Clean up multi-line formatting (removes leading asterisks on new lines)
            cleaned_lines = [line.strip().lstrip('*').strip() for line in raw_desc.split('\n')]
            description = " ".join(filter(None, cleaned_lines))
        m_author = re.search(r'@author\s+(.+)', content)
        if m_author:
            raw_auth = m_author.group(1).strip().strip('*/ ').strip()
            authors = [a.strip() for a in re.split(r',|&| and ', raw_auth) if a.strip()]
    except Exception:
        pass
    
    return description, authors

if __name__ == "__main__":
    generate_plugin_list()
