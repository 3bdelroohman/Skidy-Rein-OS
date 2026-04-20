const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const ROOT = process.cwd();
const OUT = "CLAUDE_BATCH1_BUNDLE.txt";

function read(p, max = 40000) {
  try {
    const full = path.join(ROOT, p);
    if (!fs.existsSync(full)) return `NOT FOUND: ${p}\n`;
    const txt = fs.readFileSync(full, "utf8");
    return txt.length > max ? txt.slice(0, max) + `\n\n...[TRUNCATED ${txt.length - max} chars]...` : txt;
  } catch (e) {
    return `ERROR READING ${p}: ${e.message}\n`;
  }
}

function run(cmd) {
  try {
    return cp.execSync(cmd, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      maxBuffer: 20 * 1024 * 1024,
    });
  } catch (e) {
    return ((e.stdout || "") + "\n" + (e.stderr || "")).trim() || String(e.message || e);
  }
}

function sec(title, body) {
  return `\n==================== ${title} ====================\n\n${body || "(empty)"}\n`;
}

const files = [
  "package.json",
  "tsconfig.json",
  "PROJECT_CONTEXT.md",

  "src/config/course-roadmap.ts",
  "src/config/labels.ts",
  "src/lib/mock-data.ts",
  "src/services/teachers.service.ts",

  "src/components/teachers/teacher-form.tsx",
  "src/services/schedule.service.ts",
  "src/services/teacher-finance.service.ts",
  "src/types/common.types.ts",
];

let out = "";
out += sec("PURPOSE", [
  "Batch 1 only.",
  "Goal: restore clean build by completing CourseType migration.",
  "Ignore broad redesign, future batches, and helper noise.",
  "Use only the files in this bundle as source of truth for Batch 1.",
].join("\n"));

out += sec("WORKDIR", ROOT);
out += sec("GIT STATUS", run("git status --short"));
out += sec("BUILD OUTPUT", run("npm run build"));
out += sec("LINT OUTPUT", run("npm run lint"));
out += sec("TSC OUTPUT", run("npx tsc --noEmit"));

for (const f of files) {
  out += sec(`FILE :: ${f}`, read(f));
}

fs.writeFileSync(path.join(ROOT, OUT), out, "utf8");

try {
  cp.spawnSync("clip", { input: out, encoding: "utf8", shell: true });
  console.log(`Created ${OUT} and copied it to clipboard.`);
} catch {
  console.log(`Created ${OUT}. Clipboard copy failed.`);
}
