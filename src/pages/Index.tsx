import { useReveal } from "@/hooks/useReveal";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ConferenceCard from "@/components/sections/ConferenceCard";
import Schedule from "@/components/sections/Schedule";
import Location from "@/components/sections/Location";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import WhatsAppFAB from "@/components/sections/WhatsAppFAB";

const Index = () => {
  useReveal();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <About />
      <ConferenceCard />
      <Schedule />
      <Location />
      <FinalCTA />
      <Footer />
      <WhatsAppFAB />
    </main>
  );
};

export default Index;
