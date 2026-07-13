"""Point all Book Now CTAs to book.html."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if "node_modules" in path.parts or "__pycache__" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        original = text
        text = text.replace('href="booking-details.html"', 'href="book.html"')
        text = text.replace("href='booking-details.html'", "href='book.html'")
        text = text.replace('href="/booking-details"', 'href="book.html"')
        if text != original:
            path.write_text(text, encoding="utf-8", newline="\n")
            changed.append(path.name)
    print(f"Updated {len(changed)} files")
    for name in changed:
        print(" ", name)


if __name__ == "__main__":
    main()
