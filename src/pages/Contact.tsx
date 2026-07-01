import { useState } from "react";
import { SEOHead } from "@/components/apos/SEOHead";
import { SectionHeader } from "@/components/apos/SectionHeader";
import { AcademicLinks } from "@/components/apos/AcademicLinks";
import { Button } from "@/components/ui/button";
import { getLinks } from "@/data/adapters/localMockAdapter";
import { CLIENT_CONFIG } from "@/config/client";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const links = getLinks();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Preencha nome, e-mail e mensagem.");
      return;
    }
    setSent(true);
    toast.success("Mensagem registrada", {
      description: "Sua mensagem foi recebida. Retornarei o contato pelo e-mail informado.",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };
  return (
    <>
      <SEOHead
        title="Contato — Matheus Florindo"
        description="Contato institucional para pesquisa, colaborações acadêmicas, parcerias em segurança pública, saúde operacional e desenvolvimento tecnológico."
        path="/contato"
      />
      <section className="container-wide pt-14 pb-10">
        <SectionHeader
          eyebrow="Contato institucional"
          title={<>Vamos conversar sobre <em>ciência aplicada</em></>}
          description="Colaborações acadêmicas, projetos de pesquisa, parcerias institucionais ou consultoria técnica em segurança pública, IA e performance humana."
        />
      </section>

      <section className="container-wide pb-24 grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <form onSubmit={submit} className="card-surface p-6 md:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="eyebrow block mb-2">Nome</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label className="eyebrow block mb-2">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="voce@exemplo.com"
              />
            </div>
          </div>
          <div>
            <label className="eyebrow block mb-2">Assunto</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full h-11 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="Colaboração de pesquisa, projeto, palestra..."
            />
          </div>
          <div>
            <label className="eyebrow block mb-2">Mensagem</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={7}
              className="w-full p-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-y"
              placeholder="Descreva brevemente o motivo do contato..."
            />
          </div>
          <Button type="submit" size="lg" variant="default" disabled={sent}>
            {sent ? "Enviado" : (<>Enviar mensagem <Send size={16} /></>)}
          </Button>
        </form>

        <aside className="space-y-6">
          <div className="card-surface p-6 space-y-4">
            <div>
              <div className="eyebrow mb-2">Contato direto</div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-accent mt-0.5" />
                <a href={`mailto:${CLIENT_CONFIG.publicEmail}`} className="text-sm text-primary hover:text-accent break-all">
                  {CLIENT_CONFIG.publicEmail}
                </a>
              </div>
            </div>
            <div>
              <div className="eyebrow mb-2">Localização</div>
              <div className="flex items-start gap-3 text-sm text-foreground">
                <MapPin size={16} className="text-accent mt-0.5" />
                Serra, Espírito Santo — Brasil
              </div>
            </div>
          </div>
          <div>
            <div className="eyebrow mb-3">Perfis oficiais</div>
            <AcademicLinks links={links.filter((l) => l.category === "Acadêmico" || l.category === "Tecnologia")} />
          </div>
        </aside>
      </section>
    </>
  );
}
