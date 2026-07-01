import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, align = "left", className }: Props) {
  return (
    <div className={cn(align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl", className)}>
      {eyebrow && (
        <div className={cn("eyebrow mb-3 flex items-center gap-2", align === "center" && "justify-center")}>
          <span className="h-px w-6 bg-gold" />
          {eyebrow}
        </div>
      )}
      <h2 className="display-title text-3xl md:text-4xl text-primary">{title}</h2>
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
