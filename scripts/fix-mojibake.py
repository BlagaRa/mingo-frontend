"""Fix UTF-8 text that was misread as cp1252 and re-saved as UTF-8 (double encoding)."""
from pathlib import Path

# Romanian + punctuation codepoints we care about
CHAR_CODES = [
    0x0103,  # a
    0x0102,  # A
    0x00E2,  # a
    0x00C2,  # A
    0x00EE,  # i
    0x00CE,  # I
    0x0219,  # s comma
    0x0218,  # S comma
    0x021B,  # t comma
    0x021A,  # T comma
    0x015F,  # s cedilla
    0x015E,  # S cedilla
    0x0163,  # t cedilla
    0x0162,  # T cedilla
    0x2014,  # em dash
    0x2013,  # en dash
    0x2026,  # ellipsis
    0x00B7,  # middle dot
]


def mojibake_utf8(ch: str) -> bytes:
    return ch.encode("utf-8").decode("cp1252").encode("utf-8")


pairs: list[tuple[bytes, bytes]] = []
for code in CHAR_CODES:
    ch = chr(code)
    try:
        pairs.append((mojibake_utf8(ch), ch.encode("utf-8")))
    except UnicodeDecodeError:
        pass

pairs.sort(key=lambda p: len(p[0]), reverse=True)
seen: set[bytes] = set()
unique: list[tuple[bytes, bytes]] = []
for bad, good in pairs:
    if bad in seen:
        continue
    seen.add(bad)
    unique.append((bad, good))

for bad, good in unique:
    print(bad.hex(), "->", repr(good.decode("utf-8")))

root = Path(__file__).resolve().parents[1]
fixed_files = 0
still_bad: list[str] = []
bad_markers = [mojibake_utf8(chr(c)) for c in (0x0103, 0x00EE, 0x00CE, 0x0219, 0x021B)]

for path in sorted((root / "src").rglob("*")):
    if not path.is_file() or path.suffix not in {
        ".ts",
        ".tsx",
        ".css",
        ".md",
        ".json",
        ".mjs",
        ".js",
    }:
        continue
    raw = path.read_bytes()
    had_bom = raw.startswith(b"\xef\xbb\xbf")
    if had_bom:
        raw = raw[3:]
    out = raw
    for bad, good in unique:
        out = out.replace(bad, good)
    out = out.replace("\ufffd".encode("utf-8"), b"")
    if out != raw or had_bom:
        path.write_bytes(out)
        fixed_files += 1
    check = path.read_bytes()
    if any(m in check for m in bad_markers):
        still_bad.append(str(path.relative_to(root)))

print("fixed_files", fixed_files)
print("still_bad", len(still_bad))
print("\n".join(still_bad[:40]))

for rel in [
    "src/components/layout/site-header.tsx",
    "src/lib/mock/booking-display.ts",
    "src/components/crm/crm-pagination.tsx",
]:
    text = (root / rel).read_text(encoding="utf-8")
    print("---", rel)
    for line in text.splitlines():
        if any(
            k in line.lower()
            for k in ("rezerv", "ncasat", "nainte", "napoi", "deschis", "nregistreaz")
        ):
            print(line.strip()[:140])
