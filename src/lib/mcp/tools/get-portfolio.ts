import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import data from "../../../data/apos-master.json";

type Row = Record<string, unknown>;
const pub = (rows: unknown): Row[] =>
  (Array.isArray(rows) ? (rows as Row[]) : []).filter((r) => r?.visibility === "public");

const SECTIONS = {
  perfil: "01_Profile",
  bio: "02_Bio",
  publicacoes: "04_Publicacoes",
  anais: "05_Anais_CONACIPS",
  formacao: "06_Formacao",
  cursos: "07_Cursos",
  certificacoes: "08_Certificacoes",
  experiencia: "09_Experiencia",
  projetos: "10_Projetos",
  habilidades: "11_Skills",
  links: "13_Links",
} as const;

type Section = keyof typeof SECTIONS;

function read(section: Section): unknown {
  const d = data as unknown as Record<string, unknown>;
  const raw = d[SECTIONS[section]];
  if (section === "perfil" || section === "bio") return raw ?? null;
  return pub(raw);
}

export default defineTool({
  name: "get_portfolio",
  title: "Consultar portfólio",
  description:
    "Retorna dados públicos do portfólio de Matheus Florindo (perfil, bio, publicações, anais, formação, cursos, certificações, experiência, projetos, habilidades e links), com busca opcional.",
  inputSchema: {
    section: z
      .enum(["tudo", ...(Object.keys(SECTIONS) as Section[])])
      .describe("Seção desejada, ou 'tudo' para o portfólio completo."),
    search: z.string().trim().nullable().describe("Texto opcional para filtrar itens."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ section, search }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const keys = section === "tudo" ? (Object.keys(SECTIONS) as Section[]) : [section as Section];
    const term = search?.toLowerCase();
    const result: Record<string, unknown> = {};
    for (const k of keys) {
      let value = read(k);
      if (term && Array.isArray(value)) {
        value = value.filter((r) => JSON.stringify(r).toLowerCase().includes(term));
      }
      result[k] = value;
    }
    const json = JSON.parse(JSON.stringify(result));
    return { content: [{ type: "text", text: JSON.stringify(json) }], structuredContent: json };
  },
});
