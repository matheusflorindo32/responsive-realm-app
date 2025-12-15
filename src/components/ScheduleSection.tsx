import { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

const scheduleData = [
  {
    day: "Dia 1 - Sexta-feira",
    date: "15 de Março",
    events: [
      { time: "14:00", title: "Credenciamento", description: "Check-in dos participantes e entrega dos kits." },
      { time: "16:00", title: "Cerimônia de Abertura", description: "Boas-vindas e apresentação dos desafios." },
      { time: "17:30", title: "Formação de Equipes", description: "Networking e formação dos times." },
      { time: "19:00", title: "Início do Hackathon", description: "Começa a maratona de desenvolvimento!" },
      { time: "21:00", title: "Jantar", description: "Pausa para alimentação." },
    ],
  },
  {
    day: "Dia 2 - Sábado",
    date: "16 de Março",
    events: [
      { time: "08:00", title: "Café da Manhã", description: "Recarregue as energias." },
      { time: "10:00", title: "Mentoria Técnica", description: "Sessões com especialistas em diferentes áreas." },
      { time: "12:00", title: "Almoço", description: "Intervalo para refeição." },
      { time: "14:00", title: "Workshop de Pitch", description: "Aprenda a apresentar sua ideia." },
      { time: "18:00", title: "Check-in de Progresso", description: "Validação intermediária dos projetos." },
    ],
  },
  {
    day: "Dia 3 - Domingo",
    date: "17 de Março",
    events: [
      { time: "08:00", title: "Café da Manhã", description: "Última refeição antes da reta final." },
      { time: "12:00", title: "Deadline de Submissão", description: "Entrega oficial dos projetos." },
      { time: "14:00", title: "Apresentações", description: "Pitches para a banca julgadora." },
      { time: "17:00", title: "Premiação", description: "Anúncio dos vencedores e entrega dos prêmios." },
      { time: "18:00", title: "Encerramento", description: "Confraternização final." },
    ],
  },
];

const ScheduleSection = () => {
  const [expandedDay, setExpandedDay] = useState<number>(0);
  const [expandedEvents, setExpandedEvents] = useState<{ [key: string]: boolean }>({});

  const toggleEvent = (dayIndex: number, eventIndex: number) => {
    const key = `${dayIndex}-${eventIndex}`;
    setExpandedEvents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section id="programacao" className="py-20 md:py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">PROGRAMAÇÃO</span>{" "}
            <span className="text-primary neon-text">DO EVENTO</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Confira a agenda completa dos três dias de evento e prepare-se para
            uma experiência intensa de aprendizado e criação.
          </p>
        </div>

        {/* Day Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {scheduleData.map((day, index) => (
            <button
              key={index}
              onClick={() => setExpandedDay(index)}
              className={`px-6 py-3 rounded-lg font-display text-sm transition-all duration-300 ${
                expandedDay === index
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        {/* Schedule Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="font-body text-lg text-primary">
              {scheduleData[expandedDay].date}
            </span>
          </div>

          <div className="space-y-4">
            {scheduleData[expandedDay].events.map((event, eventIndex) => {
              const isExpanded = expandedEvents[`${expandedDay}-${eventIndex}`];
              return (
                <div
                  key={eventIndex}
                  className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
                >
                  <button
                    onClick={() => toggleEvent(expandedDay, eventIndex)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Clock className="w-4 h-4" />
                        <span className="font-display text-sm font-bold">
                          {event.time}
                        </span>
                      </div>
                      <span className="font-display text-foreground font-semibold">
                        {event.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? "max-h-32 pb-4" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 font-body text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
