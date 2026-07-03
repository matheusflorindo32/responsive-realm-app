import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Award, Clock } from "lucide-react";

interface Stat { icon: React.ElementType; label: string; value: string | number; accent?: string }

export function DashboardStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 overflow-hidden group hover:border-primary/30 transition-colors"
        >
          <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-30 ${s.accent ?? "bg-primary/40"}`} />
          <s.icon className="w-4 h-4 text-primary mb-3" />
          <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export const statIcons = { BookOpen, CheckCircle2, Award, Clock };
