import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="app-main">{children}</main>
      <Footer />
    </>
  );
}