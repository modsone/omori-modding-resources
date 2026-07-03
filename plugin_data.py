import os
import yaml

# Configurations
REPOS_ROOT = "."  # Scans the current folder and all subfolders
OUTPUT_FILE = "plugins.yaml"
BASE_GITHUB_URL = "https://github.com/modsone/omori-modding-resources/"

def generate_plugin_list():
    plugin_list = []
    print("Building plugin database YAML from folder structure...")

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
                
                # Break up parent folder names as tags
                # Example: "plugins/battle/skills/heal.js" -> ["battle", "skills"]
                path_parts = rel_path.split('/')[:-1]
                tags = [part.lower() for part in path_parts if part.lower() not in ['plugins', '.', 'src']]
                if not tags:
                    tags = []

                plugin_entry = {
                    "id": plugin_name.lower().replace(" ", "-"),
                    "name": plugin_name,
                    "authors": ["Contributor"], # As a list, there may be multiple
                    "tags": sorted(list(set(tags))), # Alphabetical, clean list
                    "url": github_url
                }
                
                plugin_list.append(plugin_entry)
                print(f"Added: {plugin_name} (Tags: {tags})")

    # Output YAML
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            yaml.dump(
                plugin_list, 
                f, 
                default_flow_style=False, # Enforces block format (one item per line)
                sort_keys=False,          # Keeps IDs/Names at the top of each item block
                allow_unicode=True,       # Preserves any special developer characters safely
                width=2147483647
            )
        print(f"\nSuccess! Found {len(plugin_list)} plugins. Saved to '{OUTPUT_FILE}'.")
    except Exception as e:
        print(f"\nError writing YAML output file: {e}")

if __name__ == "__main__":
    generate_plugin_list()
