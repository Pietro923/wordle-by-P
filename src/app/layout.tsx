import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Wordle by P - A daily word game',
  description: 'Guess the hidden word in 6 tries. A new challenge every day.',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: [
    'Wordle',
    'Word game',
    'Daily puzzle',
    'Word puzzle',
    'Brain teaser',
    'Word guessing',
    'Free game',
    'Online game',
    'Daily word game',
  ],
  openGraph: {
    type: 'website',
    url: 'https://wordle-by-p.vercel.app/',
    title: 'Wordle by P - A daily word game',
    description: 'Guess the hidden word in 6 tries. A new challenge every day.',
    siteName: 'Wordle by P',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Wordle by P - Daily word game',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wordle by P - A daily word game',
    description: 'Guess the hidden word in 6 tries. A new challenge every day.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-neutral-900 text-black dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}