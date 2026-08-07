import json
import sys
import re
from deep_translator import GoogleTranslator

sys.stdout.reconfigure(encoding='utf-8')

t = GoogleTranslator(source='en', target='sw')

def translate_markdown(text):
    if not text or not text.strip():
        return text

    # Protect markdown links: [Link Text](/url)
    links = []
    def mask_link(m):
        link_text = m.group(1)
        url = m.group(2)
        idx = len(links)
        links.append((link_text, url))
        return f"__LINKTOKEN{idx}__"

    masked_text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', mask_link, text)

    # Process line by line or paragraph by paragraph
    paragraphs = masked_text.split('\n\n')
    translated_paragraphs = []

    for p in paragraphs:
        if not p.strip():
            translated_paragraphs.append(p)
            continue
        
        # Handle line prefixes like #, ##, ###, >, -, *, 1. etc.
        lines = p.split('\n')
        trans_lines = []
        for line in lines:
            if not line.strip():
                trans_lines.append(line)
                continue
            
            prefix = ""
            content_to_trans = line

            if line.startswith('#'):
                m = re.match(r'^(#+\s*)(.*)', line)
                if m:
                    prefix = m.group(1)
                    content_to_trans = m.group(2)
            elif line.startswith('>'):
                m = re.match(r'^(>\s*)(.*)', line)
                if m:
                    prefix = m.group(1)
                    content_to_trans = m.group(2)
            elif re.match(r'^(\s*[\-\*\+]\s+)', line):
                m = re.match(r'^(\s*[\-\*\+]\s+)(.*)', line)
                if m:
                    prefix = m.group(1)
                    content_to_trans = m.group(2)
            elif re.match(r'^(\s*\d+\.\s+)', line):
                m = re.match(r'^(\s*\d+\.\s+)(.*)', line)
                if m:
                    prefix = m.group(1)
                    content_to_trans = m.group(2)
            
            if content_to_trans.strip():
                # translate content_to_trans
                try:
                    translated = t.translate(content_to_trans)
                except Exception as e:
                    print(f"Error: {e}, falling back to original line", file=sys.stderr)
                    translated = content_to_trans
                trans_lines.append(prefix + translated)
            else:
                trans_lines.append(line)

        translated_paragraphs.append('\n'.join(trans_lines))

    result = '\n\n'.join(translated_paragraphs)

    # Restore links
    for idx, (lt, url) in enumerate(links):
        try:
            trans_lt = t.translate(lt) if lt.strip() else lt
        except Exception:
            trans_lt = lt
        # regex search for link token or literal replace
        result = result.replace(f"__LINKTOKEN{idx}__", f"[{trans_lt}]({url})")
        # handles space added by translator around token
        result = re.sub(r'__\s*LINKTOKEN\s*' + str(idx) + r'\s*__', f"[{trans_lt}]({url})", result)

    return result

sample = """## A Mathematician’s Poetry — The Attitude Towards a Finite Life

When you hear the name Omar Khayyam (1048–1131), what is the first image that comes to your mind? For many across the globe, he is immediately recognized as the author of the *Rubaiyat*, one of the most widely translated and fiercely beloved collections of short poems in the history of world literature.

> "Into this Universe, and why not knowing,
> Nor whence, like Water willy-nilly flowing;"

Check out [Epicurus](/giant/epicurus) and [Marcus Aurelius](/giant/marcus-aurelius) for more."""

print("Result:\n", translate_markdown(sample))
