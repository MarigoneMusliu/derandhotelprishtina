"""Point the Book Now links on each room page to its room-specific booking URL."""
ROOM_PAGES = {
    "superior-double.html": "/BookNowSuperiorDoubleRoom",
    "superior-twin.html": "/BookNowSuperiorTwinRoom",
    "premium-double.html": "/BookNowPremiumDoubleRoom",
    "deluxe-double.html": "/BookNowDeluxeDoubleRoom",
    "junior.html": "/BookNowJuniorSuite",
}

for page, url in ROOM_PAGES.items():
    with open(page, encoding="utf-8", newline="") as fh:
        text = fh.read()
    count = text.count('href="/Book"')
    text = text.replace('href="/Book"', 'href="%s"' % url)
    with open(page, "w", encoding="utf-8", newline="") as fh:
        fh.write(text)
    print(page, count)
