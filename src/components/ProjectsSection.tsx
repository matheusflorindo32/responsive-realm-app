import { useState } from "react";
import { ExternalLink, Github, ChevronDown, ChevronUp, ShoppingCart, Car, GraduationCap, Coffee, Wheat, PenTool, Music, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "CONACIPS - UFES",
    category: "Sistema SaaS",
    description: "Sistema completo de gestão de eventos acadêmicos para o Centro de Educação Física da Universidade Federal do Espírito Santo.",
    fullDescription: "Plataforma all-in-one para o Congresso Científico do Centro de Educação Física da UFES, com 898 inscrições processadas, 73 submissões científicas e 294 inscrições em oficinas. Inclui inscrições online, submissão de trabalhos acadêmicos, gestão de oficinas com controle de vagas, check-in digital por QR Code, emissão de 22 tipos de certificados digitais com validação online, chatbot IA com Google Gemini, painel administrativo completo, galeria de fotos e sistema de anais.",
    technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS", "Gemini AI"],
    features: ["898 inscrições processadas", "Certificados digitais com QR Code", "Check-in por QR Code", "Chatbot IA integrado", "60+ políticas RLS", "30 Edge Functions"],
    icon: "graduation",
    demo: "https://conacips2025.com",
  },
  {
    id: 2,
    title: "R. De Deus Café",
    category: "Sistema B2B / Agronegócio",
    description: "Sistema de gestão de armazém para café com integração IoT, rastreabilidade por lotes e manifesto digital.",
    fullDescription: "Plataforma SaaS completa para gestão de armazéns de café, desenvolvida para otimizar operações de recebimento, armazenamento e expedição. Integração direta com balanças digitais para pesagem automática, sistema de rastreabilidade por lotes com histórico completo, manifesto digital com QR Code para validação de cargas, relatórios exportáveis (PDF/Excel), controle de permissões multi-usuário com níveis de acesso, dashboard em tempo real e sincronização offline-first.",
    technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS", "IoT Integration"],
    features: ["Integração com balança digital", "Rastreabilidade por lotes", "Manifesto digital QR Code", "Modelo SaaS flexível", "Multi-usuário com permissões", "Relatórios exportáveis"],
    icon: "wheat",
    demo: "https://rdeus-coffee-stream.lovable.app",
  },
  {
    id: 3,
    title: "Redação Elite Pro",
    category: "EdTech / IA",
    description: "Plataforma de correção de redações com Inteligência Artificial para preparatórios de concursos públicos.",
    fullDescription: "Sistema completo de correção automatizada utilizando IA, com feedback detalhado em segundos seguindo padrões de 5 bancas (CESPE, FGV, FCC, IBFC, Quadrix). Inclui gamificação com XP, níveis, conquistas e ranking semanal, flashcards para estudo, análise de temas prováveis, dashboard de gestão com métricas por unidade e relatórios completos. Modelo SaaS flexível com planos individuais e organizacionais.",
    technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS", "OpenAI"],
    features: ["Correção IA em segundos", "5 bancas suportadas", "Gamificação completa", "Flashcards integrados", "Dashboard organizacional", "Modelo SaaS B2B/B2C"],
    icon: "pen",
    demo: "https://reda-wizard.lovable.app",
  },
  {
    id: 4,
    title: "Alfa-Con Auth",
    category: "Sistema B2B / SaaS",
    description: "Plataforma UNIBE com proposta comercial premium, autenticação e geração de orçamentos personalizados.",
    fullDescription: "Sistema completo de gestão comercial com 15+ funcionalidades já entregues (valor ~R$ 80-120k). Inclui geração de propostas comerciais premium com exportação automática para PDF, 10 evoluções recomendadas com valores detalhados, 3 pacotes de serviços disponíveis, autenticação segura, painel de personalização de dados de contato e interface moderna com visual edits em tempo real.",
    technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    features: ["Proposta comercial PDF", "15+ funcionalidades premium", "Autenticação segura", "Pacotes personalizados", "Painel de edição", "Geração automática PDF"],
    icon: "building",
    demo: "https://alfa-con-auth.lovable.app",
  },
  {
    id: 5,
    title: "Landing Page Músico",
    category: "Landing Page",
    description: "Landing page profissional para músico com galeria de vídeos, agenda de shows e integração WhatsApp.",
    fullDescription: "Página institucional completa para artistas musicais, incluindo hero com foto e CTA, galeria de performances e gravações, cards de serviços, discografia, depoimentos de clientes, agenda de eventos e formulário de contato. Design 100% responsivo, animações profissionais, otimização SEO e integração com redes sociais e Press Kit.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    features: ["Design responsivo", "Galeria de vídeos", "Agenda de shows", "Formulário funcional", "WhatsApp flutuante", "Press Kit download"],
    icon: "music",
    demo: "https://musician-spotlight-pro.lovable.app",
  },
  {
    id: 6,
    title: "Via Pneus BR",
    category: "Catálogo/Marketplace",
    description: "Plataforma de venda de pneus com catálogo completo, hero slider dinâmico e integração WhatsApp.",
    fullDescription: "Desenvolvimento de plataforma de alta performance com landing page institucional, hero slider dinâmico, catálogo completo com filtros e busca por aro/medida, ordenação múltipla, paginação otimizada, seção de promoções, integração WhatsApp Business para orçamentos, painel administrativo com upload de imagens e controle de visibilidade, banco de dados em nuvem com políticas de segurança RLS.",
    technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    features: ["Hero slider dinâmico", "Catálogo com filtros", "Painel administrativo", "WhatsApp Business", "Seção de promoções", "Segurança RLS"],
    icon: "car",
    demo: "https://www.viapneusbr.com",
  },
  {
    id: 7,
    title: "Incrível Mundo DK",
    category: "E-commerce",
    description: "E-commerce de canecas personalizadas com catálogo, orçamentos e geração automática de PDF.",
    fullDescription: "Site profissional completo para venda de canecas personalizadas. Inclui landing page com design moderno e animações, catálogo de produtos com filtros, página de detalhes com galeria de fotos, cálculo de frete por CEP (PAC/SEDEX), sistema de cupons de desconto, formulário de orçamento com upload, geração automática de PDF, emails transacionais automáticos, painel administrativo seguro com CRUD de produtos e cupons, botão WhatsApp flutuante e design responsivo mobile-first.",
    technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    features: ["Cálculo de frete CEP", "Cupons de desconto", "Geração de PDF", "Emails automáticos", "Painel admin", "WhatsApp flutuante"],
    icon: "coffee",
    demo: "https://emotive-craft-pages.lovable.app",
  },
];

