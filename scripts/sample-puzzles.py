#!/usr/bin/env python3
"""Sample the public Lichess puzzle database into data/puzzles.json.

The full file is https://database.lichess.org/lichess_db_puzzle.csv.zst
(CC0). Stream it into this script:

  zstd -dc lichess_db_puzzle.csv.zst | python3 scripts/sample-puzzles.py data/puzzles.json
"""

import csv
import json
import random
import re
import sys

UCI_RE = re.compile(r"^[a-h][1-8][a-h][1-8][qrbn]?$")

random.seed(20261013)

THEMES = [
    "opening",
    "middlegame",
    "endgame",
    "mate",
    "mateIn1",
    "mateIn2",
    "fork",
    "pin",
    "skewer",
    "discoveredAttack",
    "sacrifice",
    "hangingPiece",
    "trappedPiece",
    "backRankMate",
    "promotion",
    "kingsideAttack",
    "queensideAttack",
    "defensiveMove",
    "crushing",
    "advantage",
    "short",
    "long",
    "master",
]
THEME_CAP = 600
BAND_CAP = 100
GAME_ID_RE_PARTS = 8


def reservoir_add(bucket, seen, item, cap):
    seen[0] += 1
    if len(bucket) < cap:
        bucket.append(item)
        return
    slot = random.randrange(seen[0])
    if slot < cap:
        bucket[slot] = item


def main():
    out_path = sys.argv[1] if len(sys.argv) > 1 else "data/puzzles.json"
    theme_buckets = {theme: [] for theme in THEMES}
    theme_seen = {theme: [0] for theme in THEMES}
    bands = list(range(500, 2800, 100))
    band_buckets = {band: [] for band in bands}
    band_seen = {band: [0] for band in bands}
    scanned = 0

    reader = csv.reader(sys.stdin)
    next(reader, None)
    for row in reader:
        scanned += 1
        if len(row) < 9:
            continue
        puzzle_id, fen, moves, rating_s, _rd, popularity_s, plays_s, themes_s, game_url = row[:9]
        try:
            rating = int(rating_s)
            popularity = int(popularity_s)
            plays = int(plays_s)
        except ValueError:
            continue
        if popularity < 0 or plays < 1:
            continue
        move_list = moves.split()
        if len(move_list) < 2 or len(move_list) > 40:
            continue
        if any(UCI_RE.fullmatch(move) is None for move in move_list):
            continue
        parts = fen.split(" ")
        if len(parts) < 2 or parts[1] not in ("w", "b"):
            continue
        side = parts[1]
        game_id = game_url.split("lichess.org/", 1)[-1].split("/")[0].split("#")[0]
        if len(game_id) != GAME_ID_RE_PARTS or not game_id.isalnum():
            continue
        solver = "b" if side == "w" else "w"
        item = [
            puzzle_id,
            rating,
            plays,
            game_id,
            solver,
            themes_s,
            fen,
            moves,
        ]
        for theme in themes_s.split():
            if theme in theme_buckets:
                reservoir_add(theme_buckets[theme], theme_seen[theme], item, THEME_CAP)
        band = (rating // 100) * 100
        if band in band_buckets:
            reservoir_add(band_buckets[band], band_seen[band], item, BAND_CAP)
        if scanned % 500000 == 0:
            print(f"scanned {scanned}", file=sys.stderr)

    chosen = {}
    for bucket in list(theme_buckets.values()) + list(band_buckets.values()):
        for item in bucket:
            chosen[item[0]] = item
    puzzles = list(chosen.values())
    puzzles.sort(key=lambda item: item[0])
    with open(out_path, "w", encoding="utf-8") as handle:
        json.dump(puzzles, handle, separators=(",", ":"))
        handle.write("\n")
    print(
        f"wrote {len(puzzles)} puzzles from {scanned} rows to {out_path}",
        file=sys.stderr,
    )
    for theme in THEMES:
        print(f"  {theme}: {theme_seen[theme][0]} seen, {len(theme_buckets[theme])} kept", file=sys.stderr)


if __name__ == "__main__":
    main()
