import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";

function toEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v"))
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video${u.pathname}`;
    return url;
  } catch {
    return url;
  }
}

export function VideoPlayer({ url, title }: { url?: string | null; title?: string }) {
  const embed = useMemo(() => (url ? toEmbed(url) : null), [url]);

  if (!embed) {
    return (
      <div className="aspect-video rounded-lg border border-border/60 bg-muted/30 grid place-items-center text-center p-6">
        <div className="text-muted-foreground space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto opacity-50" />
          <p className="text-sm">Vídeo indisponível para esta aula.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="aspect-video rounded-lg overflow-hidden border border-border/60 bg-black shadow-lg">
      <iframe
        src={embed}
        title={title ?? "Aula"}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
