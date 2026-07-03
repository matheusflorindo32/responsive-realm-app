import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { AccessStatusBadge } from "./AccessStatusBadge";

export function TrailCard({ name, description, expiresAt, status }: { name: string; description?: string; expiresAt?: string | null; status?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-5 bg-gradient-to-br from-primary/10 via-card/60 to-card/40 border border-primary/30 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-primary font-medium">
          <Layers className="w-3.5 h-3.5" />
          Trilha completa
        </div>
        <AccessStatusBadge expiresAt={expiresAt} status={status} />
      </div>
      <h3 className="mt-3 font-semibold text-lg">{name}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>}
      <p className="text-xs text-muted-foreground/70 mt-4">Acesso liberado a todos os cursos desta trilha.</p>
    </motion.div>
  );
}
