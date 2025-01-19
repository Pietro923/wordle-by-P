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

// Definimos los metadatos para cada idioma
const dictionaries = {
  es: {
    title: 'Wordle by P - Un juego de palabras diario',
    description: 'Adivina la palabra oculta en 6 intentos. Un nuevo desafío cada día.',
    ogImageAlt: 'Wordle by P - Juego de palabras diario',
  },
  en: {
    title: 'Wordle by P - A daily word game',
    description: 'Guess the hidden word in 6 tries. A new challenge every day.',
    ogImageAlt: 'Wordle by P - Daily word game',
  }
};

// Función para generar los metadatos según el idioma
export async function generateMetadata(
  { params }: { params: { lang: 'es' | 'en' } }
): Promise<Metadata> {
  // Obtenemos las traducciones según el idioma
  const dict = dictionaries[params.lang ?? 'es'];

  // Define keywords para cada idioma
  const keywords = {
    es: [
      'Wordle',
      'Juego de palabras',
      'Juego diario',
      'Puzzle',
      'Acertijos',
      'Adivinar palabras',
      'Juego en español',
      'Juego gratuito',
      'Wordle en español',
    ],
    en: [
      'Wordle',
      'Word game',
      'Daily puzzle',
      'Word puzzle',
      'Brain teaser',
      'Word guessing',
      'Free game',
      'Online game',
      'Daily word game',
    ]
  };

  return {
    title: dict.title,
    description: dict.description,
    keywords: keywords[params.lang],
    icons: {
      icon: '/favicon.ico',
    },
    
    openGraph: {
      type: 'website',
      url: 'https://wordle-by-p.vercel.app/',
      title: dict.title,
      description: dict.description,
      siteName: dict.title,
      locale: params.lang,
      alternateLocale: params.lang === 'es' ? 'en' : 'es',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: dict.ogImageAlt,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.title,
      description: dict.description,
      images: ['/og-image.png'],
    },
    // Agregamos alternativas de idioma
    alternates: {
      languages: {
        'es': '/es',
        'en': '/en',
      },
    },
  };
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: 'es' | 'en' };
}>) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-neutral-900 text-black dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}