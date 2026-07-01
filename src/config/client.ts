/**
 * CLIENT_CONFIG — camada de configuração reutilizável.
 * Trocar estes valores permite replicar o APOS para outros profissionais
 * sem reescrever componentes.
 */
export const CLIENT_CONFIG = {
  name: "Matheus Florindo de Deus",
  shortName: "Matheus Florindo",
  domain: "matheusflorindo.dev",
  headline: "Ciência, Segurança Pública, Tecnologia e Performance Humana.",
  tagline: "Pesquisador · Policial Militar · Desenvolvedor",
  spreadsheetId: "", // preencher quando conectar MCP/Google Sheets
  publicEmail: "contato@matheusflorindo.dev",
  brand: {
    primary: "#0B1F3A",
    secondary: "#1E3A8A",
    accent: "#0F766E",
    gold: "#B7791F",
  },
} as const;

export const SHOW_PRIVATE_DATA = false;
