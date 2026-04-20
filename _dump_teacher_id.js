const fs = require("fs");
const c = fs.readFileSync("src/app/(dashboard)/teachers/[id]/page.tsx", "utf8");
require("child_process").spawn("clip").stdin.end(c);
console.log("Copied to clipboard, length:", c.length);