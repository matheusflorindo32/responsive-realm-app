import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  count?: number;
}

interface Props {
  search: string;
  onSearch: (v: string) => void;
  filters?: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: Option[];
  }[];
  totalCount?: number;
  filteredCount?: number;
  onReset?: () => void;
}

export function FilterBar({ search, onSearch, filters = [], totalCount, filteredCount, onReset }: Props) {
  const hasFilter = search.length > 0 || filters.some((f) => f.value);
  return (
    <div className="card-surface p-4 md:p-5 space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar por título, autor, instituição, ano..."
            className="w-full h-10 pl-9 pr-9 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary p-1"
              aria-label="Limpar busca"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {filters.map((f) => (
          <select
            key={f.label}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className={cn(
              "h-10 rounded-md border border-border bg-background text-sm px-3 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 min-w-[160px]",
              f.value ? "text-primary font-medium" : "text-muted-foreground",
            )}
          >
            <option value="">{f.label}: todos</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}{o.count != null ? ` (${o.count})` : ""}
              </option>
            ))}
          </select>
        ))}
      </div>
      {(totalCount != null || hasFilter) && (
        <div className="flex items-center justify-between text-[12px] mono text-muted-foreground">
          <span>
            {filteredCount != null && filteredCount !== totalCount
              ? `${filteredCount} de ${totalCount} resultado${totalCount === 1 ? "" : "s"}`
              : `${totalCount} resultado${totalCount === 1 ? "" : "s"}`}
          </span>
          {hasFilter && onReset && (
            <button onClick={onReset} className="text-accent hover:underline">
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
