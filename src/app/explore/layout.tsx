import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Projects - Webb3Fitty | Interactive 3D Portfolio",
  description: "Explore Webb3Fitty's cutting-edge Web3, AI, and blockchain projects. Interactive 3D showcase featuring real-time demos, technical deep-dives, and innovative solutions in decentralized technology.",
  keywords: ["webb3fitty", "web3 projects", "blockchain portfolio", "ai applications", "three.js demos", "react projects", "nextjs portfolio", "defi", "smart contracts", "interactive demos"],
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
    title: "Explore Projects - Webb3Fitty | Interactive 3D Portfolio",
    description: "Dive into Webb3Fitty's innovative Web3 and AI projects. Experience interactive 3D demonstrations of blockchain applications, smart contracts, and cutting-edge development solutions.",
    type: "website",
    locale: "en_US",
    url: "https://webb3fitty.dev/explore",
    siteName: "Webb3Fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        width: 1200,
        height: 630,
        alt: "Webb3Fitty Explore Projects - Interactive 3D Web3 Portfolio",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Explore Projects - Webb3Fitty | Interactive 3D Portfolio",
    description: "Dive into Webb3Fitty's innovative Web3 and AI projects. Experience interactive 3D demonstrations of blockchain applications and cutting-edge solutions.",
    creator: "@webb3fitty",
    site: "@webb3fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        alt: "Webb3Fitty Explore Projects - Interactive 3D Web3 Portfolio",
      }
    ],
  },

  // Additional metadata
  alternates: {
    canonical: "https://webb3fitty.dev/explore",
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

  // Projects specific metadata
  other: {
    'portfolio:author': 'Webb3Fitty',
    'portfolio:type': 'projects',
    'projects:technologies': 'Web3,AI,Blockchain,React,Next.js,Three.js',
    'projects:interactive': 'true',
    'content:type': 'portfolio',
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
