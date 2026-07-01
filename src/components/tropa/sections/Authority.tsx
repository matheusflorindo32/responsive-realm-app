import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import iconUrl from "@/assets/tropa-icon.png";

export function Authority() {
  return (
    <section aria-labelledby="authority-title" className="py-20 md:py-28">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid lg:grid-cols-12 gap-10 items-center t-glass rounded-3xl p-8 md:p-12"
        >
          <div className="lg:col-span-5">
            <div className="relative aspect-square max-w-sm mx-auto">
              <div
                aria-hidden
                className="absolute inset-0 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, hsl(213 94% 68% / 0.4), transparent 70%)",
                }}
              />
              <img
                src={iconUrl}
                alt="Emblema Tropa Científica"
                width={480}
                height={480}
                loading="lazy"
                className="relative w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="t-eyebrow">Autoridade</span>
            <h2
              id="authority-title"
              className="mt-4 text-3xl md:text-4xl font-semibold text-foreground leading-tight"
            >
              Vivência, ciência, código e{" "}
              <span className="t-gradient-text">responsabilidade educativa</span>.
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              A Tropa Científica nasce da união entre vivência operacional, formação acadêmica,
              desenvolvimento tecnológico e compromisso com a educação. O objetivo é transformar
              temas complexos em conhecimento acessível, aplicável e visualmente claro.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/matheus"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold border border-border bg-white hover:border-primary/40 hover:text-primary transition-colors"
              >
                Conhecer o fundador
                <ArrowUpRight size={15} />
              </Link>
              <Link
                to="/matheus/publicacoes"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-muted-foreground hover:text-primary"
              >
                Ver publicações acadêmicas →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
