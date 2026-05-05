import re

path = 'src/types/database.types.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = 'get_my_role: {'
new = '''delete_student_cascade: {
        Args: { p_student_id: string };
        Returns: undefined;
      };
      get_my_role: {'''

result, count = re.subn(re.escape(old), new, content, count=1)

if count > 0:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(result)
    print(f'REPLACED OK ({count} match)')
else:
    print('NOT FOUND')
