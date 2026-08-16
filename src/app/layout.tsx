import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuroraOrbs from "@/components/AuroraOrbs";
import WelcomeScreen from "@/components/WelcomeScreen";
import { getSettings } from "@/lib/api";

const ptMono = localFont({
  src: "../fonts/pt-mono-latin.woff2",
  variable: "--font-pt-mono",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";
const API_HOST = new URL(process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me").origin;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s.name || "Naheel Muhammed PK";
  const title = s.title || "Full Stack Developer";
  const desc = s.bio || `Portfolio of ${name} — ${title} from Kerala, India.`;
  const ogImage = s.ogImage || "/og-image.png";
  const avatar = s.avatar || "/avatar.svg";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `${name} | ${title} Portfolio`,
      template: `%s | ${name}`,
    },
    description: desc,
    authors: [{ name }],
    creator: name,
    publisher: name,
    category: "Technology",
    applicationName: `${name} — Portfolio`,
    formatDetection: { telephone: true, email: true, address: true },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: BASE_URL,
      siteName: name,
      title: `${name} | ${title} Portfolio`,
      description: desc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${name} — ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${title} Portfolio`,
      description: desc,
      images: [ogImage],
    },
    keywords: ["Naheel Muhammed PK", "Full Stack Developer", ".NET Developer", "React Developer", "Portfolio", "Web Developer", "Kerala", "India"],
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    alternates: { canonical: BASE_URL },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const name = s.name || "Naheel Muhammed PK";
  const title = s.title || "Full Stack Developer";
  const avatar = s.avatar || `${BASE_URL}/avatar.svg`;
  const email = s.email || "hello@naheel.me";
  const phone = s.phone || "+91-7306912910";
  const github = s.github || "https://github.com/naheel0";
  const linkedin = s.linkedin || "https://www.linkedin.com/in/naheel-muhammed";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: BASE_URL,
    image: avatar,
    jobTitle: title,
    email,
    telephone: phone,
    address: { "@type": "PostalAddress", addressRegion: "Kerala", addressCountry: "IN" },
    sameAs: [github, linkedin],
    knowsAbout: ["React", "Next.js", "JavaScript", "TypeScript", "HTML", "CSS", ".NET", "C#", "ASP.NET", "SQL Server", "Web Development", "Full Stack Development"],
    alumniOf: { "@type": "EducationalOrganization", name: "Bachelor of Computer Applications" },
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#060818" />
        <link rel="icon" href="/icon.svg" />
        <link rel="preconnect" href={API_HOST} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={ptMono.variable}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <WelcomeScreen />
        <AuroraOrbs />
        <div className="app-layout">{children}</div>
      </body>
    </html>
  );
}
