import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  message: string;
  terms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  terms?: string;
}

const RegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    experience: "",
    message: "",
    terms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    // Experience validation
    if (!formData.experience) {
      newErrors.experience = "Selecione seu nível de experiência";
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = "Você deve aceitar os termos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmittedName(formData.name.split(" ")[0]);
      setIsSubmitted(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        experience: "",
        message: "",
        terms: false,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  if (isSubmitted) {
    return (
      <section id="inscricao" className="py-20 md:py-32 bg-secondary/30 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="glass-card rounded-2xl p-12 neon-border">
              <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Inscrição Realizada!
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                Obrigado, <span className="text-primary font-semibold">{submittedName}</span>!
                Sua inscrição foi enviada com sucesso. Entraremos em contato em breve
                com mais informações sobre o evento.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
              >
                Fazer Nova Inscrição
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="inscricao" className="py-20 md:py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">FAÇA SUA</span>{" "}
            <span className="text-primary neon-text">INSCRIÇÃO</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Garanta sua vaga no TechNexus Hackathon 2025. As vagas são limitadas!
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-8 md:p-10 neon-border"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block font-body text-sm font-medium text-foreground mb-2"
                >
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-muted border ${
                    errors.name ? "border-destructive" : "border-border"
                  } text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive font-body">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-body text-sm font-medium text-foreground mb-2"
                >
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-muted border ${
                    errors.email ? "border-destructive" : "border-border"
                  } text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive font-body">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block font-body text-sm font-medium text-foreground mb-2"
                >
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-muted border ${
                    errors.phone ? "border-destructive" : "border-border"
                  } text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-destructive font-body">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Experience Level - Select */}
              <div className="md:col-span-2">
                <label
                  htmlFor="experience"
                  className="block font-body text-sm font-medium text-foreground mb-2"
                >
                  Nível de Experiência *
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-muted border ${
                    errors.experience ? "border-destructive" : "border-border"
                  } text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                >
                  <option value="">Selecione seu nível</option>
                  <option value="iniciante">Iniciante (menos de 1 ano)</option>
                  <option value="intermediario">Intermediário (1-3 anos)</option>
                  <option value="avancado">Avançado (3-5 anos)</option>
                  <option value="expert">Expert (+5 anos)</option>
                </select>
                {errors.experience && (
                  <p className="mt-1 text-sm text-destructive font-body">
                    {errors.experience}
                  </p>
                )}
              </div>

              {/* Message - Textarea */}
              <div className="md:col-span-2">
                <label
                  htmlFor="message"
                  className="block font-body text-sm font-medium text-foreground mb-2"
                >
                  Por que você quer participar?
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="Conte-nos um pouco sobre você e suas motivações..."
                />
              </div>

              {/* Terms Checkbox */}
              <div className="md:col-span-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-border bg-muted text-primary focus:ring-primary/50"
                  />
                  <span className="font-body text-sm text-muted-foreground">
                    Li e aceito os{" "}
                    <a href="#" className="text-primary hover:underline">
                      Termos de Participação
                    </a>{" "}
                    e a{" "}
                    <a href="#" className="text-primary hover:underline">
                      Política de Privacidade
                    </a>
                    . *
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-sm text-destructive font-body">
                    {errors.terms}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="hero" size="lg" className="w-full">
              <Send className="w-5 h-5" />
              Enviar Inscrição
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
