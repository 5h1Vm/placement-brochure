const fs = require('fs');
const file = 'src/app/courses/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');
const sortLogic = `  if (course && course.slug === 'bsms') {
    const desiredOrder = ['Biplab Pradhan','Varun','Suprasweeni Sharma','Nistha Jaitly','Nikhil Patil','Shatakshi Khadke','Dibyendu Das','Anjali Kumari','Rajeeva Verma','Himanshu Kumar','Krish Waila','Nandini Shri','Pritham Kaur','Vanshika Jain'];
    course.students.sort((a, b) => {
      let idxA = desiredOrder.findIndex(name => a.name === name);
      let idxB = desiredOrder.findIndex(name => b.name === name);
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });
  }`;
content = content.replace('if (!course) {', sortLogic + '\n\n  if (!course) {');
fs.writeFileSync(file, content);
