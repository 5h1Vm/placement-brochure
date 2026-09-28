import { prisma } from '@/lib/prisma'
import { User, MapPin, Phone, Mail, Building, Globe, ExternalLink } from 'lucide-react'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'


export default async function ContactPage() {
  const settings = await prisma.platformSettings.findUnique({
    where: { id: 'default' }
  })

  const coordinatorName = settings?.coordinatorName || 'Prof. Dr. Ajit Muzumdar'
  
  // Try to find the coordinator's photo dynamically
  const lastName = coordinatorName.split(' ').pop() || ''
  const coordinator = await prisma.faculty.findFirst({
    where: { name: { contains: lastName } }
  })
  const coordinatorPhoto = coordinator?.imageUrl

  return (
    <div 
      className="min-h-screen relative py-12 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: "url('/collegephoto2.png')" }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-0" />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary-light font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3">Contact Us</h1>
          <p className="text-gray-600 text-lg">Get in touch with the NFSU Delhi Placement Cell</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Contact Details & Map */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Placement Cell Details</h2>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  {coordinatorPhoto ? (
                    <img src={coordinatorPhoto} alt={coordinatorName} className="w-12 h-12 rounded-full object-cover border-2 border-secondary shadow-sm mr-4 shrink-0" />
                  ) : (
                    <div className="bg-secondary/10 p-3 rounded-full mr-4 shrink-0">
                      <User className="w-6 h-6 text-secondary-dark" />
                    </div>
                  )}
                  <div className="pt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Placement Coordinator</p>
                    <p className="text-lg font-bold text-primary-dark leading-tight">{coordinatorName}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-secondary/10 p-3 rounded-full mr-4 shrink-0">
                    <Mail className="w-6 h-6 text-secondary-dark" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                    <a href={`mailto:${settings?.contactEmail || 'placement_dc@nfsu.ac.in'}`} className="text-lg font-bold text-primary-dark hover:text-secondary-dark transition-colors break-all">
                      {settings?.contactEmail || 'placement_dc@nfsu.ac.in'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-secondary/10 p-3 rounded-full mr-4 shrink-0">
                    <Phone className="w-6 h-6 text-secondary-dark" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                    <a href={`tel:${settings?.contactPhone || '+91 94230 57857'}`} className="text-lg font-bold text-primary-dark hover:text-secondary-dark transition-colors">
                      {settings?.contactPhone || '+91 94230 57857'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-secondary/10 p-3 rounded-full mr-4 shrink-0">
                    <MapPin className="w-6 h-6 text-secondary-dark" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Campus Address</p>
                    <p className="text-base font-bold text-primary-dark leading-relaxed">
                      LNJN NICFS, National Forensic Sciences University<br />
                      Sector 3, Rohini, New Delhi - 110085
                    </p>
                  </div>
                </div>
              </div>
              
              {/* WhatsApp Quick Connect */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Instant Connect</p>
                <a 
                  href={`https://wa.me/${(settings?.contactPhone || '919423057857').replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hi! I wanted to know more about the Placement Process at NFSU Delhi.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-2.5 px-5 rounded-full transition-colors shadow-sm shadow-[#25D366]/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Hiring Process */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-lg rounded-2xl p-8">
              <h2 className="text-xl font-bold text-primary mb-6">Standard Hiring Process</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-2">
                    <h3 className="font-bold text-primary-dark">Connect & Express Interest</h3>
                    <p className="text-sm text-gray-600 mt-1">Connect with us to share your hiring requirements.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-2">
                    <h3 className="font-bold text-primary-dark">Pre-Placement Talk (PPT)</h3>
                    <p className="text-sm text-gray-600 mt-1">Engage with our students, share your company vision and role details.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-dark">Assessments & Interviews</h3>
                    <p className="text-sm text-gray-600 mt-1">Conduct online/offline tests and interviews to select the best talents suited to your needs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Large Map */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-lg rounded-2xl p-3 h-80">
              <div className="w-full h-full rounded-xl overflow-hidden">
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
            </div>
          </div>

          {/* Right Column: Interest Form & Hiring Process */}
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-lg rounded-2xl p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Partner With Us</h2>
                </div>
                <p className="text-gray-600">Leave your details below and our placement coordination team will reach out to schedule a discussion.</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="h-[1050px] md:h-[1200px] relative w-full">
                  <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLSfWaX2mVsuBmoa5PWM6CflFcVzWRX1Hfnwx7dRFE1dT8araMw/viewform?embedded=true" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    title="Recruiter Interest Form"
                  >
                    Loading…
                  </iframe>
                </div>
                <div className="bg-gray-50 border-t border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="bg-white border border-gray-200 p-2.5 rounded-lg shrink-0 shadow-sm">
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-primary-dark leading-tight">Having trouble viewing the form?</p>
                      <p className="text-xs text-gray-500 mt-0.5">Open it directly in Google Forms</p>
                    </div>
                  </div>
                  <a 
                    href="https://forms.gle/FdCYgy8NvEUuEUTJ6" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full sm:w-auto text-center bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors shadow-sm shrink-0 whitespace-nowrap"
                  >
                    Open Direct Link
                  </a>
                </div>
              </div>
            </div>

                      </div>

        </div>
      </div>
    </div>
  )
}
