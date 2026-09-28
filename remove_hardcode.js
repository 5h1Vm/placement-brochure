const fs = require('fs');
const file = 'src/app/courses/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `  if (course && course.slug === 'bsms') {
    const desiredOrder = ['Biplab Pradhan','Varun','Suprasweeni Sharma','Nistha Jaitly','Nikhil Patil','Shatakshi Khadke','Dibyendu Das','Anjali Kumari','Rajeeva Verma','Himanshu Kumar','Krish Waila','Nandini Shri','Pritham Kaur','Vanshika Jain'];
    course.students.sort((a, b) => {
      let idxA = desiredOrder.findIndex(name => a.name === name);
      let idxB = desiredOrder.findIndex(name => b.name === name);
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });
  }`;

content = content.replace(oldLogic + '\n\n', '');

// Update the Prisma query to order by the new 'order' field we'll add
content = content.replace(
  'include: {\n            tags: true\n          }',
  'orderBy: { order: \'asc\' },\n          include: {\n            tags: true\n          }'
);

fs.writeFileSync(file, content);
