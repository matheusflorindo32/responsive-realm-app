import { Link } from "react-router-dom";
import { Award, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface Cert { certificate_code: string; course_title?: string; issued_at: string }

export function CertificateHighlight({ certs }: { certs: Cert[] }) {
  if (!certs.length) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Certificados recentes</h3>
        <Link to="/app/certificados" className="text-xs text-primary hover:underline">Ver todos</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {certs.slice(0, 3).map((c, i) => (
          <motion.a
            key={c.certificate_code}
            href={`/certificado/${c.certificate_code}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-3 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card to-card p-4 hover:border-amber-500/50 transition-all"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-500/20 grid place-items-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate">{c.course_title ?? "Certificado"}</div>
              <div className="text-xs text-muted-foreground">{new Date(c.issued_at).toLocaleDateString()}</div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
