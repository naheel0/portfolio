import type { Metadata } from "next";
import ResumeContent from "@/components/ResumeContent";
import { getResume } from "@/lib/data";
import { getSettings } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s.name || "Naheel Muhammed PK";
  const title = s.title || "Full Stack Developer";
  const desc = `Resume of ${name} — ${title} from Kerala, India. Experience with ASP.NET Core, React, SQL Server, Clean Architecture and JWT authentication. View online or download the PDF.`;

  return {
    title: "Resume",
    description: desc,
    alternates: { canonical: `${BASE_URL}/resume` },
    openGraph: {
      title: `Resume | ${name}`,
      description: `${title} — view the resume online or download the PDF.`,
      url: `${BASE_URL}/resume`,
      type: "profile",
    },
  };
}

export default async function ResumePage() {
  const [data, settings] = await Promise.all([getResume(), getSettings()]);
  return <ResumeContent data={data} settings={settings} />;
}
