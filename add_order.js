const fs = require('fs');
const file = 'prisma/schema.prisma';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('order          Int')) {
  content = content.replace(
    'portfolioUrl   String?',
    'portfolioUrl   String?\n  order          Int      @default(0)'
  );
  fs.writeFileSync(file, content);
}
