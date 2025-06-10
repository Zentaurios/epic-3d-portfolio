import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Blog - Webb3Fitty | Web3, AI & Development Insights",
  description: "Read Webb3Fitty's technical blog covering Web3 development, AI integration, blockchain technology, React/Next.js tutorials, and cutting-edge programming insights. Deep technical articles and industry analysis.",
  keywords: ["webb3fitty", "web3 blog", "ai development", "blockchain tutorials", "react nextjs", "three.js guides", "smart contracts", "defi development", "technical articles", "programming insights"],
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
    title: "Technical Blog - Webb3Fitty | Web3, AI & Development Insights",
    description: "Read Webb3Fitty's technical blog covering Web3 development, AI integration, blockchain technology, and cutting-edge programming insights with deep technical articles.",
    type: "website",
    locale: "en_US",
    url: "https://webb3fitty.dev/blog",
    siteName: "Webb3Fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        width: 1200,
        height: 630,
        alt: "Webb3Fitty Technical Blog - Web3, AI & Development Insights",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Technical Blog - Webb3Fitty | Web3, AI & Development Insights",
    description: "Read Webb3Fitty's technical blog covering Web3 development, AI integration, blockchain technology, and cutting-edge programming insights.",
    creator: "@webb3fitty",
    site: "@webb3fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        alt: "Webb3Fitty Technical Blog - Web3, AI & Development Insights",
      }
    ],
  },

  // Additional metadata
  alternates: {
    canonical: "https://webb3fitty.dev/blog",
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

  // Blog specific metadata
  other: {
    'blog:author': 'Webb3Fitty',
    'blog:topics': 'Web3,AI,Blockchain,Development,Programming',
    'blog:type': 'technical',
    'content:type': 'blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
