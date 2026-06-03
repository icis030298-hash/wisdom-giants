import os
import sys
import glob
import json
import shutil

if len(sys.argv) < 2:
    print("Usage: python update_progress_auto.py <slug1> <slug2> ...")
    sys.exit(1)

slugs = sys.argv[1:]
brain_dir = r"C:\Users\user\.gemini\antigravity\brain\61ff717b-d8a2-4086-a860-0b71a56cf8b2"
progress_path = "scratch/image-generation-progress.json"

# Load current progress
progress = []
if os.path.exists(progress_path):
    try:
        with open(progress_path, "r", encoding="utf-8") as f:
            progress = json.load(f)
    except Exception as e:
        print(f"Error reading progress: {e}")

for slug in slugs:
    # Map slug with hyphens to underscore for image name
    img_prefix = slug.replace("-", "_")
    search_pattern = os.path.join(brain_dir, f"{img_prefix}_*.png")
    matching_files = glob.glob(search_pattern)
    
    if not matching_files:
        # Also try searching without the pattern suffix, just in case
        search_pattern_fallback = os.path.join(brain_dir, f"{img_prefix}.png")
        if os.path.exists(search_pattern_fallback):
            matching_files = [search_pattern_fallback]
        else:
            print(f"Error: No generated image found for {slug} (pattern: {img_prefix}_*.png)")
            continue
            
    # Find the newest matching file
    newest_file = max(matching_files, key=os.path.getmtime)
    
    dest = f"public/images/giants/{slug}.jpg"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    
    try:
        shutil.copy(newest_file, dest)
        print(f"Copied {newest_file} to {dest}")
        if slug not in progress:
            progress.append(slug)
    except Exception as e:
        print(f"Error copying {newest_file} to {dest}: {e}")

# Save updated progress
with open(progress_path, "w", encoding="utf-8") as f:
    json.dump(progress, f, indent=2, ensure_ascii=False)

print("Updated progress.")
