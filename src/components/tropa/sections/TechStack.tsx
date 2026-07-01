import { motion } from "framer-motion";
import { SectionHead } from "./SectionHead";
import { tech } from "@/data/tropa-content";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.035 } } };
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export function TechStack() {
  return (
    <section aria-labelledby="tech-title" className="py-20 md:py-28 bg-white/40">
      <div className="container-wide">
        <SectionHead
          eyebrow="Tecnologias & temas"
          title={
            <span id="tech-title">
              Um <span className="t-gradient-text">stack multidisciplinar</span>.
            </span>
          }
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 flex flex-wrap gap-2.5"
        >
          {tech.map((t) => (
            <motion.span key={t} variants={item} className="t-chip">
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
