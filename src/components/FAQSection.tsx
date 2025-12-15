import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Você está disponível para projetos freelance?",
    answer: "Sim! Estou sempre aberto a novos desafios e projetos interessantes. Entre em contato através do formulário ou redes sociais para discutirmos seu projeto.",
  },
  {
    question: "Quais tecnologias você domina?",
    answer: "Trabalho principalmente com React, TypeScript, Node.js e Python. Também tenho experiência com bancos de dados SQL e NoSQL, Docker, e ferramentas de machine learning como TensorFlow e Scikit-learn.",
  },
  {
    question: "Você trabalha com projetos de pesquisa científica?",
    answer: "Sim! Tenho experiência em desenvolver ferramentas e sistemas para apoiar pesquisas científicas, incluindo análise de dados, visualização e automação de processos laboratoriais.",
  },
  {
    question: "Qual é o seu processo de trabalho?",
    answer: "Começo entendendo profundamente o problema, depois faço um planejamento detalhado. Trabalho com metodologias ágeis, mantendo comunicação constante e entregas incrementais.",
  },
  {
    question: "Como posso entrar em contato?",
    answer: "Você pode me encontrar através do formulário de contato neste site, pelo LinkedIn, ou enviar um e-mail diretamente. Respondo todas as mensagens em até 24 horas.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">PERGUNTAS</span>{" "}
            <span className="text-primary neon-text">FREQUENTES</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre meu trabalho e disponibilidade.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left group"
                aria-expanded={openIndex === index}
              >
                <span className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 font-body text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
