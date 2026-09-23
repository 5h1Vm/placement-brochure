import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a standard Google Drive view link into a direct download/image URL
 * e.g. https://drive.google.com/file/d/1aBcD.../view?usp=sharing -> https://drive.google.com/uc?export=view&id=1aBcD...
 */
export function getDirectDriveLink(url: string | null | undefined): string | null {
  if (!url) return null
  
  try {
    const driveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)\//
    const match = url.match(driveRegex)
    
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`
    }
    
    // If it's already a direct link or not a google drive link, return as is
    return url
  } catch (e) {
    return url
  }
}
