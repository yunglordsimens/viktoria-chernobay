#!/usr/bin/env bash
#
# Importuje zdjęcia z folderu archiwum do projektu portfolio.
# Skaluje do zadanej długości dłuższego boku i konwertuje na WebP.
# Nigdy nie powiększa zdjęć mniejszych niż limit.
#
#   ./scripts/import-photos.sh <folder-źródłowy> <kategoria/projekt> [maxpx] [jakość]
#
#   ./scripts/import-photos.sh ~/Downloads/2023_Apartment_Solec+ mieszkania/2023-solec
#
set -euo pipefail

SRC="${1:?Podaj folder źródłowy}"
PROJECT="${2:?Podaj kategoria/projekt, np. mieszkania/2023-solec}"
MAX="${3:-2400}"
QUALITY="${4:-80}"
CAP="${5:-600000}"   # górny limit wagi pliku w bajtach

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/public/images/portfolio/$PROJECT"

command -v cwebp >/dev/null || { echo "Brak cwebp — zainstaluj: brew install webp"; exit 1; }
[ -d "$SRC" ] || { echo "Nie znaleziono folderu: $SRC"; exit 1; }

mkdir -p "$DEST"
rm -f "$DEST"/*.webp

# Sortowanie naturalne po numerze VCT_xxxx, potem po nazwie.
# (bez `mapfile` — macOS ma bash 3.2)
FILES=()
while IFS= read -r line; do
  FILES+=("$line")
done < <(
  find "$SRC" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.tif' -o -iname '*.tiff' \) \
    ! -name '._*' -print0 |
  while IFS= read -r -d '' f; do
    n=$(basename "$f" | sed -n 's/.*[Vv][Cc][Tt]_0*\([0-9][0-9]*\).*/\1/p')
    printf '%08d\t%s\t%s\n' "${n:-99999999}" "$(basename "$f")" "$f"
  done | sort -t"$(printf '\t')" -k1,1n -k2,2 | cut -f3
)

[ ${#FILES[@]} -gt 0 ] || { echo "Brak zdjęć w $SRC"; exit 1; }

echo "→ $PROJECT  (${#FILES[@]} zdjęć, max ${MAX}px, q${QUALITY})"

i=0
for f in "${FILES[@]}"; do
  i=$((i + 1))
  out="$DEST/$(printf '%02d' "$i").webp"

  w=$(sips -g pixelWidth  "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$f" 2>/dev/null | awk '/pixelHeight/{print $2}')

  resize=()
  if [ "$w" -ge "$h" ]; then
    [ "$w" -gt "$MAX" ] && resize=(-resize "$MAX" 0)
  else
    [ "$h" -gt "$MAX" ] && resize=(-resize 0 "$MAX")
  fi

  # ${arr[@]+...} — bezpieczne rozwinięcie pustej tablicy przy `set -u` (bash 3.2)
  cwebp -quiet -q "$QUALITY" -m 6 -mt ${resize[@]+"${resize[@]}"} "$f" -o "$out"

  # Zdjęcia bogate w teksturę potrafią spuchnąć — dociskamy je do limitu.
  note=""
  bytes=$(stat -f%z "$out")
  if [ "$bytes" -gt "$CAP" ]; then
    cwebp -quiet -size "$CAP" -m 6 -mt ${resize[@]+"${resize[@]}"} "$f" -o "$out"
    bytes=$(stat -f%z "$out")
    note=" (dociśnięte)"
  fi

  nw=$(sips -g pixelWidth "$out" 2>/dev/null | awk '/pixelWidth/{print $2}')
  nh=$(sips -g pixelHeight "$out" 2>/dev/null | awk '/pixelHeight/{print $2}')
  printf '  %s  %sx%s → %sx%s  %d KB%s\n' \
    "$(basename "$out")" "$w" "$h" "$nw" "$nh" "$((bytes / 1024))" "$note"
done

echo "   razem: $(du -sh "$DEST" | cut -f1 | tr -d ' ')"
