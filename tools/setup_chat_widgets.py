"""Disable Tidio and enable Chatbase across all HTML pages."""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TIDIO_TAG = '    <script src="js/tidio-left-position.js?v=2" defer></script>'
CHATBASE_BLOCK = """    <!-- Tidio chat widget (disabled — set TIDIO_CHAT_ENABLED = true in js/site-onboarding-sequence.js to re-enable)
    <script src="js/tidio-left-position.js?v=2" defer></script>
    -->
    <script src="js/chatbase-widget.js?v=2" defer></script>"""

TIDIO_INLINE = re.compile(
    r'    <script>\s*window\.addEventListener\("load", function \(\) \{\s*'
    r'window\.setTimeout\(function \(\) \{\s*'
    r'if \(window\.__derandUseOnboardingSequence\) return;\s*'
    r'if \(typeof window\.derandLoadTidioChat === "function"\) \{\s*'
    r'window\.derandLoadTidioChat\(\);\s*return;\s*\}\s*'
    r'if \(window\.__derandTidioLoaded\) return;\s*'
    r'window\.__derandTidioLoaded = true;\s*'
    r'try \{\s*'
    r'var s = document\.createElement\("script"\);\s*'
    r's\.src = "https://code\.tidio\.co/bnuc9odotvfbltnpijihm3enhpjj0ovy\.js";\s*'
    r's\.defer = true;\s*'
    r'document\.body\.appendChild\(s\);\s*'
    r'\} catch \(e\) \{\}\s*'
    r'\}, 8000\)\s*'
    r'\}\);\s*'
    r'</script>',
    re.MULTILINE,
)

INLINE_REPLACEMENT = """    <!-- Tidio inline fallback (disabled)
    <script>
      window.addEventListener("load", function () {
        window.setTimeout(function () {
          if (window.__derandUseOnboardingSequence) return;
          if (typeof window.derandLoadTidioChat === "function") {
            window.derandLoadTidioChat();
            return;
          }
          if (window.__derandTidioLoaded) return;
          window.__derandTidioLoaded = true;
          try {
            var s = document.createElement("script");
            s.src = "https://code.tidio.co/bnuc9odotvfbltnpijihm3enhpjj0ovy.js";
            s.defer = true;
            document.body.appendChild(s);
          } catch (e) {}
        }, 8000)
      });
    </script>
    -->"""


def patch_html(path: str) -> list[str]:
    changes = []
    with open(path, "r", encoding="utf-8", errors="replace") as handle:
        content = handle.read()
    original = content

    if TIDIO_TAG in content and "chatbase-widget.js" not in content:
        content = content.replace(TIDIO_TAG, CHATBASE_BLOCK)
        changes.append("tidio->chatbase")

    if "Tidio inline fallback (disabled)" not in content:
        content, count = TIDIO_INLINE.subn(INLINE_REPLACEMENT, content)
        if count:
            changes.append("inline-tidio-commented")

    if "site-onboarding-sequence.js?v=8" in content:
        content = content.replace(
            "site-onboarding-sequence.js?v=8",
            "site-onboarding-sequence.js?v=9",
        )
        changes.append("onboarding-v9")

    if content != original:
        with open(path, "w", encoding="utf-8", newline="") as handle:
            handle.write(content)
    return changes


def main() -> None:
    patched = 0
    for dirpath, _, files in os.walk(ROOT):
        if "node_modules" in dirpath or "__pycache__" in dirpath:
            continue
        for name in files:
            if not name.endswith(".html"):
                continue
            path = os.path.join(dirpath, name)
            changes = patch_html(path)
            if changes:
                patched += 1
                print(f"{os.path.relpath(path, ROOT)}: {', '.join(changes)}")
    print(f"Patched {patched} file(s).")


if __name__ == "__main__":
    main()
