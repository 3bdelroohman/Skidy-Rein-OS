import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Local temp / AI / batch artifacts
    "_*.js",
    "_*.txt",
    "BATCH*_RESULT.txt",
    "CLAUDE_*BUNDLE*.txt",
    "_backup_batch*/**",
  ]),
]);

export default eslintConfig;