const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sourceDir = path.join('D:\\Hope\\Brochure\\public\\resumes\\bscmsc');
const targetDir = path.join('D:\\Hope\\Brochure\\public\\resumes\\bsms');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const fileMapping = {
  'Resume_Share Biplab (2).pdf': 'Biplab Pradhan',
  'Varun_Sharma_CV (1).pdf': 'Varun',
  'Suprasweeni_Sharma_Resume.pdf': 'Suprasweeni Sharma',
  'NisthaJaitly_Res.pdf': 'Nistha Jaitly',
  'Nikhil Patil CV.pdf': 'Nikhil Patil',
  'Shatakshi_Khadke_Resume.pdf': 'Shatakshi Khadke',
  'anjali (2).pdf': 'Anjali Kumari',
  'Rajeeva Verma CV Updated.pdf': 'Rajeeva Verma',
  'HimanshuRESUME.pdf': 'Himanshu Kumar',
  '_Krish_Waila_CV_0024.pdf': 'Krish Waila',
  'Nandini_Shri_Resume_Updated.pdf': 'Nandini Shri',
  'Pritham resume (1).pdf': 'Pritham Kaur'
};

async function main() {
  for (const [oldName, studentName] of Object.entries(fileMapping)) {
    const sourcePath = path.join(sourceDir, oldName);
    const cleanName = studentName.replace(/\s+/g, '_') + '_Resume.pdf';
    const targetPath = path.join(targetDir, cleanName);
    
    if (fs.existsSync(sourcePath)) {
      console.log('Moving ' + oldName + ' -> ' + cleanName);
      fs.copyFileSync(sourcePath, targetPath);
      
      const students = await prisma.student.findMany({ where: { name: studentName } });
      if (students.length > 0) {
        await prisma.student.update({
          where: { id: students[0].id },
          data: { resumeUrl: '/resumes/bsms/' + cleanName }
        });
        console.log('Updated DB for ' + studentName);
      }
    } else {
      console.log('MISSING: ' + oldName);
    }
  }
}

main().catch(console.error);
