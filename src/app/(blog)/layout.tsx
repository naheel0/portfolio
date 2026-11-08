import { Barlow_Semi_Condensed, Inter, Martian_Mono } from "next/font/google";

const barlow = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-barlow",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const martian = Martian_Mono({ subsets: ["latin"], variable: "--font-martian", display: "swap" });

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${barlow.variable} ${inter.variable} ${martian.variable}`}>{children}</div>
  );
}
