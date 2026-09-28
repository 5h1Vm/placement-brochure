const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const desiredOrder = [
  "Biplab Pradhan",
  "Varun",
  "Suprasweeni Sharma",
  "Nistha Jaitly",
  "Nikhil Patil",
  "Shatakshi Khadke",
  "Dibyendu Das",
  "Anjali Kumari",
  "Rajeeva Verma",
  "Himanshu Kumar",
  "Krish Waila",
  "Nandini Shri",
  "Pritham Kaur",
  "Vanshika Jain"
];

async function main() {
  for (let i = 0; i < desiredOrder.length; i++) {
    const name = desiredOrder[i];
    await prisma.student.updateMany({
      where: { name: name, course: { slug: "bsms" } },
      data: { order: i + 1 }
    });
    console.log(`Updated ${name} to order ${i + 1}`);
  }
}
main().catch(console.error);
