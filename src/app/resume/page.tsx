import type { Metadata } from "next";
import ResumeContent from "@/components/ResumeContent";
import { getResume } from "@/lib/data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Naheel Muhammed PK — Full Stack Developer (.NET + React) from Kerala, India. Experience with ASP.NET Core, React, SQL Server, Clean Architecture and JWT authentication. View online or download the PDF.",
  alternates: { canonical: `${BASE_URL}/resume` },
  openGraph: {
    title: "Resume | Naheel Muhammed PK",
    description:
      "Full Stack Developer (.NET + React) — view the resume online or download the PDF.",
    url: `${BASE_URL}/resume`,
    type: "profile",
  },
};

export default async function ResumePage() {
  const data = await getResume();
  return <ResumeContent data={data} />;
}