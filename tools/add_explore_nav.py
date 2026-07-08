"""Verify and fix Activities > Explore Prishtina on every HTML page."""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ITEM = """                        <li>
                          <a href="explore.html" data-i18n="nav-activity-explore"
                            >Explore Prishtina</a
                          >
                        </li>
"""


def fix_file(content: str) -> str | None:
    # Remove any Explore items floating outside activities dropdowns
    content = re.sub(
        r'\n\s*<li>\s*<a href="explore\.html" data-i18n="nav-activity-explore"\s*>'
        r'Explore Prishtina</a\s*>\s*</li>(?=\s*<li(?:\s+class="has-dropdown")?>)',
        "",
        content,
        flags=re.I,
    )

    # Match Activities dropdown more loosely (anchor may wrap lines)
    pattern = re.compile(
        r'(data-i18n="nav-activities"[\s\S]*?<ul class="dropdown">)([\s\S]*?)(</ul>)',
        re.I,
    )

    changed = False

    def repl(m: re.Match) -> str:
        nonlocal changed
        head, body, tail = m.group(1), m.group(2), m.group(3)
        # Drop any explore already in wrong place within body duplicates
        body_clean = body
        if "nav-activity-explore" in body_clean:
            return m.group(0)
        body_clean = body_clean.rstrip() + "\n" + ITEM
        changed = True
        return head + body_clean + "                      " + tail

    new_content = pattern.sub(repl, content)
    if not changed and "nav-activity-explore" not in new_content:
        return None
    if new_content == content and "nav-activity-explore" in content:
        # Already fine
        return content
    return new_content


def main() -> None:
    ok = 0
    fixed = 0
    fail = []
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
            new_content = fix_file(content)
            if new_content is None:
                fail.append(name)
                continue
            # Validate explore is inside activities dropdown
            m = re.search(
                r'data-i18n="nav-activities"[\s\S]*?<ul class="dropdown">([\s\S]*?)</ul>',
                new_content,
                re.I,
            )
            if not m or "nav-activity-explore" not in m.group(1):
                fail.append(name + " (validation)")
                continue
            if new_content != content:
                with open(path, "w", encoding="utf-8", newline="") as h:
                    h.write(new_content)
                fixed += 1
                print("FIXED", name)
            else:
                ok += 1
    print(f"Already OK: {ok}, Fixed: {fixed}")
    if fail:
        print("FAIL:", ", ".join(fail))


if __name__ == "__main__":
    main()
