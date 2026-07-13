import os
import re

bad = []
book_now_to_book = 0
for name in os.listdir("."):
    if not name.endswith(".html"):
        continue
    with open(name, encoding="utf-8", errors="replace") as handle:
        content = handle.read()
    for match in re.finditer(r"<a[^>]+>", content, re.I):
        tag = match.group(0)
        after = content[match.end() : match.end() + 300]
        looks = bool(
            re.search(
                r"book-now|>\s*BOOK NOW|bd-nav-book-now|explore-cta-btn|Book Your Stay",
                after,
                re.I,
            )
            or ("book-now" in tag)
        )
        if not looks:
            continue
        href_match = re.search(r'href=["\']([^"\']+)["\']', tag)
        if not href_match:
            continue
        href = href_match.group(1)
        if href.startswith("book.html") or href == "#noya-booking":
            if "book-now" in tag or "book-now" in after or "BOOK NOW" in after or "explore-cta-btn" in after or "Book Your Stay" in after:
                book_now_to_book += 1
            continue
        if "booking-details" in href:
            bad.append(f"{name}: {href}")

print("Book Now still to booking-details:", bad if bad else "none")
print("Book Now-ish to book.html/#noya:", book_now_to_book)
