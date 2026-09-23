const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Reset DB
  await prisma.student.deleteMany()
  await prisma.course.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.platformSettings.deleteMany()

  // Create Settings
  await prisma.platformSettings.create({
    data: {
      id: 'default',
      primaryColor: '#4b2e15',
      secondaryColor: '#cfa144',
    }
  })

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      name: 'B.Tech - M.Tech. Computer Science & Engineering (Cyber Security)',
      slug: 'btech-mtech-cse-cyber-security',
      batch: '2022-27',
      description: 'Integrated 5-Year Program focusing on advanced cybersecurity concepts, penetration testing, and digital forensics.',
    },
  })

  const course2 = await prisma.course.create({
    data: {
      name: 'M.Sc. Digital Forensics and Information Security',
      slug: 'msc-digital-forensics',
      batch: '2025-27',
      description: '2-Year Program specializing in deep digital forensics, malware analysis, and information security management.',
    },
  })

  // Helper to connect/create tags
  const createTags = (skillsStr) => {
    const tags = skillsStr.split(',').map(s => s.trim()).filter(Boolean)
    return {
      connectOrCreate: tags.map(tag => ({
        where: { name: tag },
        create: { name: tag }
      }))
    }
  }

  // Students for Course 1
  await prisma.student.create({
    data: {
      name: 'Rohan Kochhar',
      experience: 'Information Systems Intern – Indian Oil; Data Engineering Intern – CodeVyasa; Cyber Security Intern – Gurgaon Police Cyber Crime Cell.',
      certifications: 'Cisco – Introduction to Cybersecurity.',
      achievements: 'AIR 2 – NFAT; GATE CS 2026 Qualified; India Delegate – HPAIR, Hanoi; Gold Medal – DPS R.K. Puram for 8 years of academic excellence; Scholar Badges, Classes 4–11; State-Level Swimmer – 6 Gold, 7 Silver, 5 Bronze.',
      courseId: course1.id,
      linkedinUrl: 'https://linkedin.com/in/sample',
      tags: createTags('Python, SQL, C++, Computer Networks, Digital Forensics, SOC, OSINT, Cloud Security, VAPT, Incident Response, GRC, AI/ML, Docker, AWS, CI/CD, Wireshark, Nmap, Burp Suite')
    }
  })

  await prisma.student.create({
    data: {
      name: 'Ritesh Kumar Goel',
      experience: 'Information Systems Intern – Indian Oil; Data Engineering Intern – CodeVyasa; Cyber Security Intern – Gurgaon Police Cyber Crime Cell.',
      certifications: 'Google Cloud – Cloud Storage & GenAI Applications; Cisco – Introduction to Cybersecurity; IBM – Python for Data Science, AI & Development.',
      achievements: 'AIR 4 – NFAT; AIR 335 – Naukri Campus Aptitude Test ; India Delegate – HPAIR, Hanoi; 3× Silver Medalist in college sports events.',
      courseId: course1.id,
      tags: createTags('Python, SQL, C++, SOC, AWS, Computer Networks, Digital Forensics, Threat Intelligence, OSINT, Cloud Security, VAPT, Incident Response, GRC, AI/ML, Docker, Wireshark, Nmap, Burp Suite')
    }
  })

  await prisma.student.create({
    data: {
      name: 'Bhawana',
      experience: 'Cyber Forensics Intern - Cyber Cell, Delhi Police; Cybersecurity Intern - Cyber Cell, Gurugram Police',
      certifications: 'FACT 2026 – Qualified (Digital Forensics), Ministry of Home Affairs, Government of India; Information Security Analyst – EC-Council',
      achievements: 'UGC NET June 2026 – Qualified (Computer Science & Applications) for Assistant Professor and PhD Admission; Merit-Based Scholarship Recipient – National Forensic Sciences University',
      courseId: course1.id,
      tags: createTags('Python, C++, Java, Full-Stack Web Development, Digital Forensics, Malware Analysis, Incident Response, OSINT, VAPT, Network Security, Machine Learning')
    }
  })

  // Students for Course 2
  await prisma.student.create({
    data: {
      name: 'RITABRATA DAS BISWAS',
      experience: 'Cyber Forensics Intern at State Forensic Science Laboratory, Kolkata (May - June, 2026), Independent researcher (Computational Criminology)',
      certifications: 'Google Cybersecurity Professional, Basel Institute on Governance: OSINT',
      achievements: 'First Prize for best innovation in Satyendranath Bose Science and Technology fair, developing a tool on Computational Cyber Criminology',
      courseId: course2.id,
      tags: createTags('Digital Forensic investigation, Data acquisition, Audio and Video Analysis, Python, Java, Image Forensics, Social Engineering, Cyberpsychology, FTK Imager, TSK, Wireshark, Nmap, Volatility, KAPE')
    }
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
