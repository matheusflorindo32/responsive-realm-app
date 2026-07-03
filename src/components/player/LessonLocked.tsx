import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LessonLocked({ reason }: { reason?: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-8 text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-muted/50 grid place-items-center mx-auto">
        <Lock className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">Acesso bloqueado</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          {reason ?? "Sua matrícula neste curso expirou ou ainda não foi liberada. Fale com o administrador para renovar o acesso."}
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <a href="mailto:contato@tropacientifica.com.br?subject=Solicitar%20acesso%20a%20curso"><Mail className="w-4 h-4" />Solicitar acesso</a>
      </Button>
    </div>
  );
}
