import os
import sys
import json
import shutil

if len(sys.argv) < 3:
    print("Usage: python update_progress.py <source_path> <slug>")
    sys.exit(1)

src = sys.argv[1]
slug = sys.argv[2]
dest = f"public/images/giants/{slug}.jpg"

# Create destination directory if it doesn't exist
os.makedirs(os.path.dirname(dest), exist_ok=True)

# Copy file
shutil.copy(src, dest)
print(f"Copied {src} to {dest}")

# Update progress JSON
progress_path = "scratch/image-generation-progress.json"
progress = []
if os.path.exists(progress_path):
    try:
        with open(progress_path, "r", encoding="utf-8") as f:
            progress = json.load(f)
    except Exception as e:
        print(f"Error reading progress: {e}")

if slug not in progress:
    progress.append(slug)

with open(progress_path, "w", encoding="utf-8") as f:
    json.dump(progress, f, indent=2, ensure_ascii=False)

print(f"Updated progress with {slug}")
