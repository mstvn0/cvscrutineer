import type { Metadata } from 'next';
import { IBM_Plex_Mono, Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'CVScrutineer — See why the resume robot rejected you',
  description:
    'See why the resume robot rejected you—and fix it. ATS knockout, vector drift, and recruiter Boolean forensics.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="flex h-dvh min-h-0 flex-col overflow-hidden bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}
