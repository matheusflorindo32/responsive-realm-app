import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/apos/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Publications from "./pages/Publications";
import EducationPage from "./pages/EducationPage";
import Projects from "./pages/Projects";
import ExperiencePage from "./pages/ExperiencePage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/publicacoes" element={<Publications />} />
              <Route path="/formacao" element={<EducationPage />} />
              <Route path="/projetos" element={<Projects />} />
              <Route path="/experiencia" element={<ExperiencePage />} />
              <Route path="/contato" element={<Contact />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
