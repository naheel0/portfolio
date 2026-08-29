import type { Metadata } from "next";
import ResumeContent from "@/components/ResumeContent";
import { getResume } from "@/lib/data";
import { getSettings } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s.name || "Naheel Muhammed PK";
  const title = s.title || "Full Stack Developer";
  const desc = `Resume of ${name}, ${title} from Kerala, India. Experience with ASP.NET Core, React, SQL Server, Clean Architecture and JWT authentication. View online or download the PDF.`;

  return {
    title: "Resume",
    description: desc,
    alternates: { canonical: `${BASE_URL}/resume` },
    openGraph: {
      title: `Resume | ${name}`,
      description: `${title}. View the resume online or download the PDF.`,
      url: `${BASE_URL}/resume`,
      type: "profile",
    },
  };
}

export default async function ResumePage() {
  const [data, settings] = await Promise.all([getResume(), getSettings()]);
  const name = settings.name || "Naheel Muhammed PK";
  const title = settings.title || "Full Stack Developer";

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `Resume — ${name}`,
    url: `${BASE_URL}/resume`,
    mainEntity: {
      "@type": "Person",
      name,
      jobTitle: title,
      url: BASE_URL,
      ...(settings.email && { email: settings.email }),
      ...(settings.phone && { telephone: settings.phone }),
      ...(settings.github && { sameAs: [settings.github, settings.linkedin].filter(Boolean) }),
      knowsAbout: data.skillGroups?.flatMap((g: { skills: string[] }) => g.skills) || [],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }} />
      <ResumeContent data={data} settings={settings} />
    </>
  );
}
