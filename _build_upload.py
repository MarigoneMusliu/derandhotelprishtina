"""Build zip files for uploading the website to Hostinger.

Run:  python _build_upload.py

Creates, in Desktop\\derandhotel_upload:
  derand-code.zip     all pages, css, js, api, fonts (small, upload when code changed)
  derand-images.zip   the img folder (large, upload only when images changed)
  derand-changes.zip  only files changed since the last time this script ran
"""
import hashlib
import json
import os
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(ROOT), "derandhotel_upload")
STATE = os.path.join(OUT, ".last-upload-hashes.json")

SKIP_DIRS = {".git", "__pycache__", "node_modules"}
SKIP_FILES = {".gitignore", "_redirects", "netlify.toml", "vercel.json", "desktop.ini"}
# Live server state that must never be overwritten by local copies.
SKIP_PATHS = {"api/_storage", "api/.otello-token.json", "api/.otello-sent.json"}


def site_files():
    for dp, dn, fn in os.walk(ROOT):
        rel_dir = os.path.relpath(dp, ROOT).replace("\\", "/")
        rel_dir = "" if rel_dir == "." else rel_dir + "/"
        dn[:] = [d for d in dn if d not in SKIP_DIRS and not (rel_dir + d) in SKIP_PATHS
                 and not (rel_dir == "" and d.startswith("_"))]
        for f in fn:
            rel = rel_dir + f
            if f in SKIP_FILES or rel in SKIP_PATHS or (rel_dir == "" and f.startswith("_")):
                continue
            if f.endswith((".py", ".pyc", ".ps1")):
                continue
            yield rel


def file_hash(rel):
    h = hashlib.md5()
    with open(os.path.join(ROOT, rel), "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def write_zip(name, files):
    path = os.path.join(OUT, name)
    if os.path.exists(path):
        os.remove(path)
    if not files:
        return None
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for rel in sorted(files):
            z.write(os.path.join(ROOT, rel), rel)
    return path


def main():
    os.makedirs(OUT, exist_ok=True)
    files = list(site_files())
    images = [f for f in files if f.startswith("img/")]
    code = [f for f in files if not f.startswith("img/")]

    hashes = {f: file_hash(f) for f in files}
    old = json.load(open(STATE)) if os.path.exists(STATE) else {}
    changed = [f for f in files if old.get(f) != hashes[f]]

    for name, group in (("derand-code.zip", code), ("derand-images.zip", images), ("derand-changes.zip", changed)):
        p = write_zip(name, group)
        if p:
            print(f"{name:20} {len(group):5} files  {os.path.getsize(p) / 1e6:7.1f} MB")
        else:
            print(f"{name:20}     0 files  (nothing to upload)")

    json.dump(hashes, open(STATE, "w"), indent=0)
    print("\nZips are in:", OUT)


if __name__ == "__main__":
    main()
