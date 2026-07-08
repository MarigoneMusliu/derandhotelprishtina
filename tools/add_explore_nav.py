"""Clean orphan Explore items and ensure one clean Activities entry."""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ITEM = """                        <li>
                          <a href="explore.html" data-i18n="nav-activity-explore"
                            >Explore Prishtina</a
                          >
                        </li>
"""

# Match the Explore list item block
EXPLORE_LI = re.compile(
    r'\s*<li>\s*<a href="explore\.html" data-i18n="nav-activity-explore"\s*>'
    r'Explore Prishtina</a\s*>\s*</li>\s*',
    re.I,
)


def fix(content: str) -> str:
    # Remove ALL explore activity items (outside comments we handle carefully)
    # Strategy: remove every explore nav item, then re-insert once into Activities.

    # Protect HTML comments by masking them
    comments = []

    def mask(m):
        comments.append(m.group(0))
        return f"<!--__COMMENT_{len(comments) - 1}__-->"

    masked = re.sub(r"<!--.*?-->", mask, content, flags=re.S)

    # Remove all Explore Prishtina nav items from live HTML
    cleaned = EXPLORE_LI.sub("\n", masked)

    # Insert into first Activities dropdown only
    pattern = re.compile(
        r'(data-i18n="nav-activities"[\s\S]*?<ul class="dropdown">)([\s\S]*?)(</ul>)',
        re.I,
    )

    def repl(m, _done=[False]):
        if _done[0]:
            return m.group(0)
        _done[0] = True
        head, body, tail = m.group(1), m.group(2), m.group(3)
        body = body.rstrip() + "\n" + ITEM
        return head + body + "                      " + tail

    if not pattern.search(cleaned):
        # restore and return unchanged signal
        for i, c in enumerate(comments):
            cleaned = cleaned.replace(f"<!--__COMMENT_{i}__-->", c)
        return content

    cleaned = pattern.sub(repl, cleaned)

    for i, c in enumerate(comments):
        cleaned = cleaned.replace(f"<!--__COMMENT_{i}__-->", c)
    return cleaned


def main():
    n = 0
    for dirpath, _, files in os.walk(ROOT):
        if "node_modules" in dirpath or "__pycache__" in dirpath:
            continue
        for name in files:
            if not name.endswith(".html"):
                continue
            path = os.path.join(dirpath, name)
            with open(path, "r", encoding="utf-8", errors="replace") as h:
                content = h.read()
            if 'data-i18n="nav-activities"' not in content and ">ACTIVITIES<" not in content:
                continue
            new = fix(content)
            m = re.search(
                r'data-i18n="nav-activities"[\s\S]*?<ul class="dropdown">([\s\S]*?)</ul>',
                new,
                re.I,
            )
            if not m or "nav-activity-explore" not in m.group(1):
                print("FAIL", name)
                continue
            # count explore items outside comments in activities vicinity is ok;
            # ensure orphan after concierge is gone
            live = re.sub(r"<!--.*?-->", "", new, flags=re.S)
            orphans = re.findall(
                r'href="extra\.html"[^>]*>Concierge</a></li>\s*<li>\s*'
                r'<a href="explore\.html" data-i18n="nav-activity-explore"',
                live,
                re.I,
            )
            if orphans:
                print("ORPHAN", name)
            if new != content:
                with open(path, "w", encoding="utf-8", newline="") as h:
                    h.write(new)
                n += 1
                print("OK", name)
            else:
                print("ALREADY", name)
    print("Updated", n)


if __name__ == "__main__":
    main()
