import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Tropa Científica | Portfólio de Tecnologia e Ciência</title>
        <meta
          name="description"
          content="Portfólio de projetos em tecnologia e ciência. Desenvolvedor especializado em React, TypeScript, Python e Machine Learning."
        />
        <meta property="og:title" content="Tropa Científica - Portfólio" />
        <meta
          property="og:description"
          content="Portfólio de projetos em tecnologia e ciência. Transformando ideias em soluções inovadoras."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <ExperienceSection />
          <FAQSection />
          <ContactSection />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
};

export default Index;
