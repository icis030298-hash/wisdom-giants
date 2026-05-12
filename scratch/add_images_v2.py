
import re

with open('src/data/giants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Ensure interface has imageUrl
if 'imageUrl: string;' not in content:
    content = content.replace('  persona: string;', '  persona: string;\n  imageUrl: string;')

# Function to add imageUrl to each object
def add_image_to_object(obj_text):
    slug_match = re.search(r"slug:\s*['\"]([^'\"]+)['\"]", obj_text)
    if slug_match:
        slug = slug_match.group(1)
        if 'imageUrl:' not in obj_text:
            # Add before persona
            obj_text = re.sub(r"(persona:\s*)", f"imageUrl: '/images/giants/{slug}.jpg',\n    \\1", obj_text)
    return obj_text

# Find all objects in giantsData array
# This is a bit complex due to nested objects (lessons), so we'll look for blocks starting with { and ending with },
# but we need to be careful. Since the giants are top-level items in the array:
parts = re.split(r'(?<=^  \{)', content, flags=re.MULTILINE)
new_parts = [parts[0]]
for part in parts[1:]:
    new_parts.append(add_image_to_object(part))

new_content = "".join(new_parts)

with open('src/data/giants.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
