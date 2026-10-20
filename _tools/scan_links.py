import re, glob, collections

c = collections.Counter()
per = {}
for f in sorted(glob.glob("*.html")):
    s = open(f, encoding="utf-8", errors="replace").read()
    per[f] = len(re.findall(r"\.html", s))
    for h in re.findall(r'href="([^"#?]*)', s):
        if h.startswith(("http", "mailto", "tel", "css/", "js/", "img/", "fonts/", "data:", "javascript")):
            continue
        if h.endswith((".css", ".js", ".png", ".jpg", ".webp", ".ico", ".svg", ".xml", ".json", ".pdf")):
            continue
        c[h] += 1
print(per)
print(c.most_common(120))
