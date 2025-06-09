import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Blog - Webb3Fitty | Web3, AI & Development Insights",
  description: "Read Webb3Fitty's technical blog covering Web3 development, AI integration, blockchain technology, React/Next.js tutorials, and cutting-edge programming insights. Deep technical articles and industry analysis.",
  keywords: ["web3 blog", "ai development", "blockchain tutorials", "react nextjs", "three.js guides", "smart contracts", "defi development", "technical articles", "programming insights"],
  openGraph: {
    title: "Technical Blog - Webb3Fitty | Web3, AI & Development Insights",
    description: "Read Webb3Fitty's technical blog covering Web3 development, AI integration, blockchain technology, and cutting-edge programming insights with deep technical articles.",
    type: "website",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        width: 1200,
        height: 630,
        alt: "Webb3Fitty Technical Blog - Web3, AI & Development Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Blog - Webb3Fitty | Web3, AI & Development Insights",
    description: "Read Webb3Fitty's technical blog covering Web3 development, AI integration, blockchain technology, and cutting-edge programming insights.",
    images: ["https://webb3fitty.dev/webb3fitty.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
