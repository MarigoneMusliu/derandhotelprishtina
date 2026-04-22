from pathlib import Path
import re

root = Path(r"C:/Users/Plus Computers/Desktop/derandhotel")
html = (root / "index.html").read_text(encoding="utf-8", errors="ignore")

refs = set()
for m in re.finditer(r'src="([^"]+)"', html, flags=re.IGNORECASE):
    refs.add(m.group(1))
for m in re.finditer(r'data-setbg="([^"]+)"', html, flags=re.IGNORECASE):
    refs.add(m.group(1))

print("INDEX_ASSETS")
for ref in sorted(refs):
    if ref.startswith("http"):
        continue
    p = root / ref
    if p.exists() and p.is_file():
        print(f"{ref}\t{p.stat().st_size}")
    else:
        print(f"{ref}\tMISSING")
