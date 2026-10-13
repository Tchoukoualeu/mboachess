#!/usr/bin/env python3
"""Sample the public Lichess puzzle database into server/puzzleData.ts.

The module stays small enough for GitHub to accept. The full file is
https://database.lichess.org/lichess_db_puzzle.csv.zst (CC0). Stream it in:

  zstd -dc lichess_db_puzzle.csv.zst | python3 scripts/sample-puzzles.py server/puzzleData.ts
"""

import csv
import json
import os
import random
import re
import sys

# One source file, small enough for GitHub to accept in a normal commit.
MAX_MODULE_BYTES = 60_000

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


def select_for_module(puzzles):
    theme_lists = {theme: [] for theme in THEMES}
    band_lists = {}
    for puzzle in puzzles:
        for theme in puzzle[5].split():
            if theme in theme_lists:
                theme_lists[theme].append(puzzle)
        band = (int(puzzle[1]) // 200) * 200
        band_lists.setdefault(band, []).append(puzzle)
    for bucket in list(theme_lists.values()) + list(band_lists.values()):
        random.shuffle(bucket)

    queues = [theme_lists[theme] for theme in THEMES]
    queues.extend(band_lists[band] for band in sorted(band_lists))
    cursors = [0] * len(queues)
    chosen = []
    seen = set()
    size = 40
    progressed = True
    while progressed:
        progressed = False
        for index, queue in enumerate(queues):
            while cursors[index] < len(queue) and queue[cursors[index]][0] in seen:
                cursors[index] += 1
            if cursors[index] >= len(queue):
                continue
            puzzle = queue[cursors[index]]
            cursors[index] += 1
            extra = len(json.dumps(puzzle, separators=(",", ":")).encode("utf-8")) + 2
            if size + extra > MAX_MODULE_BYTES:
                return chosen
            seen.add(puzzle[0])
            chosen.append(puzzle)
            size += extra
            progressed = True
    return chosen


def write_puzzle_module(path, puzzles):
    selected = select_for_module(puzzles)
    selected.sort(key=lambda puzzle: puzzle[0])
    lines = [json.dumps(puzzle, separators=(",", ":")) for puzzle in selected]
    directory = os.path.dirname(path)
    if directory:
        os.makedirs(directory, exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        handle.write("export const puzzleRows = [\n")
        handle.write(",\n".join(lines))
        handle.write("\n] as const\n")
    return path, len(selected)


def main():
    out_path = sys.argv[1] if len(sys.argv) > 1 else "server/puzzleData.ts"
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
    path, kept = write_puzzle_module(out_path, puzzles)
    print(
        f"wrote {kept} puzzles from {scanned} rows to {path}",
        file=sys.stderr,
    )
    for theme in THEMES:
        print(f"  {theme}: {theme_seen[theme][0]} seen, {len(theme_buckets[theme])} kept", file=sys.stderr)


if __name__ == "__main__":
    main()
