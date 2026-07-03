import { CheckCircle2, PlayCircle, Circle, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Lesson { id: string; title: string; order_index: number; is_preview?: boolean }
interface Module { id: string; title: string; order_index: number; lessons: Lesson[] }

interface Props {
  modules: Module[];
  selectedId?: string;
  completedIds: Set<string>;
  onSelect: (l: Lesson) => void;
  hasAccess: boolean;
}

export function LessonSidebar({ modules, selectedId, completedIds, onSelect, hasAccess }: Props) {
  return (
    <div className="space-y-4">
      {modules.map((m) => {
        const total = m.lessons.length;
        const done = m.lessons.filter((l) => completedIds.has(l.id)).length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        return (
          <div key={m.id} className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/40">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium truncate">{m.title}</h3>
                <span className="text-[10px] text-muted-foreground tabular-nums">{done}/{total}</span>
              </div>
              <Progress value={pct} className="h-1 mt-2" />
            </div>
            <ul>
              {m.lessons.map((l) => {
                const done = completedIds.has(l.id);
                const locked = !hasAccess && !l.is_preview;
                const active = l.id === selectedId;
                const Icon = locked ? Lock : done ? CheckCircle2 : active ? PlayCircle : Circle;
                return (
                  <li key={l.id}>
                    <button
                      onClick={() => onSelect(l)}
                      disabled={locked}
                      className={cn(
                        "w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors border-l-2",
                        active ? "bg-primary/10 border-primary text-foreground" : "border-transparent hover:bg-muted/40",
                        locked && "opacity-50 cursor-not-allowed",
                        done && !active && "text-muted-foreground",
                      )}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", done ? "text-emerald-400" : active ? "text-primary" : "text-muted-foreground")} />
                      <span className="truncate flex-1">{l.title}</span>
                      {l.is_preview && !hasAccess && <span className="text-[9px] uppercase tracking-wider text-primary/70">preview</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
