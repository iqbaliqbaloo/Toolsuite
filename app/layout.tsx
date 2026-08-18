import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://toolsuite-bice.vercel.app'),
  title: {
    default: 'ToolSuite — Free Online Productivity Tools',
    template: '%s | ToolSuite',
  },
  description: 'A focused suite of 30 browser-first productivity, calculator, developer, generator, image, PDF, and text tools.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'ToolSuite',
    url: 'https://toolsuite-bice.vercel.app/',
    title: 'ToolSuite — Free Online Productivity Tools',
    description: 'Useful browser-first tools with transparent results and practical guidance.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolSuite — Free Online Productivity Tools',
    description: '30 useful browser-first tools for everyday work.',
  },
  robots: { index: true, follow: true },
};

const themeScript = `(()=>{try{const s=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',s!=='light')}catch{document.documentElement.classList.add('dark')}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body><script dangerouslySetInnerHTML={{ __html: themeScript }} />{children}</body></html>;
}