const IconComponent = ({ icon }: { icon: string }) => {
  const icons: Record<string, React.ReactNode> = {
    graduation: <GraduationCap className="w-5 h-5" />,
    car: <Car className="w-5 h-5" />,
    cart: <ShoppingCart className="w-5 h-5" />,
    coffee: <Coffee className="w-5 h-5" />,
    wheat: <Wheat className="w-5 h-5" />,
    pen: <PenTool className="w-5 h-5" />,
    music: <Music className="w-5 h-5" />,
    building: <Building2 className="w-5 h-5" />,
  };
  return <>{icons[icon] || <ShoppingCart className="w-5 h-5" />}</>;
};

const ProjectsSection = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="projetos" className="py-20 md:py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">MEUS</span>{" "}
            <span className="text-primary neon-text">PROJETOS</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Uma seleção dos principais projetos que desenvolvi, combinando tecnologia e inovação.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Header with Icon and Category */}
              <div className="p-6 pb-0 flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <IconComponent icon={project.icon} />
                </div>
                <span className="inline-block px-3 py-1 text-xs font-body font-medium bg-primary/20 text-primary rounded-full">
                  {project.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {project.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>

                {/* Expanded Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedId === project.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="font-body text-sm text-muted-foreground mb-4 pt-2 border-t border-border">
                    {project.fullDescription}
                  </p>
                  
                  {/* Features List */}
                  <div className="mb-4">
                    <p className="text-xs font-mono text-primary mb-2">Funcionalidades:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-body bg-muted text-muted-foreground rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex gap-2">
                    {project.demo && project.demo !== "#" && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="Ver demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(project.id)}
                    className="text-primary hover:text-primary"
                  >
                    {expandedId === project.id ? (
                      <>
                        Ver menos <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Ver mais <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
