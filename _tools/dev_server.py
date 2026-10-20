"""Local preview server that mimics the clean-URL rules in .htaccess.
Usage (from the site root): python _tools/dev_server.py [port]"""
import glob
import http.server
import os
import sys
from urllib.parse import urlsplit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)


RENAMED = {"index": "Home", "extra": "Concierge", "perfumes": "Parfumes", "explorederand": "ExploreDerand", "orion": "ConferenceHall", "ticketsadmin": "TicketsAdmin"}


def clean(stem):
    if stem in RENAMED:
        return RENAMED[stem]
    return "-".join(s[:1].upper() + s[1:] for s in stem.split("-"))


PAGES = {}
for f in glob.glob("*.html"):
    stem = os.path.splitext(f)[0]
    name = clean(stem)
    title = "-".join(s[:1].upper() + s[1:] for s in stem.split("-"))
    for alias in (stem, stem + ".html", name, title):
        PAGES[alias.lower()] = (name, f)

for name in ("BookNowSuperiorDoubleRoom", "BookNowSuperiorTwinRoom", "BookNowPremiumDoubleRoom",
             "BookNowDeluxeDoubleRoom", "BookNowJuniorSuite"):
    PAGES[name.lower()] = (name, "book.html")


class Handler(http.server.SimpleHTTPRequestHandler):
    def _route(self):
        parts = urlsplit(self.path)
        key = parts.path.strip("/").lower()
        if not key or "/" in key or key not in PAGES:
            return False
        name, filename = PAGES[key]
        if parts.path != "/" + name:
            self.send_response(301)
            self.send_header("Location", "/" + name + ("?" + parts.query if parts.query else ""))
            self.end_headers()
            return True
        self.path = "/" + filename + ("?" + parts.query if parts.query else "")
        return False

    def do_GET(self):
        if not self._route():
            super().do_GET()

    def do_HEAD(self):
        if not self._route():
            super().do_HEAD()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
