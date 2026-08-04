import type { Metadata } from "next";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { PT_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import AuroraOrbs from "@/components/AuroraOrbs";
import { getSettings } from "@/lib/api";

const ptMono = PT_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pt-mono",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

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
        <link rel="preconnect" href="https://admin.naheel.me" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={ptMono.variable}>
        <CustomCursor />
        <AuroraOrbs />
        <div className="app-layout">
          <Navbar />
          <main className="app-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
