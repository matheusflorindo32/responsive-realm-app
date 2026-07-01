import { motion } from "framer-motion";
import { SectionHead } from "./SectionHead";
import { contents } from "@/data/tropa-content";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Contents() {
  return (
    <section aria-labelledby="contents-title" className="py-20 md:py-28 bg-white/40">
      <div className="container-wide">
        <SectionHead
          eyebrow="Conteúdos"
          title={
            <span id="contents-title">
              Formatos que traduzem <span className="t-gradient-text">complexidade</span>.
            </span>
          }
          description="Multi-formato para diferentes contextos de aprendizado — do reel de 30s ao estudo aplicado."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3"
        >
          {contents.map((c) => (
            <motion.article
              key={c.title}
              variants={item}
              className="t-card t-hairline-top p-5 flex items-start gap-4"
            >
              <span className="shrink-0 grid place-items-center h-10 w-10 rounded-lg bg-primary/8 text-primary">
                <c.icon size={18} />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
