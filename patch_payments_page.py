import re

path = 'src/app/(dashboard)/payments/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

fixes = 0

# Fix 1: hardcoded hex colors -> CSS variables compatible classes
old_meta = 'PAYMENT_STATUS_META: Record<DisplayStatus, { color: string; bg: string }> = {\n\n\n  paid: { color: "#059669", bg: "#ECFDF5" },\n\n\n  pending: { color: "#D97706", bg: "#FFFBEB" },\n\n\n  overdue: { color: "#DC2626", bg: "#FEF2F2" },\n\n\n  refunded: { color: "#6B7280", bg: "#F3F4F6" },\n\n\n  partial: { color: "#2563EB", bg: "#EFF6FF" },\n\n\n  deferred: { color: "#7C3AED", bg: "#F5F3FF" },\n\n\n};'
new_meta = 'PAYMENT_STATUS_META: Record<DisplayStatus, { colorClass: string; bgClass: string }> = {\n  paid:     { colorClass: "text-emerald-700 dark:text-emerald-400", bgClass: "bg-emerald-100 dark:bg-emerald-900/30" },\n  pending:  { colorClass: "text-amber-700 dark:text-amber-400",   bgClass: "bg-amber-100 dark:bg-amber-900/30" },\n  overdue:  { colorClass: "text-red-700 dark:text-red-400",       bgClass: "bg-red-100 dark:bg-red-900/30" },\n  refunded: { colorClass: "text-gray-600 dark:text-gray-400",     bgClass: "bg-gray-100 dark:bg-gray-800/50" },\n  partial:  { colorClass: "text-blue-700 dark:text-blue-400",     bgClass: "bg-blue-100 dark:bg-blue-900/30" },\n  deferred: { colorClass: "text-violet-700 dark:text-violet-400", bgClass: "bg-violet-100 dark:bg-violet-900/30" },\n};'

if old_meta in content:
    content = content.replace(old_meta, new_meta)
    fixes += 1
    print('Fix 1 OK: colors')
else:
    print('Fix 1 MISS: colors')

# Fix 2: update badge style= to className=
content, n = re.subn(
    r'<span className="rounded-full px-2\.5 py-1 text-xs font-semibold" style=\{\{ backgroundColor: meta\.bg, color: meta\.color \}\}>',
    '<span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", meta.bgClass, meta.colorClass)}>',
    content
)
if n > 0:
    fixes += n
    print(f'Fix 2 OK: badge style->className ({n} occurrences)')
else:
    print('Fix 2 MISS: badge')

# Fix 3: update StatusMiniCard style= to className=
content, n = re.subn(
    r'<span className="inline-flex rounded-full px-2\.5 py-1 text-xs font-semibold" style=\{\{ backgroundColor: meta\.bg, color: meta\.color \}\}>',
    '<span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", meta.bgClass, meta.colorClass)}>',
    content
)
if n > 0:
    fixes += n
    print(f'Fix 3 OK: StatusMiniCard style->className ({n} occurrences)')
else:
    print('Fix 3 MISS: StatusMiniCard')

# Fix 4: statusCounts - replace 5 separate filters with one reduce
old_counts = re.search(r'const statusCounts = useMemo\(\(\) => \{.*?}\s*\), \[payments\]\);', content, re.DOTALL)
if old_counts:
    new_counts = '''const statusCounts = useMemo(() => {
    const counts = { paid: 0, pending: 0, overdue: 0, partial: 0, deferred: 0 };
    for (const payment of payments) {
      const s = getPaymentDisplayState(payment);
      if (s in counts) counts[s as keyof typeof counts]++;
    }
    return counts;
  }, [payments]);'''
    content = content[:old_counts.start()] + new_counts + content[old_counts.end():]
    fixes += 1
    print('Fix 4 OK: statusCounts reduce')
else:
    print('Fix 4 MISS: statusCounts')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nTotal fixes applied: {fixes}')
