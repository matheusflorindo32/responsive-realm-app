import { motion } from "framer-motion";

export function SectionHead({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-3xl"}
    >
      <span className="t-eyebrow">{eyebrow}</span>
      <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-[1.05]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
