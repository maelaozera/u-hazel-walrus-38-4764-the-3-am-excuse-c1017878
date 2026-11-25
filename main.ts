import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The 3 AM Excuse — one line in the voice of a hardware wallet that
// refuses to sign a transaction at 3 AM.
//
// Angle: the wallet is the only one keeping score. It remembers the
// owner's own history — every 3 AM signature became a 9 AM apology —
// so it shuts its screen like a shop closing for the night, and tells
// the owner to come back when both the sun and their judgment are up.
// No battery, firmware, or cold-storage joke: the hour itself is the
// evidence, and the wallet's ledger of receipts is its grudge.
const ENTRY =
  "I've kept every receipt: your last three 3 AM signatures all became 9 AM apologies. My screen is closed \u2014 come back when the sun, and your judgment, are up.";

const MAX_CHARS = 200;

function main(): void {
  const entry = ENTRY.trim();

  // Self-check: the gate requires UTF-8 text of 1 to 200 characters,
  // not only white space, on a single line.
  if (entry.length < 1 || entry.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_CHARS} characters, got ${entry.length}`,
    );
  }
  if (entry.includes("\n")) {
    throw new Error("entry must be a single line");
  }

  const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, entry, "utf8");
}

main();
