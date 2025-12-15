import { Linkedin, Twitter } from "lucide-react";

const speakers = [
  {
    name: "Ana Silva",
    role: "CTO @ TechCorp",
    specialty: "Inteligência Artificial",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Carlos Mendes",
    role: "Lead Developer @ StartupX",
    specialty: "Blockchain & Web3",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Juliana Costa",
    role: "Product Designer @ DesignHub",
    specialty: "UX/UI Design",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Roberto Santos",
    role: "VP Engineering @ BigTech",
    specialty: "Cloud & DevOps",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
];

const SpeakersSection = () => {
  return (
    <section id="palestrantes" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-primary neon-text">MENTORES</span>{" "}
            <span className="text-foreground">& PALESTRANTES</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Conheça os especialistas que irão guiar você durante o evento e
            compartilhar suas experiências.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {speakers.map((speaker, index) => (
            <div
              key={speaker.name}
              className="group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-card rounded-2xl p-6 text-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
                {/* Avatar */}
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-50 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="relative w-full h-full rounded-full object-cover border-2 border-primary/50"
                  />
                </div>

                {/* Info */}
                <h4 className="font-display text-lg font-bold text-foreground mb-1">
                  {speaker.name}
                </h4>
                <p className="font-body text-sm text-primary mb-1">
                  {speaker.role}
                </p>
                <p className="font-body text-xs text-muted-foreground mb-4">
                  {speaker.specialty}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={`LinkedIn de ${speaker.name}`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={`Twitter de ${speaker.name}`}
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
