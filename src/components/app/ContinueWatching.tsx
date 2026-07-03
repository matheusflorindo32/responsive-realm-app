import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Props {
  courseTitle: string;
  courseSlug: string;
  lessonTitle: string;
  pct: number;
  trailName?: string;
}

export function ContinueWatching({ courseTitle, courseSlug, lessonTitle, pct, trailName }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-6 md:p-8"
    >
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-medium mb-2">Continuar de onde parou</div>
          {trailName && <div className="text-xs text-muted-foreground mb-1">{trailName}</div>}
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">{courseTitle}</h2>
          <p className="text-muted-foreground mt-1 truncate">Próxima aula: {lessonTitle}</p>
          <div className="mt-4 max-w-md">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Progresso do curso</span>
              <span className="font-medium tabular-nums">{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
        </div>
        <Link to={`/app/curso/${courseSlug}`} className="shrink-0">
          <Button size="lg" className="gap-2 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.6)]">
            <Play className="w-4 h-4 fill-current" />
            Continuar aula
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
