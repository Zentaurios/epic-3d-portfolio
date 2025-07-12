import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { UnifiedScrollProvider } from "@/components/providers/UnifiedScrollProvider";
import { ServiceWorkerProvider } from "@/components/providers/ServiceWorkerProvider";
import { MobileDetectionProvider } from "@/components/providers/MobileDetectionProvider";
import { LayeredBrainSystem } from "@/components/3d/LayeredBrainSystem";
import { BrainNavigationDemo } from "@/components/layout/BrainNavigationDemo";
import { SectionNavigation } from "@/components/layout/SectionNavigation";
import { AIAgentProvider, AIAgentButton, AIAgentChat } from "@/components/ai-agent";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap", 
  fallback: ["ui-monospace", "SFMono-Regular", "Monaco", "Consolas"],
});

export const metadata: Metadata = {
  title: "Webb3Fitty - Revolutionary Web3 & AI Developer",
  description: "Legendary 3D portfolio showcasing cutting-edge web development, Web3 innovations, and AI applications. Experience the future of web development in an immersive 3D brain universe.",
  keywords: ["web3", "ai", "developer", "portfolio", "blockchain", "nextjs", "react", "three.js", "webb3fitty", "3d portfolio"],
  authors: [{ name: "Webb3Fitty" }],
  creator: "Webb3Fitty",
  publisher: "Webb3Fitty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // OpenGraph metadata
  openGraph: {
    title: "Webb3Fitty - Revolutionary Web3 & AI Developer",
    description: "Experience a legendary 3D portfolio showcasing cutting-edge web development in a brain universe.",
    type: "website",
    locale: "en_US",
    url: "https://webb3fitty.dev",
    siteName: "Webb3Fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        width: 1200,
        height: 630,
        alt: "Webb3Fitty - Revolutionary Web3 & AI Developer",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Webb3Fitty - Revolutionary Web3 & AI Developer",
    description: "Experience a legendary 3D portfolio showcasing cutting-edge web development in a brain universe.",
    creator: "@webb3fitty",
    site: "@webb3fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        alt: "Webb3Fitty - Revolutionary Web3 & AI Developer",
      }
    ],
  },

  // Additional metadata
  alternates: {
    canonical: "https://webb3fitty.dev",
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    // Add Google Search Console verification if needed
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true, // Allow user scaling for accessibility
  themeColor: "#8B5CF6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate structured data for the homepage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Webb3Fitty',
    description: 'Revolutionary Web3 & AI Developer Portfolio',
    url: 'https://webb3fitty.dev',
    author: {
      '@type': 'Person',
      name: 'Webb3Fitty',
      url: 'https://webb3fitty.dev',
      sameAs: [
        'https://twitter.com/webb3fitty',
        'https://github.com/webb3fitty'
      ]
    },
    publisher: {
      '@type': 'Organization',
      name: 'Webb3Fitty',
      url: 'https://webb3fitty.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://webb3fitty.dev/webb3fitty.png',
        width: 60,
        height: 60,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://webb3fitty.dev/explore?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    mainEntity: {
      '@type': 'Person',
      name: 'Webb3Fitty',
      jobTitle: 'Web3 & AI Developer',
      description: 'Revolutionary developer specializing in Web3 innovations and AI applications',
      url: 'https://webb3fitty.dev',
      knowsAbout: ['Web3', 'AI', 'Blockchain', 'React', 'Next.js', 'Three.js'],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Software Developer',
        occupationalCategory: 'Web Development',
        skills: ['Web3', 'AI', 'Blockchain', 'React', 'Next.js', 'Three.js']
      }
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    isFamilyFriendly: true,
  }

  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#8B5CF6" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased text-white w-full`}
        style={{ 
          background: 'transparent',
          overflow: 'auto',
          height: 'auto',
          minHeight: '100vh'
        }}
      >
        <ServiceWorkerProvider />
        <MobileDetectionProvider>
          <AIAgentProvider>
            <UnifiedScrollProvider>
              {/* Layered Brain System - Real anatomical brain with z-index layering */}
              <LayeredBrainSystem>
                <div className="relative z-10 main-layout-wrapper">
                  {children}
                </div>
              </LayeredBrainSystem>
              
              {/* Brain Navigation Interface */}
              <div className="brain-nav" data-lenis-prevent>
                <BrainNavigationDemo />
              </div>
              
              {/* Section Navigation */}
              <SectionNavigation />
              
              {/* AI Agent Interface */}
              <AIAgentButton />
              <AIAgentChat />
            
            </UnifiedScrollProvider>
          </AIAgentProvider>
        </MobileDetectionProvider>
      </body>
    </html>
  );
}
