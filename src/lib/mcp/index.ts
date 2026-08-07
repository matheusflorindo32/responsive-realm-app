import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listCoursesTool from "./tools/list-courses";
import getCourseTool from "./tools/get-course";
import myProgressTool from "./tools/my-progress";
import myCertificatesTool from "./tools/my-certificates";
import verifyCertificateTool from "./tools/verify-certificate";

// Issuer must be the direct Supabase host, built from the project ref.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "tropa-cientifica",
  title: "Tropa Científica",
  version: "0.1.0",
  instructions:
    "Ferramentas da plataforma Tropa Científica. Use `list_courses` e `get_course` para explorar o catálogo de cursos e aulas, `my_progress` para o progresso do usuário autenticado, `my_certificates` para os certificados dele e `verify_certificate` para validar um código de certificado.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listCoursesTool, getCourseTool, myProgressTool, myCertificatesTool, verifyCertificateTool],
});
