"""Set the ?v= cache-buster for the given js files in every HTML page.
Usage: python _tools/bump_js_version.py VERSION js/a.js js/b.js ..."""
import glob
import re
import sys

version, files = sys.argv[1], sys.argv[2:]
pattern = re.compile(r"(%s)(\?v=[^\"' >]*)?(?=[\"' >])" % "|".join(re.escape(f) for f in files))

changed = 0
for path in sorted(glob.glob("*.html")):
    with open(path, encoding="utf-8", newline="") as fh:
        text = fh.read()
    new = pattern.sub(lambda m: m.group(1) + "?v=" + version, text)
    if new != text:
        with open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(new)
        changed += 1
print("pages updated:", changed)
