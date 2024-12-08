import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

// Run the bundler
execSync(
  `bun gcc-ts-bundler --src_dir='./content-src' --entry_point='./index.ts' --output_dir='./content-build' --language_out=ECMASCRIPT_2019`,
  { stdio: "inherit" },
);

// Read the worker code
// const workerCode = readFileSync("./content-build/worker.js", "utf-8");

// Inject the worker code directly as a template literal
// const content = readFileSync("./content-build/index.js", "utf-8").replace(
//   "$WORKER_URL$",
//   btoa(workerCode),
// );
const content = readFileSync("./content-build/index.js", "utf-8");

writeFileSync("./content-build/content.js", content);
