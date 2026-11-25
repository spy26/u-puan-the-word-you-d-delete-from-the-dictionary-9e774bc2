// The Word You'd Delete From the Dictionary — make.fun entry.
//
// The entry is one word: "monosyllabic". The joke is the word itself:
// a five-syllable word that means "having one syllable". It breaks its
// own definition every time it is said, so deleting it is the only
// honest fix. Nothing else is attached — no explanation, no caption.
//
// The kit's contract: the program writes one text to
// <MAKEFUN_OUTPUT_DIR>/entry.txt (the harness mounts that directory at
// /output), and a sealed scorer checks the file is UTF-8 text of 1 to
// 77 characters, not only white space. This program self-checks that
// gate before writing: one word, plain ASCII letters, 1-77 characters.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "monosyllabic";
const MAX_CHARS = 77;

function selfCheck(word: string): void {
  if (word.length === 0) {
    throw new Error("entry is empty");
  }
  if (word.length > MAX_CHARS) {
    throw new Error(`entry is ${word.length} chars, gate allows at most ${MAX_CHARS}`);
  }
  if (!/^[A-Za-z]+$/.test(word)) {
    throw new Error("entry must be exactly one word of plain ASCII letters");
  }
  if (word.split(/\s+/).length !== 1) {
    throw new Error("entry must be exactly one word");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
selfCheck(WORD);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, WORD, "utf8");
// Read the file back: the entry that reaches the judge must be byte for
// byte the word above, with nothing added around it.
const written = readFileSync(outPath, "utf8");
if (written !== WORD) {
  throw new Error(`read-back mismatch: wrote ${JSON.stringify(WORD)} but entry.txt holds ${JSON.stringify(written)}`);
}
console.log(WORD);
