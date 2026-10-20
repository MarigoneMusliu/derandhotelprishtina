"""Local preview with the same page names as the live site."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse
import os

ROUTES = {
    "home": "index.html",
    "book": "book.html",
    "booking-details": "booking-details.html",
    "booking-extras": "booking-extras.html",
    "career-apply": "career-apply.html",
    "career-architect": "career-architect.html",
    "career-bellboy": "career-bellboy.html",
    "career-chief-steward": "career-chief-steward.html",
    "career-finance": "career-finance.html",
    "career-housekeeping": "career-housekeeping.html",
    "career-housekeeping-manager": "career-housekeeping-manager.html",
    "career-it-specialist": "career-it-specialist.html",
    "career-procurement-logistics": "career-procurement-logistics.html",
    "career-receptionist": "career-receptionist.html",
    "career-sales": "career-sales.html",
    "career-security": "career-security.html",
    "career-security-manager": "career-security-manager.html",
    "career-social-media": "career-social-media.html",
    "career-uiux": "career-uiux.html",
    "careers": "careers.html",
    "contact": "contact.html",
    "deluxe-360": "deluxe-360.html",
    "deluxe-bathroom-360": "deluxe-bathroom-360.html",
    "deluxe-double": "deluxe-double.html",
    "derandtickets": "derandtickets.html",
    "explore": "explore.html",
    "explore-pristina": "explore-pristina.html",
    "explorederand": "explorederand.html",
    "concierge": "extra.html",
    "extra": "extra.html",
    "faqs": "faqs.html",
    "guestapp": "guestapp.html",
    "junior": "junior.html",
    "junior-360": "junior-360.html",
    "junior-bathroom": "junior-bathroom.html",
    "junior-bathroom-360": "junior-bathroom-360.html",
    "minibar": "minibar.html",
    "noya": "noya.html",
    "omma": "omma.html",
    "conferencehall": "orion.html",
    "orion": "orion.html",
    "our-location": "our-location.html",
    "parfumes": "perfumes.html",
    "perfumes": "perfumes.html",
    "premium-360": "premium-360.html",
    "premium-bathroom-360": "premium-bathroom-360.html",
    "premium-double": "premium-double.html",
    "privacy-policy": "privacy-policy.html",
    "privacypolicy": "privacypolicy.html",
    "rinu": "rinu.html",
    "rinuform": "rinuForm.html",
    "rooms": "rooms.html",
    "sunnyhill": "sunnyhill.html",
    "superior-double": "superior-double.html",
    "superior-double-360": "superior-double-360.html",
    "superior-double-bathroom-360": "superior-double-bathroom-360.html",
    "superior-twin": "superior-twin.html",
    "superior-twin-360": "superior-twin-360.html",
    "superior-twin-bathroom-360": "superior-twin-bathroom-360.html",
    "termsofservices": "termsofservices.html",
    "ticketsadmin": "ticketsadmin.html",
}


class Handler(SimpleHTTPRequestHandler):
    def _rewrite(self):
        parsed = urlparse(self.path)
        raw = parsed.path.lstrip("/")
        query = ("?" + parsed.query) if parsed.query else ""
        if raw == "" or raw == "/":
            self.path = "/index.html" + query
            return
        if os.path.isfile(raw):
            return
        key = raw.lower().rstrip("/")
        target = ROUTES.get(key)
        if target and os.path.isfile(target):
            self.path = "/" + target + query

    def do_GET(self):
        self._rewrite()
        return super().do_GET()

    def do_HEAD(self):
        self._rewrite()
        return super().do_HEAD()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8765), Handler)
    print("ready http://127.0.0.1:8765/Home", flush=True)
    server.serve_forever()
