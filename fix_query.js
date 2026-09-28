const fs = require('fs');
const file = 'src/app/courses/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `students: {
          include: {
            tags: true
          }
        }`,
  `students: {
          orderBy: { order: 'asc' },
          include: {
            tags: true
          }
        }`
);

fs.writeFileSync(file, content);
