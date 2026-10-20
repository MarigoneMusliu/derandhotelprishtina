"""Add/replace the ?v= cache-buster on css/style.css links in every HTML page."""
import collections
import glob
import re
import sys

VERSION = sys.argv[1] if len(sys.argv) > 1 else None
pattern = re.compile(r"css/style\.css(\?v=[^\"' >]*)?")

counts = collections.Counter()
changed = 0
for path in sorted(glob.glob("*.html")):
    with open(path, encoding="utf-8", newline="") as fh:
        text = fh.read()
    counts.update(m.group(0) for m in pattern.finditer(text))
    if VERSION:
        new = pattern.sub("css/style.css?v=" + VERSION, text)
        if new != text:
            with open(path, "w", encoding="utf-8", newline="") as fh:
                fh.write(new)
            changed += 1

print(dict(counts))
if VERSION:
    print("pages updated:", changed)
