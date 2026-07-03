import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { Layout as AposLayout } from "@/components/apos/Layout";
import AposHome from "./pages/matheus/Home";
import About from "./pages/matheus/About";
import Publications from "./pages/matheus/Publications";
import EducationPage from "./pages/matheus/EducationPage";
import Projects from "./pages/matheus/Projects";
import ExperiencePage from "./pages/matheus/ExperiencePage";
import Contact from "./pages/matheus/Contact";

import { TropaLayout } from "@/components/tropa/Layout";
import TropaHome from "./pages/tropa/Home";
import TropaSobre from "./pages/tropa/Sobre";
import TropaConteudos from "./pages/tropa/Conteudos";
import TropaProjetos from "./pages/tropa/Projetos";

import NotFound from "./pages/NotFound";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminSync from "./pages/admin/AdminSync";
import AdminLayout from "@/components/admin/AdminLayout";
import EnsinoHub from "./pages/admin/ensino/Hub";
import Trilhas from "./pages/admin/ensino/Trilhas";
import Cursos from "./pages/admin/ensino/Cursos";
import CursoDetalhe from "./pages/admin/ensino/CursoDetalhe";
import Matriculas from "./pages/admin/ensino/Matriculas";
import Auditoria from "./pages/admin/ensino/Auditoria";
import AlunoDetalhe from "./pages/admin/ensino/AlunoDetalhe";
import CertificadosAdmin from "./pages/admin/ensino/CertificadosAdmin";
import CertificadoPublico from "./pages/CertificadoPublico";
import CertificadosVitrine from "./pages/CertificadosVitrine";
import Entrar from "./pages/app/Entrar";
import AppLayout from "./pages/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import CursoPlayer from "./pages/app/CursoPlayer";
import Perfil from "./pages/app/Perfil";
import Certificados from "./pages/app/Certificados";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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

            {/* Admin */}
            <Route path="/admin" element={<AdminAuth />} />
            <Route element={<AdminLayout />}>
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

            {/* Aluno */}
            <Route path="/entrar" element={<Entrar />} />
            <Route element={<AppLayout />}>
              <Route path="/app" element={<Dashboard />} />
              <Route path="/app/curso/:slug" element={<CursoPlayer />} />
              <Route path="/app/perfil" element={<Perfil />} />
              <Route path="/app/certificados" element={<Certificados />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
