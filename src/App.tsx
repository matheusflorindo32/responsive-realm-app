import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";

import { Layout as AposLayout } from "@/components/apos/Layout";
const AposHome = lazy(() => import("./pages/matheus/Home"));
const About = lazy(() => import("./pages/matheus/About"));
const Publications = lazy(() => import("./pages/matheus/Publications"));
const EducationPage = lazy(() => import("./pages/matheus/EducationPage"));
const Projects = lazy(() => import("./pages/matheus/Projects"));
const ExperiencePage = lazy(() => import("./pages/matheus/ExperiencePage"));
const Contact = lazy(() => import("./pages/matheus/Contact"));

import { TropaLayout } from "@/components/tropa/Layout";
import TropaHome from "./pages/tropa/Home";
const TropaSobre = lazy(() => import("./pages/tropa/Sobre"));
const TropaConteudos = lazy(() => import("./pages/tropa/Conteudos"));
const TropaProjetos = lazy(() => import("./pages/tropa/Projetos"));

const NotFound = lazy(() => import("./pages/NotFound"));
// AdminAuth removed; /admin now uses AdminLayout guard which redirects to /login
const AdminSync = lazy(() => import("./pages/admin/AdminSync"));
const VaultWorkspace = lazy(() => import("./pages/admin/VaultWorkspace"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const CommandCenter = lazy(() => import("./pages/admin/CommandCenter"));
const AdminStart = lazy(() => import("./pages/admin/AdminStart"));
const ModulePlaceholder = lazy(() => import("./pages/admin/ModulePlaceholder"));
const EnsinoHub = lazy(() => import("./pages/admin/ensino/Hub"));
const Trilhas = lazy(() => import("./pages/admin/ensino/Trilhas"));
const Cursos = lazy(() => import("./pages/admin/ensino/Cursos"));
const CursoDetalhe = lazy(() => import("./pages/admin/ensino/CursoDetalhe"));
const Matriculas = lazy(() => import("./pages/admin/ensino/Matriculas"));
const Auditoria = lazy(() => import("./pages/admin/ensino/Auditoria"));
const AlunoDetalhe = lazy(() => import("./pages/admin/ensino/AlunoDetalhe"));
const CertificadosAdmin = lazy(() => import("./pages/admin/ensino/CertificadosAdmin"));
const CertificadoPublico = lazy(() => import("./pages/CertificadoPublico"));
const CertificadosVitrine = lazy(() => import("./pages/CertificadosVitrine"));
// legacy /entrar now redirects to /login
const AppLayout = lazy(() => import("./pages/app/AppLayout"));
const Dashboard = lazy(() => import("./pages/app/Dashboard"));
const CursoPlayer = lazy(() => import("./pages/app/CursoPlayer"));
const Perfil = lazy(() => import("./pages/app/Perfil"));
const Certificados = lazy(() => import("./pages/app/Certificados"));

const Login = lazy(() => import("./pages/auth/Login"));
const Cadastro = lazy(() => import("./pages/auth/Cadastro"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const MfaSetup = lazy(() => import("./pages/auth/MfaSetup"));
const MfaVerify = lazy(() => import("./pages/auth/MfaVerify"));
const AuthCallback = lazy(() => import("./pages/auth/AuthCallback"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const OAuthConsent = lazy(() => import("./pages/auth/OAuthConsent"));
const JarvisAuth = lazy(() => import("./pages/admin/auth/JarvisAuth"));
const JarvisAccessPending = lazy(() => import("./pages/admin/auth/JarvisAccessPending"));
const JarvisMfaSetup = lazy(() => import("./pages/admin/auth/JarvisMfaSetup"));
const JarvisMfaVerify = lazy(() => import("./pages/admin/auth/JarvisMfaVerify"));
const OperationsRegistry = lazy(() => import("./pages/admin/OperationsRegistry"));
const ProjectsWorkspace = lazy(() => import("./pages/admin/ProjectsWorkspace"));
const JarvisPreview = lazy(() => import("./pages/JarvisPreview"));


const queryClient = new QueryClient();

// Cada página fora da home é carregada sob demanda: o visitante da página inicial
// não baixa o painel administrativo, a área do aluno nem o laboratório.
function RouteFallback() {
  return (
    <div role="status" aria-live="polite" className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground">
      Carregando…
    </div>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Tropa Científica — raiz */}
            <Route element={<TropaLayout />}>
              <Route path="/" element={<TropaHome />} />
              <Route path="/sobre-a-tropa" element={<TropaSobre />} />
              <Route path="/conteudos" element={<TropaConteudos />} />
              <Route path="/projetos-tropa" element={<TropaProjetos />} />
            </Route>

            {/* Matheus Florindo / APOS — site institucional */}
            <Route element={<AposLayout />}>
              <Route path="/matheus" element={<AposHome />} />
              <Route path="/matheus/sobre" element={<About />} />
              <Route path="/matheus/publicacoes" element={<Publications />} />
              <Route path="/matheus/formacao" element={<EducationPage />} />
              <Route path="/matheus/projetos" element={<Projects />} />
              <Route path="/matheus/experiencia" element={<ExperiencePage />} />
              <Route path="/matheus/contato" element={<Contact />} />
            </Route>

            {/* Compatibilidade com URLs antigas */}
            <Route path="/sobre" element={<Navigate to="/matheus/sobre" replace />} />
            <Route path="/publicacoes" element={<Navigate to="/matheus/publicacoes" replace />} />
            <Route path="/formacao" element={<Navigate to="/matheus/formacao" replace />} />
            <Route path="/projetos" element={<Navigate to="/matheus/projetos" replace />} />
            <Route path="/experiencia" element={<Navigate to="/matheus/experiencia" replace />} />
            <Route path="/contato" element={<Navigate to="/matheus/contato" replace />} />
            <Route path="/jarvis-preview" element={<JarvisPreview />} />

            {/* Autenticação administrativa isolada no Supabase pessoal do JARVIS */}
            <Route path="/admin/auth" element={<JarvisAuth />} />
            <Route path="/admin/access-pending" element={<JarvisAccessPending />} />
            <Route path="/admin/mfa/setup" element={<JarvisMfaSetup />} />
            <Route path="/admin/mfa/verify" element={<JarvisMfaVerify />} />

            {/* Admin — protegido por função, RLS, papel administrativo e MFA */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/hoje" replace />} />
              <Route path="/admin/hoje" element={<CommandCenter />} />
              <Route path="/admin/iniciar" element={<AdminStart />} />
              <Route path="/admin/projetos" element={<ProjectsWorkspace />} />
              <Route path="/admin/relacionamentos" element={<ModulePlaceholder module="relacionamentos" />} />
              <Route path="/admin/conteudo" element={<ModulePlaceholder module="conteudo" />} />
              <Route path="/admin/pesquisa" element={<ModulePlaceholder module="pesquisa" />} />
              <Route path="/admin/agentes" element={<OperationsRegistry kind="agents" />} />
              <Route path="/admin/skills" element={<OperationsRegistry kind="skills" />} />
              <Route path="/admin/sistemas" element={<OperationsRegistry kind="systems" />} />
              <Route path="/admin/agenda" element={<ModulePlaceholder module="agenda" />} />
              <Route path="/admin/inbox" element={<ModulePlaceholder module="inbox" />} />
              <Route path="/admin/vault" element={<VaultWorkspace />} />
              <Route path="/admin/metricas" element={<ModulePlaceholder module="metricas" />} />
              <Route path="/admin/riscos" element={<ModulePlaceholder module="riscos" />} />

              <Route path="/admin/sync" element={<AdminSync />} />
              <Route path="/admin/ensino" element={<EnsinoHub />} />
              <Route path="/admin/ensino/trilhas" element={<Trilhas />} />
              <Route path="/admin/ensino/cursos" element={<Cursos />} />
              <Route path="/admin/ensino/cursos/:id" element={<CursoDetalhe />} />
              <Route path="/admin/ensino/matriculas" element={<Matriculas />} />
              <Route path="/admin/ensino/auditoria" element={<Auditoria />} />
              <Route path="/admin/ensino/alunos/:userId" element={<AlunoDetalhe />} />
              <Route path="/admin/ensino/certificados" element={<CertificadosAdmin />} />
            </Route>

            {/* Validação pública de certificado */}
            <Route path="/certificados" element={<CertificadosVitrine />} />
            <Route path="/certificado/:code" element={<CertificadoPublico />} />

            {/* Autenticação unificada */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/mfa/setup" element={<MfaSetup />} />
            <Route path="/mfa/verify" element={<MfaVerify />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
            <Route path="/entrar" element={<Navigate to="/login" replace />} />

            {/* Aluno */}
            <Route element={<AppLayout />}>
              <Route path="/app" element={<Dashboard />} />
              <Route path="/app/curso/:slug" element={<CursoPlayer />} />
              <Route path="/app/perfil" element={<Perfil />} />
              <Route path="/app/certificados" element={<Certificados />} />
            </Route>


            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
