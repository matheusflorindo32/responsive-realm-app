import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback?: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen grid place-items-center bg-background text-foreground p-6">
          <div className="max-w-md text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-destructive/15 grid place-items-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Algo deu errado</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {this.state.error?.message ?? "Ocorreu um erro inesperado."}
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>Recarregar</Button>
              <Button asChild><a href="/">Ir para o início</a></Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function SilentBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={null}>{children}</ErrorBoundary>;
}
