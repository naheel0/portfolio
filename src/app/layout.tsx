import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { PT_Mono } from "next/font/google";
import "./globals.css";

const ptMono = PT_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pt-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.naheel.me"),
  title: {
    default: "Naheel Muhammed PK | Full Stack Developer Portfolio",
    template: "%s | Naheel Muhammed PK",
  },
  description:
    "Portfolio of Naheel Muhammed PK — Full Stack Developer from Kerala, India. Specializing in React, Next.js, .NET, C#, ASP.NET, SQL Server and modern web development.",
  keywords: [
    "Naheel Muhammed",
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
    "Kerala",
    "India",
  ],
  authors: [{ name: "Naheel Muhammed PK" }],
  creator: "Naheel Muhammed PK",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.naheel.me",
    siteName: "Naheel Muhammed PK",
    title: "Naheel Muhammed PK | Full Stack Developer Portfolio",
    description:
      "Full Stack Developer specializing in React, Next.js, .NET, C# and modern web technologies. Based in Kerala, India.",
    images: [
      {
        url: "/images/about.png",
        width: 380,
        height: 380,
        alt: "Naheel Muhammed PK — Full Stack Developer",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naheel Muhammed PK | Full Stack Developer Portfolio",
    description:
      "Full Stack Developer specializing in React, Next.js, .NET, C# and modern web technologies.",
    images: ["/images/about.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://www.naheel.me",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Naheel Muhammed PK",
  url: "https://www.naheel.me",
  image: "https://www.naheel.me/avatar.svg",
  jobTitle: "Full Stack Developer",
  email: "naheelmuhammedpk@gmail.com",
  address: { "@type": "PostalAddress", addressRegion: "Kerala", addressCountry: "IN" },
  sameAs: [
    "https://github.com/naheel0",
    "https://www.linkedin.com/in/naheel-muhammed",
  ],
  knowsAbout: [
    "React", "Next.js", "JavaScript", "HTML", "CSS",
    ".NET", "C#", "ASP.NET", "SQL Server", "Web Development",
  ],
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
      <body className={`${ptMono.variable}`}>
        <a href="#home" className="skip-link">Skip to main content</a>
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
