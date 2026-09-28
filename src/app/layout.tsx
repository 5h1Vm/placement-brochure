import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { User, MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import RecruiterPopup from '@/components/RecruiterPopup'
import FooterInterestForm from '@/components/FooterInterestForm'
import { prisma } from '@/lib/prisma'
import { sanitizeColor } from '@/lib/sanitize'

export const metadata: Metadata = {
  title: 'Placement Brochure | NFSU Delhi',
  description: 'Placement Brochure Management System for National Forensic Sciences University Delhi Campus',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let settings = null;
  try {
    settings = await prisma.platformSettings.findUnique({
      where: { id: 'default' }
    });
  } catch (error) {
    console.warn("DB Read failed (Vercel runtime), falling back to defaults.");
  }
  
  // Sanitize colors to prevent CSS injection attacks
  const primaryColor = sanitizeColor(settings?.primaryColor || '#1B2A4A')
  const secondaryColor = sanitizeColor(settings?.secondaryColor || '#D4A520')

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen relative">
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: ${primaryColor};
            --color-secondary: ${secondaryColor};
          }
        `}} />
        <RecruiterPopup />
        
        {/* Floating Contact Button */}
        <Link 
          href="/contact"
          className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-2xl shadow-primary/30 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 group flex items-center justify-center border-2 border-white/20"
          title="Contact Placement Cell"
        >
          <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
        </Link>

        <header className="bg-[#0a1628]/95 backdrop-blur-md border-b border-secondary/40 shadow-sm sticky top-0 z-40 transition-all duration-300">
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
            <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-white/80 w-full lg:w-auto overflow-x-auto hide-scrollbar pb-1 lg:pb-0 justify-center lg:justify-end">
              <Link href="/" className="hover:text-secondary transition-colors whitespace-nowrap">Home</Link>
              <Link href="/courses" className="hover:text-secondary transition-colors whitespace-nowrap">Programs</Link>
              <Link href="/faculty" className="hover:text-secondary transition-colors whitespace-nowrap"><span className="hidden sm:inline">Leadership & </span>Faculty</Link>
              <Link href="/contact" className="hover:text-secondary transition-colors whitespace-nowrap">Contact Us</Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow relative z-10">
          {children}
        </main>

                <footer id="footer-contact" className="bg-white border-t border-gray-200 mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              
              {/* Branding & Contact */}
              <div>
                <h2 className="text-primary font-black text-xl mb-1">NFSU Delhi</h2>
                <p className="text-[10px] text-gray-500 mb-4 uppercase tracking-widest font-bold">Placement Cell</p>
                <div className="space-y-2 text-sm text-gray-600 font-medium">
                  <p className="flex items-center text-primary-dark font-bold text-sm mb-1">
                    <User className="w-4 h-4 mr-2 text-secondary-dark" />
                    {settings?.coordinatorName || 'Prof. Dr. Ajit Muzumdar'}
                  </p>
                  <p className="flex items-start text-xs">
                    <MapPin className="w-4 h-4 mr-2 text-secondary-dark shrink-0 mt-0.5" />
                    <span>LNJN NICFS NFSU, Rohini Sector 3,<br />New Delhi - 110085</span>
                  </p>
                  <p className="flex items-center text-xs">
                    <Phone className="w-4 h-4 mr-2 text-secondary-dark shrink-0" />
                    <a href={`tel:${settings?.contactPhone || '+91 94230 57857'}`} className="hover:text-primary transition-colors">{settings?.contactPhone || '+91 94230 57857'}</a>
                  </p>
                  <p className="flex items-center text-xs">
                    <Mail className="w-4 h-4 mr-2 text-secondary-dark shrink-0" />
                    <a href={`mailto:${settings?.contactEmail || 'placement_dc@nfsu.ac.in'}`} className="hover:text-primary transition-colors">{settings?.contactEmail || 'placement_dc@nfsu.ac.in'}</a>
                  </p>
                </div>
              </div>

              {/* Responsive Map */}
              <div className="h-48 lg:h-44 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
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
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center h-48 lg:h-44">
                <h3 className="text-primary font-bold mb-1 text-xs uppercase tracking-wider">Recruiter Interest</h3>
                <p className="text-[10px] text-gray-500 mb-3 leading-tight">Leave your details and our placement team will reach out to you.</p>
                <FooterInterestForm />
              </div>

            </div>
          </div>
          
          {/* Copyright Bar */}
          <div className="border-t border-gray-100 bg-gray-50 py-3">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 font-medium">
              <p className="text-center md:text-left mb-2 md:mb-0">© {new Date().getFullYear()} National Forensic Sciences University, Delhi Campus. All rights reserved.</p>
              <p className="text-center md:text-right">
                Designed & Developed by{' '}
                <a 
                  href="https://www.linkedin.com/in/5h1Vm" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300 font-bold"
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
