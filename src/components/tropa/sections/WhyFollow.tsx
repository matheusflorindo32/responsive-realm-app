import { motion } from "framer-motion";
import { SectionHead } from "./SectionHead";
import { benefits } from "@/data/tropa-content";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function WhyFollow() {
  return (
    <section aria-labelledby="why-title" className="py-20 md:py-28">
      <div className="container-wide">
        <SectionHead
          eyebrow="Por que acompanhar"
          title={
            <span id="why-title">
              Rigor técnico com <span className="t-gradient-text">clareza editorial</span>.
            </span>
          }
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((b) => (
            <motion.div key={b.title} variants={item} className="flex gap-4">
              <span className="shrink-0 grid place-items-center h-11 w-11 rounded-xl bg-gradient-to-br from-primary/12 to-accent/10 text-primary ring-1 ring-primary/15">
                <b.icon size={18} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-foreground">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{b.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
