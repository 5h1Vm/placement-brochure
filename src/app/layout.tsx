import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { User, MapPin, Phone, Mail } from 'lucide-react'
import RecruiterPopup from '@/components/RecruiterPopup'
import FooterInterestForm from '@/components/FooterInterestForm'
import { PrismaClient } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Placement Brochure | NFSU Delhi',
  description: 'Placement Brochure Management System for National Forensic Sciences University Delhi Campus',
}

const prisma = new PrismaClient()

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await prisma.platformSettings.findUnique({
    where: { id: 'default' }
  })
  
  const primaryColor = settings?.primaryColor || '#1B2A4A'
  const secondaryColor = settings?.secondaryColor || '#D4A520'

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: ${primaryColor};
            --color-secondary: ${secondaryColor};
          }
        `}} />
        <RecruiterPopup />
        <header className="bg-[#0a1628]/95 backdrop-blur-md border-b border-secondary/40 shadow-sm sticky top-0 z-50 transition-all duration-300">
          <div className="container mx-auto px-4 py-3 flex flex-col lg:flex-row items-center justify-between">
            <Link href="/" className="flex items-center space-x-4 mb-4 lg:mb-0 hover:opacity-90 transition-opacity">
              <div className="w-12 h-16 flex items-center justify-center shrink-0">
                <img src="/nfsu-logo-small.png" alt="NFSU Crest" className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              </div>
              <div className="flex flex-col text-white">
                <span className="font-extrabold text-lg md:text-xl tracking-tight drop-shadow-sm">National Forensic Sciences University</span>
                <span className="text-xs font-semibold tracking-wide text-white/70">Delhi Campus | Ministry of Home Affairs</span>
                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-0.5">An Institution of National Importance</span>
              </div>
            </Link>
            <nav className="space-x-8 flex text-sm font-bold text-white/80">
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
              <Link href="/courses" className="hover:text-secondary transition-colors">Programs</Link>
              <Link href="/faculty" className="hover:text-secondary transition-colors">Leadership & Faculty</Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer id="footer-contact" className="bg-white border-t border-gray-200 mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              
              {/* Left: Branding & Contact */}
              <div className="max-w-sm">
                <h2 className="text-primary font-black text-xl mb-1">NFSU Delhi</h2>
                <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">Placement Cell</p>
                <div className="space-y-2 text-sm text-gray-600 font-medium">
                  <p className="flex items-center text-primary-dark font-bold mb-1">
                    <User className="w-4 h-4 mr-2 text-secondary-dark" />
                    {settings?.coordinatorName || 'Prof. Dr. Ajit Muzumdar'}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-secondary-dark" />
                    LNJN NICFS NFSU, Rohini Sector 3, New Delhi - 110085
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-secondary-dark" />
                    <a href={`tel:${settings?.contactPhone || '+91 94230 57857'}`} className="hover:text-primary transition-colors">{settings?.contactPhone || '+91 94230 57857'}</a>
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-secondary-dark" />
                    <a href={`mailto:${settings?.contactEmail || 'placement_dc@nfsu.ac.in'}`} className="hover:text-primary transition-colors">{settings?.contactEmail || 'placement_dc@nfsu.ac.in'}</a>
                  </p>
                </div>
              </div>

              {/* Right: Map & Form */}
              <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto mt-6 lg:mt-0">
                {/* Responsive Map — bigger on large screens */}
                <div className="w-full sm:w-72 lg:w-64 xl:w-80 h-44 sm:h-40 lg:h-36 xl:h-44 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                  <iframe 
                    src="https://maps.google.com/maps?q=National%20Forensic%20Sciences%20University,%20Delhi%20Campus,%20Rohini&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Functional Interest Form */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm w-full sm:w-72 lg:w-64 flex flex-col justify-center">
                  <h3 className="text-primary font-bold mb-1 text-xs uppercase tracking-wider">Recruiter Interest</h3>
                  <p className="text-[10px] text-gray-500 mb-2 leading-tight">Drop your details and we'll reach out.</p>
                  <FooterInterestForm />
                </div>
              </div>

            </div>
          </div>
          
          {/* Copyright Bar */}
          <div className="border-t border-gray-100 bg-gray-50 py-4 mt-6">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-medium">
              <p>© {new Date().getFullYear()} National Forensic Sciences University, Delhi Campus. All rights reserved.</p>
              <p className="mt-2 md:mt-0">
                Designed & Developed by{' '}
                <a 
                  href="https://www.linkedin.com/in/5h1Vm" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="opacity-40 hover:opacity-100 hover:text-primary transition-all duration-300 font-bold"
                >
                  5h1Vm
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
