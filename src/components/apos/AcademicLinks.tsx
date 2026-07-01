import type { LinkItem } from "@/data/types";
import { ExternalLink } from "lucide-react";

export function AcademicLinks({ links }: { links: LinkItem[] }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
      {links.map((l) => (
        <a
          key={l.id}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-surface card-lift p-4 flex items-center justify-between gap-3 group"
        >
          <div>
            <div className="text-[13px] font-semibold text-primary">{l.platform}</div>
            {l.category && (
              <div className="eyebrow mt-0.5">{l.category}</div>
            )}
          </div>
          <ExternalLink size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
        </a>
      ))}
    </div>
  );
}
