import { Helmet } from "react-helmet-async";
import { CinematicJourney } from "@/components/tropa/cinematic/CinematicJourney";
import { EditorialHome } from "@/components/tropa/cinematic/EditorialHome";

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

      <CinematicJourney />
      <EditorialHome />
    </>
  );
}
