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

// The gate accepts UTF-8 text of 1 to 200 characters, not only
// white space, on a single line.
const MAX_CHARS = 200;
const MIN_CHARS = 1;

/** Resolve where the finished entry is written. */
function resolveOutputPath(): string {
  return process.env.OUTPUT_PATH ?? "/output/entry.txt";
}

/** Normalise the raw line: trim surrounding white space. */
function formatEntry(raw: string): string {
  return raw.trim();
}

/**
 * Reject lines that are empty, over the character limit, or span
 * more than one line. Each rule is checked separately so a failure
 * reports exactly which constraint was violated. The length check
 * runs first because a multi-line input can only be judged by its
 * total length once it is known to fit the gate at all.
 */
function validateLine(line: string): void {
  if (line.length < MIN_CHARS || line.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${line.length}`,
    );
  }
  assertSingleLine(line);
}

/** The entry must be one line — no embedded newlines allowed. */
function assertSingleLine(line: string): void {
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

/** Write the validated entry, creating the output directory first. */
function writeEntry(line: string, outPath: string): void {
  // mkdirSync with recursive: true is a no-op when the directory
  // already exists, so this stays safe on repeated runs.
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, line, "utf8");
}

function main(): void {
  const entry = formatEntry(ENTRY);
  validateLine(entry);
  writeEntry(entry, resolveOutputPath());
}

main();
