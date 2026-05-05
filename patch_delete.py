import re

path = 'src/services/students.service.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'/\*\* Delete a student permanently \*/\s*export async function deleteStudent\(id: string\): Promise<boolean> \{.*?saveLocalStudents\(getLocalStudents\(\)\.filter\(\(s\) => s\.id !== id\)\);\s*return true;\s*\}'

new = """/** Delete a student and all related records atomically via DB transaction */
export async function deleteStudent(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client not available");

  const { error } = await supabase.rpc("delete_student_cascade", { p_student_id: id });

  if (error) {
    console.error("[students] delete cascade failed", error);
    throw new Error(error.message || "\u062a\u0639\u0630\u0631 \u062d\u0630\u0641 \u0627\u0644\u0637\u0627\u0644\u0628");
  }

  saveLocalStudents(getLocalStudents().filter((s) => s.id !== id));
  return true;
}"""

result, count = re.subn(pattern, new, content, flags=re.DOTALL)

if count > 0:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(result)
    print(f'REPLACED OK ({count} match)')
else:
    print('NOT FOUND')
