const c = require('fs').readFileSync('src/components/teachers/teacher-form.tsx', 'utf8');
console.log('Line 12:', c.split('\n')[11]);
console.log('BOM:', c.charCodeAt(0));
console.log('Has web:', c.includes('"web"'));
