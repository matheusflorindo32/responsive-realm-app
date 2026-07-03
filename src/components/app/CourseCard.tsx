import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { AccessStatusBadge } from "./AccessStatusBadge";

interface Props {
  slug: string;
  title: string;
  trailName?: string;
  summary?: string;
  coverUrl?: string;
  pct: number;
  expiresAt?: string | null;
  status?: string;
}

export function CourseCard({ slug, title, trailName, summary, coverUrl, pct, expiresAt, status }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative"
    >
      <Link to={`/app/curso/${slug}`}>
        <div className="rounded-xl overflow-hidden bg-card/60 border border-border/60 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_40px_-15px_hsl(var(--primary)/0.5)] h-full flex flex-col">
          <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-primary/5 to-transparent overflow-hidden">
            {coverUrl ? (
              <img src={coverUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            ) : (
              <div className="w-full h-full grid place-items-center text-primary/40">
                <PlayCircle className="w-16 h-16" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute top-3 right-3">
              <AccessStatusBadge expiresAt={expiresAt} status={status} />
            </div>
          </div>

          <div className="p-5 flex flex-col flex-1 gap-3">
            {trailName && (
              <span className="text-[10px] uppercase tracking-[0.15em] text-primary/70 font-medium">{trailName}</span>
            )}
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{title}</h3>
            {summary && <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{summary}</p>}

            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{pct === 100 ? "Concluído" : pct > 0 ? "Em andamento" : "Não iniciado"}</span>
                <span className="tabular-nums font-medium text-foreground">{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>

            <Button variant="ghost" size="sm" className="justify-between -mx-2 mt-1 group-hover:bg-primary/10 group-hover:text-primary">
              {pct > 0 ? "Continuar" : "Começar"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
