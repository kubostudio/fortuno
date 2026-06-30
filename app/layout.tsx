import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/app/components/layout/Header/Header";
import Footer from "@/app/components/layout/Footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fortuno.pe"),

  title: {
    default: "Fortuno | Herramientas gratuitas para sorteos online",
    template: "%s | Fortuno",
  },

  description:
    "Herramientas gratuitas para sorteos, ruletas, amigo secreto, generadores aleatorios, grupos, juegos y mucho más.",

  applicationName: "Fortuno",

  keywords: [
    "sorteos",
    "ruleta",
    "amigo secreto",
    "generador aleatorio",
    "ruleta de nombres",
    "número aleatorio",
    "grupos aleatorios",
    "fortuno",
    "herramientas gratis",
  ],

  authors: [
    {
      name: "Fortuno",
    },
  ],

  creator: "Fortuno",

  publisher: "Fortuno",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://fortuno.pe",
    siteName: "Fortuno",
    title: "Fortuno",
    description:
      "Herramientas gratuitas para sorteos online, ruletas, amigo secreto, grupos, juegos y generadores aleatorios.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fortuno - Herramientas gratuitas para sorteos online",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Fortuno",
    description:
      "Herramientas gratuitas para sorteos online y decisiones aleatorias.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  other: {
    "google-adsense-account": "ca-pub-5001860173711402",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5001860173711402"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Header />
        {children}
        <Footer />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}