import { Metadata } from 'next'
import BrainSystemDemo from '@/components/3d/BrainSystemDemo'

export const metadata: Metadata = {
  title: 'Layered Brain System Demo | Webb3Fitty',
  description: 'Interactive demonstration of the anatomical 3D brain system with z-index layering. Experience the cutting-edge neural network visualization technology.',
  keywords: ['webb3fitty', 'brain demo', '3d brain', 'neural network', 'interactive', 'three.js', 'anatomical', 'visualization', 'demo'],
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
    title: 'Layered Brain System Demo | Webb3Fitty',
    description: 'Interactive demonstration of the anatomical 3D brain system with z-index layering and neural network visualization.',
    type: 'website',
    locale: "en_US",
    url: 'https://webb3fitty.dev/brain-demo',
    siteName: "Webb3Fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        width: 1200,
        height: 630,
        alt: "Layered Brain System Demo | Webb3Fitty",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Layered Brain System Demo | Webb3Fitty',
    description: 'Interactive demonstration of the anatomical 3D brain system with neural network visualization.',
    creator: "@webb3fitty",
    site: "@webb3fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        alt: "Layered Brain System Demo | Webb3Fitty",
      }
    ],
  },

  // Additional metadata
  alternates: {
    canonical: "https://webb3fitty.dev/brain-demo",
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

  // Demo specific metadata
  other: {
    'demo:author': 'Webb3Fitty',
    'demo:type': '3D Brain System',
    'demo:technology': 'Three.js,React,Neural Networks',
    'demo:interactive': 'true',
    'content:type': 'demo',
  },
}

export default function BrainDemoPage() {
  return <BrainSystemDemo />
}
