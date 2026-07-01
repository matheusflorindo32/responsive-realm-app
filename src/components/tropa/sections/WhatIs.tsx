import { motion } from "framer-motion";
import { SectionHead } from "./SectionHead";
import { Atom, Cpu, GraduationCap } from "lucide-react";

const highlights = [
  { icon: Atom, label: "Ciência aberta", value: "Rigor + acesso" },
  { icon: Cpu, label: "IA aplicada", value: "Uso real" },
  { icon: GraduationCap, label: "Educação", value: "Conteúdo claro" },
];

export function WhatIs() {
  return (
    <section aria-labelledby="whatis-title" className="py-20 md:py-28">
      <div className="container-wide grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <SectionHead
            eyebrow="O que é"
            title={
              <>
                Um hub de <span className="t-gradient-text">divulgação científica</span> e inovação
                aplicada.
              </>
            }
            description="A Tropa Científica transforma conhecimento técnico, científico e tecnológico em conteúdo acessível, visual e aplicável — do laboratório ao dia a dia de profissionais, estudantes e curiosos."
          />
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          id="whatis-title"
          className="lg:col-span-5 t-glass rounded-2xl p-7 space-y-5"
        >
          <p className="text-[11px] mono uppercase tracking-[0.22em] text-primary">
            Princípios operacionais
          </p>
          {highlights.map((h) => (
            <div key={h.label} className="flex items-start gap-4 pt-4 border-t border-border first:border-none first:pt-0">
              <span className="grid place-items-center h-10 w-10 rounded-lg bg-primary/8 text-primary">
                <h.icon size={18} />
              </span>
              <div>
                <p className="text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
                  {h.label}
                </p>
                <p className="mt-0.5 text-base font-medium text-foreground">{h.value}</p>
              </div>
            </div>
          ))}
        </motion.aside>
      </div>
    </section>
  );
}
