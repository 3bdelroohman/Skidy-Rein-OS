const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const ROOT = process.cwd();
const OUT_BASE = "CLAUDE_BUNDLE";
const MAX_CHARS = 45000;

function rel(p) {
  return p.replace(ROOT + path.sep, "");
}

function exists(p) {
  return fs.existsSync(path.join(ROOT, p));
}

function readFileSafe(p, max = 30000) {
  try {
    const full = path.join(ROOT, p);
    if (!fs.existsSync(full)) return `NOT FOUND: ${p}\n`;
    const raw = fs.readFileSync(full, "utf8");
    if (raw.length <= max) return raw;
    return raw.slice(0, max) + `\n\n...[TRUNCATED ${raw.length - max} chars]...`;
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
      maxBuffer: 20 * 1024 * 1024,
      shell: true,
    });
  } catch (e) {
    const stdout = e.stdout ? String(e.stdout) : "";
    const stderr = e.stderr ? String(e.stderr) : "";
    return (stdout + "\n" + stderr).trim() || e.message;
  }
}

function section(title, content) {
  return `\n==================== ${title} ====================\n\n${content || "(empty)"}\n`;
}

function listFilesRecursive(baseDir, filterFn) {
  const result = [];
  const base = path.join(ROOT, baseDir);
  if (!fs.existsSync(base)) return result;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const r = rel(full);
        if (filterFn(r)) result.push(r);
      }
    }
  }

  walk(base);
  return result.sort();
}

function grepKeywords(baseDir, exts, keywords) {
  const files = listFilesRecursive(baseDir, (p) => exts.some((ext) => p.endsWith(ext)));
  const rows = [];

  for (const f of files) {
    try {
      const lines = fs.readFileSync(path.join(ROOT, f), "utf8").split(/\r?\n/);
      lines.forEach((line, i) => {
        if (keywords.some((kw) => line.includes(kw))) {
          rows.push(`${f}:${i + 1}: ${line.trim()}`);
        }
      });
    } catch {}
  }

  return rows.join("\n");
}

function getModifiedFiles() {
  const status = run("git status --short");
  const files = [];
  status.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*[A-Z?MADRCU!]{1,2}\s+(.+)$/);
    if (m) {
      let file = m[1].trim();
      if (file.includes(" -> ")) file = file.split(" -> ")[1].trim();
      if (
        !file.startsWith("node_modules") &&
        !file.startsWith(".next") &&
        !file.endsWith(".png") &&
        !file.endsWith(".jpg") &&
        !file.endsWith(".jpeg") &&
        !file.endsWith(".webp") &&
        !file.endsWith(".pdf")
      ) {
        files.push(file);
      }
    }
  });
  return [...new Set(files)];
}

const routeFiles = listFilesRecursive("src", (p) => p.endsWith("page.tsx"));
const serviceFiles = listFilesRecursive("src", (p) => p.includes("services\\") || p.includes("services/"));
const migrationFiles = listFilesRecursive("supabase", (p) => p.endsWith(".sql"));

const importantFiles = [
  "package.json",
  "tsconfig.json",
  "next.config.ts",
  "PROJECT_CONTEXT.md",
  "src/types/common.types.ts",
  "src/types/database.types.ts",
  "src/lib/auth.ts",
  "src/lib/locale.ts",
  "src/lib/formatters.ts",
  "src/stores/ui-store.ts",
  "src/providers/user-provider.tsx",
  "src/app/(dashboard)/page.tsx",
  "src/app/(dashboard)/follow-ups/page.tsx",
  "src/app/(dashboard)/schedule/page.tsx",
  "src/app/(dashboard)/teachers/page.tsx",
  "src/app/(dashboard)/teachers/[id]/page.tsx",
  "src/app/(dashboard)/parents/[id]/page.tsx",
  "src/app/(dashboard)/students/[id]/page.tsx",
  "src/app/(dashboard)/payments/new/page.tsx",
  "src/components/schedule/schedule-entry-form.tsx",
  "src/components/teachers/teacher-form.tsx",
  "src/services/schedule.service.ts",
  "src/services/teacher-finance.service.ts",
  "src/services/payments.service.ts",
  "src/services/follow-ups.service.ts",
  "src/services/dashboard.service.ts",
];

const modifiedFiles = getModifiedFiles();

let out = "";
out += section("BUNDLE PURPOSE", [
  "This bundle is prepared for Claude text-only analysis.",
  "Goal: continue the internal system project accurately without repo upload.",
  "Use this as project truth. Do not assume missing schema or flows.",
].join("\n"));

out += section("WORKDIR", ROOT);
out += section("GIT STATUS", run("git status --short"));
out += section("LAST 10 COMMITS", run("git log --oneline -n 10"));
out += section("PACKAGE.JSON", readFileSafe("package.json", 20000));
out += section("TSCONFIG", readFileSafe("tsconfig.json", 12000));
out += section("PROJECT CONTEXT", readFileSafe("PROJECT_CONTEXT.md", 25000));

out += section("APP ROUTES", routeFiles.join("\n"));
out += section("SERVICES", serviceFiles.join("\n"));
out += section("MIGRATIONS", migrationFiles.join("\n"));

out += section(
  "KEYWORD SCAN :: TODO/FIXME/HACK/BUG",
  grepKeywords("src", [".ts", ".tsx", ".js", ".jsx", ".sql"], ["TODO", "FIXME", "HACK", "BUG", "XXX", "@todo"])
);

out += section("MODIFIED FILES", modifiedFiles.join("\n"));

for (const f of importantFiles) {
  if (exists(f)) {
    out += section(`FILE :: ${f}`, readFileSafe(f, 30000));
  }
}

for (const f of modifiedFiles) {
  if (exists(f) && !importantFiles.includes(f)) {
    out += section(`MODIFIED FILE :: ${f}`, readFileSafe(f, 25000));
  }
}

out += section("BUILD OUTPUT", run("npm run build"));
out += section("LINT OUTPUT", run("npm run lint"));
out += section("TSC OUTPUT", run("npx tsc --noEmit"));

const parts = [];
for (let i = 0; i < out.length; i += MAX_CHARS) {
  parts.push(out.slice(i, i + MAX_CHARS));
}

if (parts.length === 1) {
  fs.writeFileSync(path.join(ROOT, `${OUT_BASE}.txt`), parts[0], "utf8");
  try {
    cp.spawnSync("clip", { input: parts[0], encoding: "utf8", shell: true });
  } catch {}
  console.log(`Created ${OUT_BASE}.txt and copied to clipboard.`);
} else {
  parts.forEach((part, idx) => {
    fs.writeFileSync(path.join(ROOT, `${OUT_BASE}_PART_${idx + 1}.txt`), part, "utf8");
  });
  try {
    cp.spawnSync("clip", { input: parts[0], encoding: "utf8", shell: true });
  } catch {}
  console.log(`Created ${parts.length} parts: ${OUT_BASE}_PART_1.txt ... ${OUT_BASE}_PART_${parts.length}.txt`);
  console.log("PART 1 copied to clipboard.");
}
