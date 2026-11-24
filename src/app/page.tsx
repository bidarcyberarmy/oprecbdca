import { AboutSection } from "@/components/AboutSection";
import { DivisionExplorer } from "@/components/DivisionExplorer";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[0.45rem] focus:bg-night focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Langsung ke konten utama
      </a>
      <Navbar />
      <main id="konten-utama">
        <HeroSection />
        <AboutSection />
        <DivisionExplorer />
      </main>
      <Footer />
    </div>
  );
}
