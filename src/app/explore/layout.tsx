import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Projects - Webb3Fitty | Interactive 3D Portfolio",
  description: "Explore Webb3Fitty's cutting-edge Web3, AI, and blockchain projects. Interactive 3D showcase featuring real-time demos, technical deep-dives, and innovative solutions in decentralized technology.",
  keywords: ["web3 projects", "blockchain portfolio", "ai applications", "three.js demos", "react projects", "nextjs portfolio", "defi", "smart contracts", "interactive demos"],
  openGraph: {
    title: "Explore Projects - Webb3Fitty | Interactive 3D Portfolio",
    description: "Dive into Webb3Fitty's innovative Web3 and AI projects. Experience interactive 3D demonstrations of blockchain applications, smart contracts, and cutting-edge development solutions.",
    type: "website",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        width: 1200,
        height: 630,
        alt: "Webb3Fitty Explore Projects - Interactive 3D Web3 Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Projects - Webb3Fitty | Interactive 3D Portfolio",
    description: "Dive into Webb3Fitty's innovative Web3 and AI projects. Experience interactive 3D demonstrations of blockchain applications and cutting-edge solutions.",
    images: ["https://webb3fitty.dev/webb3fitty.png"],
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
