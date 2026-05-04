import json, re, os

# ── 1. tsconfig.json ── exclude src_backup* ──────────────────────────────────
tsc_path = "tsconfig.json"
tsc = json.loads(open(tsc_path, "r", encoding="utf-8").read())
excl = tsc.get("exclude", [])
for d in ["src_backup2", "src_backup3"]:
    if d not in excl:
        excl.append(d)
tsc["exclude"] = excl
open(tsc_path, "w", encoding="utf-8").write(json.dumps(tsc, indent=2, ensure_ascii=False))
print("✅ tsconfig.json updated")

# ── 2. eslint.config.mjs ── ignore src_backup* ───────────────────────────────
eslint_path = "eslint.config.mjs"
eslint_text = open(eslint_path, "r", encoding="utf-8").read()
if "src_backup2" not in eslint_text:
    # find globalIgnores or ignores array and append
    eslint_text = re.sub(
        r'(ignores\s*:\s*\[)',
        r'\1\n    "src_backup2/**",\n    "src_backup3/**",',
        eslint_text,
        count=1
    )
    open(eslint_path, "w", encoding="utf-8").write(eslint_text)
    print("✅ eslint.config.mjs updated")
else:
    print("✅ eslint.config.mjs already ignores src_backup*")

# ── 3. Fix useEffect eslint-disable with blank lines ─────────────────────────
def fix_eslint_disable(path):
    text = open(path, "r", encoding="utf-8").read()
    # Remove blank lines between eslint-disable-next-line and closing }), line
    fixed = re.sub(
        r'([ \t]*//\s*eslint-disable-next-line\s+react-hooks/exhaustive-deps)\n(\n+)',
        r'\1\n',
        text
    )
    if fixed != text:
        open(path, "w", encoding="utf-8").write(fixed)
        print(f"✅ Fixed eslint-disable in {path}")
    else:
        print(f"⚠️  No change in {path}")

fix_eslint_disable("src/app/(dashboard)/teachers/[id]/page.tsx")
fix_eslint_disable("src/components/groups/student-notes-inline.tsx")

# ── 4. Fix ownerRole in ownership-center/page.tsx ────────────────────────────
oc_path = "src/app/(dashboard)/ownership-center/page.tsx"
oc_text = open(oc_path, "r", encoding="utf-8").read()
oc_fixed = oc_text.replace(
    "key={bucket.ownerName + bucket.ownerRole}",
    "key={bucket.ownerName}"
)
if oc_fixed != oc_text:
    open(oc_path, "w", encoding="utf-8").write(oc_fixed)
    print("✅ Fixed ownerRole in ownership-center/page.tsx")
else:
    print("⚠️  ownerRole fix: no match found")

print("\n🎉 All done!")
