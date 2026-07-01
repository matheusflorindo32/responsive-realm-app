import { Helmet } from "react-helmet-async";
import { Hero } from "@/components/tropa/sections/Hero";
import { WhatIs } from "@/components/tropa/sections/WhatIs";
import { Areas } from "@/components/tropa/sections/Areas";
import { Contents } from "@/components/tropa/sections/Contents";
import { WhyFollow } from "@/components/tropa/sections/WhyFollow";
import { TechStack } from "@/components/tropa/sections/TechStack";
import { Authority } from "@/components/tropa/sections/Authority";
import { FinalCTA } from "@/components/tropa/sections/FinalCTA";

export default function TropaHome() {
  return (
    <>
      <Helmet>
        <title>Tropa Científica — Ciência, IA e Inovação Aplicada</title>
        <meta
          name="description"
          content="Divulgação científica com foco em Inteligência Artificial, ciência de dados, segurança pública, drones, pesquisa aplicada e educação digital."
        />
        <meta property="og:title" content="Tropa Científica — Ciência, IA e Inovação Aplicada" />
        <meta
          property="og:description"
          content="Um hub de divulgação científica que conecta IA, dados, segurança pública e educação."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Tropa Científica",
          url: "/",
          description:
            "Divulgação científica com foco em IA, dados, segurança pública e educação digital.",
        })}</script>
      </Helmet>

      <Hero />
      <WhatIs />
      <Areas />
      <Contents />
      <WhyFollow />
      <TechStack />
      <Authority />
      <FinalCTA />
    </>
  );
}
