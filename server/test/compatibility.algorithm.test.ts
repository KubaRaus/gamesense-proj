import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGenreTasteProfile,
  calculateWeightedJaccard
} from "../src/modules/compatibility/compatibility.algorithm";
import type { UserLibraryGame } from "../src/modules/users/users.types";

function game(
  gameId: string,
  genres: string[],
  playtimeMinutes: number
): UserLibraryGame {
  return {
    gameId,
    name: gameId,
    genres,
    playtimeMinutes,
    lastPlayedAt: null
  };
}

test("buildGenreTasteProfile distributes playtime across genres and normalizes weights", () => {
  const profile = buildGenreTasteProfile([
    game("rpg", ["RPG", "Action"], 100),
    game("action", ["Action"], 100)
  ]);

  assert.equal(profile.get("RPG"), 0.25);
  assert.equal(profile.get("Action"), 0.75);
});

test("buildGenreTasteProfile falls back to equal weights when games have no playtime", () => {
  const profile = buildGenreTasteProfile([
    game("first", ["RPG"], 0),
    game("second", ["Action"], 0)
  ]);

  assert.equal(profile.get("RPG"), 0.5);
  assert.equal(profile.get("Action"), 0.5);
});

test("calculateWeightedJaccard returns one for identical taste profiles", () => {
  const profile = new Map([
    ["RPG", 0.7],
    ["Action", 0.3]
  ]);

  assert.equal(calculateWeightedJaccard(profile, profile).score, 1);
});

test("calculateWeightedJaccard returns zero for disjoint or empty profiles", () => {
  assert.equal(
    calculateWeightedJaccard(new Map([["RPG", 1]]), new Map([["Puzzle", 1]])).score,
    0
  );
  assert.equal(calculateWeightedJaccard(new Map(), new Map()).score, 0);
});
