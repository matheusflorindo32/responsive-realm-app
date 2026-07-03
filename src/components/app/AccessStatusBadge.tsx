import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export function AccessStatusBadge({ expiresAt, status }: { expiresAt?: string | null; status?: string }) {
  if (status && status !== "active") {
    return <Badge variant="secondary" className="gap-1"><XCircle className="w-3 h-3" />{status}</Badge>;
  }
  if (!expiresAt) {
    return <Badge className="gap-1 bg-emerald-500/15 text-emerald-300 border-emerald-500/30 border hover:bg-emerald-500/20"><CheckCircle2 className="w-3 h-3" />Ativo</Badge>;
  }
  const now = Date.now();
  const exp = new Date(expiresAt).getTime();
  const days = Math.ceil((exp - now) / 86400000);
  if (days < 0) return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Expirado</Badge>;
  if (days < 15) return <Badge className="gap-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"><AlertTriangle className="w-3 h-3" />Expira em {days}d</Badge>;
  return <Badge className="gap-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20"><Clock className="w-3 h-3" />Ativo até {new Date(expiresAt).toLocaleDateString()}</Badge>;
}
