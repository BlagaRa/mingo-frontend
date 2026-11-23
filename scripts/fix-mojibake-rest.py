from pathlib import Path

root = Path(__file__).resolve().parents[1]


def show(path: Path, needle: str) -> None:
    text = path.read_text(encoding="utf-8")
    i = text.find(needle)
    print(path.name, "find", repr(needle), "->", repr(text[i : i + 48]) if i >= 0 else "MISSING")


show(root / "src/lib/mock/owner-stats.ts", "Fixed demo")
show(root / "src/components/ui/action-menu.tsx", "aria-hidden")
show(root / "src/components/pitches/photo-carousel.tsx", "button")

# Replace known leftover mojibake sequences.
replacements = [
    ("\u00e2\u20ac\u0153", '"'),  # â€œ
    ("\u00e2\u20ac\u009d", '"'),  # â€
    ("\u00e2\u20ac\u00b9", "\u2039"),  # â€¹ -> ‹
    ("\u00e2\u20ac\u00ba", "\u203a"),  # â€º -> ›
    ("\u00e2\u2039\u00af", "\u22ee"),  # â‹¯ -> ⋮
    ("\u00e2\u2039\u00ae", "\u22ee"),  # â‹® -> ⋮ (test name)
]

files = [
    root / "src/lib/mock/owner-stats.ts",
    root / "src/components/ui/action-menu.tsx",
    root / "src/components/ui/action-menu.test.tsx",
    root / "src/components/pitches/photo-carousel.tsx",
    root / "src/components/pitches/pitch-week-hours.tsx",
]

for path in files:
    text = path.read_text(encoding="utf-8")
    orig = text
    for bad, good in replacements:
        text = text.replace(bad, good)
    if text != orig:
        path.write_bytes(text.encode("utf-8"))
        print("fixed", path.relative_to(root))
    else:
        print("unchanged", path.relative_to(root))
        # dump suspicious codepoints near â
        if "\u00e2" in text:
            i = text.index("\u00e2")
            print("  still", [hex(ord(c)) for c in text[i : i + 6]])
