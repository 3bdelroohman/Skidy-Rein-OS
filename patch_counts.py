import re

path = 'src/app/(dashboard)/payments/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'statusCounts = useMemo\(\(\) => \{.*?\}, \[payments\]\);'
new = '''statusCounts = useMemo(() => {
    const counts = { paid: 0, pending: 0, overdue: 0, partial: 0, deferred: 0 };
    for (const payment of payments) {
      const s = getPaymentDisplayState(payment);
      if (s in counts) counts[s as keyof typeof counts]++;
    }
    return counts;
  }, [payments]);'''

result, n = re.subn(pattern, new, content, flags=re.DOTALL)
if n > 0:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(result)
    print(f'Fix 4 OK ({n} match)')
else:
    print('NOT FOUND')
