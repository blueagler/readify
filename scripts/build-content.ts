import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

// Run the bundler
execSync(
  `bun --bun gcc-ts-bundler --src_dir='./content-src' --entry_point='./index.ts' --output_dir='./content-build' --language_out=ECMASCRIPT_2019`,
  { stdio: "inherit" },
);

const content = readFileSync("./content-build/index.js", "utf-8");

writeFileSync("./content-build/content.js", content);
