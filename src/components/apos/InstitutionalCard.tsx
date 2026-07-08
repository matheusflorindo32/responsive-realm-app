import { motion } from "framer-motion";

interface Props {
  role?: string;
  group: string;
  university: string;
  center?: string;
  className?: string;
}

/**
 * Card institucional de autoridade acadêmica.
 * Substitui o antigo bloco "Afiliação" (que parecia badge).
 * Estilo selo editorial: hairline gold, eyebrow mono, tipografia serifada no nome do grupo.
 */
export function InstitutionalCard({
  role = "Membro Pesquisador",
  group,
  university,
  center,
  className = "",
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={
        "relative rounded-md border border-border/70 bg-background/80 backdrop-blur-sm " +
        "px-6 py-6 md:px-7 md:py-7 " + className
      }
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="eyebrow flex items-center gap-2 text-[10.5px]">
        <span className="h-px w-6 bg-gold" />
        <span>{role}</span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="font-serif text-[19px] md:text-[21px] leading-snug text-primary tracking-tight">
          {group}
        </div>
        <div className="flex flex-col gap-1 text-[13px] text-foreground/85">
          <span className="leading-snug">{university}</span>
          {center && (
            <span className="text-muted-foreground leading-snug">{center}</span>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 text-[10px] mono uppercase tracking-[0.18em] text-muted-foreground">
        <span className="h-px flex-1 bg-border/80" />
        <span>UFES · CEFD</span>
        <span className="h-px flex-1 bg-border/80" />
      </div>
    </motion.div>
  );
}
