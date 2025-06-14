import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Webb3Fitty - Software Engineering',
  description: 'Get in touch with Webb3Fitty for your next web development project. View pricing, schedule a meeting, or connect via social media for Web3 and AI development solutions.',
  keywords: ['webb3fitty', 'contact', 'hire engineering', 'web development pricing', 'React Engineering', 'Next.js Engineering', 'web3 development', 'ai development'],
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
    title: 'Contact | Webb3Fitty - Software Engineering',
    description: 'Ready to bring your ideas to life? Contact Webb3Fitty for custom web development solutions in Web3 and AI.',
    type: 'website',
    locale: "en_US",
    url: 'https://webb3fitty.dev/contact',
    siteName: "Webb3Fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        width: 1200,
        height: 630,
        alt: "Contact Webb3Fitty - Software Engineering",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Webb3Fitty - Software Engineering',
    description: 'Get in touch for your next web development project. Web3 and AI development solutions.',
    creator: "@webb3fitty",
    site: "@webb3fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        alt: "Contact Webb3Fitty - Software Engineering",
      }
    ],
  },

  // Additional metadata
  alternates: {
    canonical: "https://webb3fitty.dev/contact",
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

  // Contact specific metadata
  other: {
    'contact:author': 'Webb3Fitty',
    'contact:services': 'Web3,AI,React,Next.js,Development',
    'contact:pricing': 'hourly,project-based',
    'content:type': 'contact',
  },
};
const ContactPage = () => {
    return (
        <div className="min-h-screen px-4 py-20 text-white bg-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="mb-8 text-4xl font-bold text-center text-transparent md:text-6xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                    Get In Touch
                </h1>
                
                <div className="grid gap-12 md:grid-cols-2">
                    {/* Pricing Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-purple-400">Pricing</h2>
                        <div className="p-6 bg-gray-900 border rounded-lg border-purple-500/20">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-cyan-400">Hourly Rate</h3>
                                    <p className="text-gray-300">$100 - $150 per hour</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-cyan-400">Project Based</h3>
                                    <p className="text-gray-300">Custom pricing based on scope and complexity</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Methods */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-purple-400">Contact Methods</h2>
                        <div className="space-y-4">
                            {/* Calendly */}
                            <div className="p-6 bg-gray-900 border rounded-lg border-purple-500/20">
                                <h3 className="mb-2 text-lg font-medium text-cyan-400">Schedule a Meeting</h3>
                                <a 
                                    href="https://calendly.com/reisscoding/new-meeting?preview_source=et_card"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-2 text-white transition-opacity rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-80"
                                >
                                    Book on Calendly
                                </a>
                            </div>

                            {/* X (Twitter) */}
                            <div className="p-6 bg-gray-900 border rounded-lg border-purple-500/20">
                                <h3 className="mb-2 text-lg font-medium text-cyan-400">X (Twitter)</h3>
                                <p className="mb-2 text-sm text-yellow-400">⚠️ Make sure to follow to DM</p>
                                <a 
                                    href="https://x.com/Webb3Fitty"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-2 text-white transition-colors bg-black border border-gray-600 rounded-lg hover:border-gray-400"
                                >
                                    @Webb3Fitty
                                </a>
                            </div>

                            {/* Telegram */}
                            <div className="p-6 bg-gray-900 border rounded-lg border-purple-500/20">
                                <h3 className="mb-2 text-lg font-medium text-cyan-400">Telegram</h3>
                                <p className="mb-2 text-sm text-red-400">⚠️ Probably will not see your message</p>
                                <a 
                                    href="https://t.me/treefitty"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                                >
                                    @treefitty
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="max-w-2xl mx-auto text-gray-400">
                        Ready to bring your ideas to life? Let&apos;s discuss your project and create something amazing together. 
                        Choose your preferred contact method above to get started.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;