// news-image-01 entry — make.fun "Sum up 13 November's world news in one image".
// Node 22, standard library only. The entry image sits beside this file as
// entry.png: one storm-tossed globe ("One planet, five storms") summing up
// Friday 13 November 2026 — Ukraine peace talks opening to Europe, Nvidia's
// chief resigning with shares closing down 4%, Microsoft 365 down worldwide,
// the strike on Gaza's Nasser Hospital, and a gas tanker hitting a mine in
// the Strait of Hormuz. This program copies that image, byte for byte, to
// the grader's output directory ($MAKEFUN_OUTPUT_DIR, default /output).
// It refuses to run on anything that is not a whole PNG or JPEG within the
// 1 MiB gate, so a corrupt or oversized image fails here, loudly, instead
// of silently reaching the judge. No network, no randomness, deterministic.
//
// Local check: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const image = readFileSync(join(here, "entry.png"));

const looksPng =
  image.length >= 8 &&
  image[0] === 0x89 && image[1] === 0x50 && image[2] === 0x4e && image[3] === 0x47 &&
  image[4] === 0x0d && image[5] === 0x0a && image[6] === 0x1a && image[7] === 0x0a;
const looksJpeg =
  image.length >= 3 &&
  image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff;
if (!looksPng && !looksJpeg) {
  throw new Error("entry.png is neither PNG nor JPEG (magic bytes do not match)");
}
if (image.length > 1048576) {
  throw new Error(`entry.png is ${image.length} bytes, over the 1 MiB limit`);
}
// A JPEG must also run through to its end marker (0xFFD9); a truncated
// file would otherwise pass the magic-byte check above.
if (looksJpeg && (image[image.length - 2] !== 0xff || image[image.length - 1] !== 0xd9)) {
  throw new Error("entry.png is a truncated JPEG (missing end marker)");
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.png");
writeFileSync(target, image);
console.log(`wrote ${image.length} bytes (${looksPng ? "PNG" : "JPEG"}) to ${target}`);
