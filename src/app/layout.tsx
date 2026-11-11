import type { Metadata } from "next";
import { Barlow_Condensed, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import WelcomeScreen from "@/components/WelcomeScreen";
import AuroraOrbs from "@/components/AuroraOrbs";
import { getSettings } from "@/lib/api";
import { Analytics } from "@vercel/analytics/next";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "700", "800"],
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600"],
  display: "swap",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";
const API_HOST = new URL(process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me").origin;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s.name || "Naheel Muhammed PK";
  const title = s.title || "Full Stack Developer";
  const autoTitle = `${name} | ${title} Portfolio`;
  const autoDesc = s.bio || `Portfolio of ${name}, ${title} from Kerala, India.`;
  // Manual override from the admin SEO form; automatic assembly stays the fallback.
  const pageTitle = s.metaTitle || autoTitle;
  const pageDesc = s.metaDescription || autoDesc;
  const ogImage = s.ogImage || "/og-image.png";
  const ogImageUrl = ogImage.startsWith("/") ? `${BASE_URL}${ogImage}` : ogImage;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: pageTitle,
      template: `%s | ${name}`,
    },
    description: pageDesc,
    authors: [{ name }],
    creator: name,
    publisher: name,
    category: "Technology",
    applicationName: `${name} | Portfolio`,
    formatDetection: { telephone: true, email: true, address: true },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: BASE_URL,
      siteName: name,
      title: pageTitle,
      description: pageDesc,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${name} | ${title}` }],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: pageTitle,
      description: pageDesc,
      images: [{ url: ogImageUrl, alt: `${name} | ${title}` }],
    },
    keywords: [name, title, ...(s.roles || []), "Portfolio", "Web Developer", "Kerala", "India"],
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    alternates: {
      canonical: BASE_URL,
      types: { "application/rss+xml": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me"}/rss.xml` },
    },
    verification: {
      ...(s.googleVerification ? { google: s.googleVerification } : {}),
    },
    ...(s.bingVerification ? { other: { "msvalidate.01": s.bingVerification } } : {}),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const name = s.name || "Naheel Muhammed PK";
  const title = s.title || "Full Stack Developer";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: BASE_URL,
    jobTitle: title,
    ...(s.email ? { email: s.email } : {}),
    ...(s.phone ? { telephone: s.phone } : {}),
    sameAs: [s.github, s.linkedin].filter(Boolean),
    knowsAbout: s.roles || [],
    ...(s.avatar ? { image: s.avatar.startsWith("/") ? `${BASE_URL}${s.avatar}` : s.avatar } : {}),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${name} — Portfolio`,
    url: BASE_URL,
    author: { "@type": "Person", name },
    description: s.bio || `Portfolio of ${name}, ${title} from Kerala, India.`,
    inLanguage: "en-US",
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#060818" />
        <link rel="icon" href="/icon.svg" />
        <link rel="preconnect" href={API_HOST} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body className={`${barlow.variable} ${inter.variable} ${spaceMono.variable}`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <WelcomeScreen />
        <AuroraOrbs />
        <div className="app-layout">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
