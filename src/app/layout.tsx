import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ServiceWorkerProvider } from "@/components/providers/ServiceWorkerProvider";
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
  description: "Legendary 3D portfolio showcasing cutting-edge web development, Web3 innovations, and AI applications. Experience the future of web development in an emmersive experience.",
  keywords: ["web3", "ai", "developer", "portfolio", "blockchain", "nextjs", "react", "three.js"],
  authors: [{ name: "Webb3Fitty" }],
  creator: "Webb3Fitty",
  openGraph: {
    title: "Webb3Fitty - Revolutionary Web3 & AI Developer",
    description: "Experience a legendary 3D portfolio showcasing cutting-edge web development in a brain universe.",
    type: "website",
    locale: "en_US",
    url: "https://webb3fitty.dev",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        width: 1200,
        height: 630,
        alt: "Webb3Fitty - Revolutionary Web3 & AI Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Webb3Fitty - Revolutionary Web3 & AI Developer",
    description: "Experience a legendary 3D portfolio showcasing cutting-edge web development in a brain universe.",
    creator: "@webb3fitty",
    site: "https://webb3fitty.dev",
    images: ["https://webb3fitty.dev/webb3fitty.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    // Add Google Search Console verification if needed
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#8B5CF6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#8B5CF6" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased text-white overflow-x-hidden w-full min-h-screen`}
        style={{ background: 'transparent' }}
      >
        <ServiceWorkerProvider />
        <AIAgentProvider>
          <SmoothScrollProvider>
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
          </SmoothScrollProvider>
        </AIAgentProvider>
      </body>
    </html>
  );
}
