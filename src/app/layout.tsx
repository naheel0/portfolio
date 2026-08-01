import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { PT_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import AuroraOrbs from "@/components/AuroraOrbs";

const ptMono = PT_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pt-mono",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Naheel Muhammed PK | Full Stack Developer Portfolio",
    template: "%s | Naheel Muhammed PK",
  },
  description:
    "Portfolio of Naheel Muhammed PK — Full Stack Developer from Kerala, India. Specializing in React, Next.js, .NET, C#, ASP.NET, SQL Server and modern web development.",
  keywords: [
    "Naheel Muhammed",
    "Naheel Muhammed PK",
    "Full Stack Developer",
    "web developer",
    "portfolio",
    "React",
    "Next.js",
    ".NET",
    "C#",
    "ASP.NET",
    "SQL Server",
    "JavaScript",
    "TypeScript",
    "Kerala",
    "India",
  ],
  authors: [{ name: "Naheel Muhammed PK" }],
  creator: "Naheel Muhammed PK",
  publisher: "Naheel Muhammed PK",
  category: "Technology",
  applicationName: "Naheel Muhammed PK — Portfolio",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Naheel Muhammed PK",
    title: "Naheel Muhammed PK | Full Stack Developer Portfolio",
    description:
      "Full Stack Developer specializing in React, Next.js, .NET, C# and modern web technologies. Based in Kerala, India.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Naheel Muhammed PK — Full Stack Developer (.NET + React)",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naheel Muhammed PK | Full Stack Developer Portfolio",
    description:
      "Full Stack Developer specializing in React, Next.js, .NET, C# and modern web technologies.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },

};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Naheel Muhammed PK",
  url: BASE_URL,
  image: `${BASE_URL}/avatar.svg`,
  jobTitle: "Full Stack Developer",
  email: "hello@naheel.me",
  telephone: "+91-7306912910",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/naheel0",
    "https://www.linkedin.com/in/naheel-muhammed",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    ".NET",
    "C#",
    "ASP.NET",
    "SQL Server",
    "Web Development",
    "Full Stack Development",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Bachelor of Computer Applications",
  },
};

export const viewport = {
  themeColor: "#060818",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/avatar.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={ptMono.variable}>
        <CustomCursor />
        <AuroraOrbs />
        <MotionConfig reducedMotion="user">
          <div className="app-layout">
            <Navbar />
            <div className="app-main">{children}</div>
            <Footer />
          </div>
        </MotionConfig>
      </body>
    </html>
  );
}
