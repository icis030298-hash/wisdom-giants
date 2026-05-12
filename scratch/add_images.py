
import re

with open('src/data/giants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imageUrl to interface
content = content.replace('  persona: string;', '  persona: string;\n  imageUrl: string;')

# Add imageUrl to objects based on slug
def add_image_url(match):
    body = match.group(0)
    slug_match = re.search(r"slug:\s*['\"]([^'\"]+)['\"]", body)
    if slug_match:
        slug = slug_match.group(1)
        # Check if imageUrl already exists
        if 'imageUrl:' not in body:
            # Insert before persona or at the end
            if 'persona:' in body:
                body = body.replace('persona:', f"imageUrl: '/images/giants/{slug}.jpg',\n    persona:")
            else:
                body = body.replace('}', f"  imageUrl: '/images/giants/{slug}.jpg'\n  }}")
    return body

# Pattern for objects in giantsData
content = re.sub(r'\{[^{}]*slug:[^{}]*\}', add_image_url, content, flags=re.DOTALL)

with open('src/data/giants.ts', 'w', encoding='utf-8') as f:
    f.write(content)
