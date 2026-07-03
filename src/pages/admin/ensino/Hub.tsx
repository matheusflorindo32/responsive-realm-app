import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Users, GraduationCap, AlertTriangle, XCircle, BookOpen, Layers, Award, TrendingUp, UserMinus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const cardsConfig = [
  { key: "students_total", label: "Alunos únicos", icon: Users, accent: "bg-primary/40" },
  { key: "enrollments_active", label: "Matrículas ativas", icon: GraduationCap, accent: "bg-emerald-500/40" },
  { key: "enrollments_expiring", label: "Expirando (<15d)", icon: AlertTriangle, accent: "bg-amber-500/40" },
  { key: "enrollments_expired", label: "Expiradas", icon: XCircle, accent: "bg-red-500/40" },
  { key: "courses_published", label: "Cursos publicados", icon: BookOpen, accent: "bg-cyan-500/40" },
  { key: "trails_published", label: "Trilhas publicadas", icon: Layers, accent: "bg-indigo-500/40" },
  { key: "certificates_30d", label: "Certificados (30d)", icon: Award, accent: "bg-amber-500/40" },
  { key: "students_advanced", label: "Alunos avançados (≥50%)", icon: TrendingUp, accent: "bg-emerald-500/40" },
  { key: "students_inactive_30d", label: "Alunos inativos (30d)", icon: UserMinus, accent: "bg-muted-foreground/40" },
];

const quickLinks = [
  { to: "/admin/ensino/trilhas", label: "Trilhas", desc: "Gerenciar nichos e áreas" },
  { to: "/admin/ensino/cursos", label: "Cursos", desc: "CRUD de cursos e aulas" },
  { to: "/admin/ensino/matriculas", label: "Matrículas", desc: "Liberar e revogar acesso" },
  { to: "/admin/ensino/certificados", label: "Certificados", desc: "Revisar emitidos" },
  { to: "/admin/ensino/auditoria", label: "Auditoria", desc: "Histórico de ações" },
];

export default function EnsinoHub() {
  const metrics = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_metrics");
      if (error) throw error;
      return data as Record<string, number>;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Central de ensino</h1>
        <p className="text-muted-foreground text-sm">Visão geral da plataforma educacional.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {cardsConfig.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 overflow-hidden"
          >
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-30 ${c.accent}`} />
            <c.icon className="w-4 h-4 text-primary mb-2" />
            {metrics.isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-semibold tabular-nums">{metrics.data?.[c.key] ?? 0}</div>
            )}
            <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickLinks.map((q) => (
          <Link key={q.to} to={q.to}>
            <Card className="hover:border-primary/40 transition-colors group h-full">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{q.label}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{q.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
