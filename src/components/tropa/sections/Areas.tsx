import { motion } from "framer-motion";
import { SectionHead } from "./SectionHead";
import { areas } from "@/data/tropa-content";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Areas() {
  return (
    <section aria-labelledby="areas-title" className="py-20 md:py-28">
      <div className="container-wide">
        <SectionHead
          eyebrow="Áreas de atuação"
          title={
            <span id="areas-title">
              Onde a Tropa <span className="t-gradient-text">atua</span>.
            </span>
          }
          description="Oito frentes que se cruzam para transformar dados, código e ciência em conteúdo e produtos aplicáveis."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {areas.map((a) => (
            <motion.article
              key={a.title}
              variants={item}
              className={`t-card t-hairline-top p-6 relative overflow-hidden ${a.span ?? ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary/8 text-primary ring-1 ring-primary/15">
                  <a.icon size={20} />
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
