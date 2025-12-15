import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ScheduleSection from "@/components/ScheduleSection";
import SpeakersSection from "@/components/SpeakersSection";
import RegistrationForm from "@/components/RegistrationForm";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TechNexus Hackathon 2025 | O Maior Evento de Inovação do Brasil</title>
        <meta
          name="description"
          content="Participe do TechNexus Hackathon 2025 - 48 horas de inovação, networking e tecnologia de ponta. Inscreva-se agora e transforme suas ideias em realidade."
        />
        <meta property="og:title" content="TechNexus Hackathon 2025" />
        <meta
          property="og:description"
          content="O maior evento de inovação e tecnologia do Brasil. 48 horas para criar, inovar e transformar ideias em realidade."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ScheduleSection />
          <SpeakersSection />
          <RegistrationForm />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
};

export default Index;
