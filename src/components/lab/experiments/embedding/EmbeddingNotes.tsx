import { DEFAULT_DIMS } from "@/lib/lab/embedding";

const REFS = [
  {
    cite: "MIKOLOV, T. et al. Efficient estimation of word representations in vector space. arXiv:1301.3781, 2013.",
    href: "https://arxiv.org/abs/1301.3781",
    why: "Trabalho que popularizou vetores de palavras em que proximidade geométrica reflete proximidade de uso.",
  },
  {
    cite: "JOLLIFFE, I. T.; CADIMA, J. Principal component analysis: a review and recent developments. Philosophical Transactions of the Royal Society A, v. 374, 20150202, 2016.",
    href: "https://doi.org/10.1098/rsta.2015.0202",
    why: "Revisão da PCA: as componentes principais são as direções de maior variância.",
  },
  {
    cite: "DASGUPTA, S.; GUPTA, A. An elementary proof of a theorem of Johnson and Lindenstrauss. Random Structures & Algorithms, v. 22, n. 1, p. 60–65, 2003.",
    href: "https://doi.org/10.1002/rsa.10073",
    why: "Projeções aleatórias preservam distâncias quando a dimensão de destino é grande o bastante — três eixos ficam muito abaixo disso.",
  },
  {
    cite: "WATTENBERG, M.; VIÉGAS, F.; JOHNSON, I. How to use t-SNE effectively. Distill, 2016.",
    href: "https://doi.org/10.23915/distill.00002",
    why: "Mostra, com exemplos interativos, como figuras de redução de dimensionalidade podem ser mal interpretadas.",
  },
  {
    cite: "OKABE, M.; ITO, K. Color universal design: how to make figures and presentations that are friendly to colorblind people. 2008.",
    href: "https://jfly.uni-koeln.de/color/",
    why: "Origem da paleta de cores usada nos grupos.",
  },
] as const;

/** Explicação científica, limites e referências do Embedding Space Explorer. */
export function EmbeddingNotes() {
  return (
    <div className="space-y-12">
      <section aria-labelledby="sci-title" className="rounded-[12px] bg-[hsl(222_47%_7%)] px-6 py-10 text-slate-100 sm:px-10 lg:py-14">
        <h2 id="sci-title" className="mono text-[11px] font-medium uppercase tracking-[0.22em] text-[hsl(199,89%,62%)]">
          O que você está vendo
        </h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Palavras como vetores</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Um modelo de embeddings transforma cada texto em uma lista de números. Textos usados em contextos parecidos recebem listas parecidas. Aqui cada termo tem{" "}
              {DEFAULT_DIMS} números; modelos reais usam de algumas centenas a alguns milhares.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Similaridade de cosseno</h3>
            <p className="mt-3 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 text-center font-mono text-[15px] text-slate-100" aria-label="cosseno de teta é igual ao produto escalar de a e b dividido pelo produto das normas de a e b">
              cos θ = (a · b) / (‖a‖ ‖b‖)
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Mede o ângulo entre dois vetores e ignora o comprimento. Vale 1 quando apontam na mesma direção, 0 quando são perpendiculares e −1 quando são opostos. É a medida mais usada em
              busca por significado.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Por que a figura distorce</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Para desenhar, {DEFAULT_DIMS} dimensões viram 3. Parte da informação se perde, e pontos distantes podem aparecer lado a lado. A PCA escolhe os eixos que retêm mais variância;
              ainda assim, a coluna "Em 3D" da leitura mostra vizinhos verdadeiros que a figura afasta.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="lim-title" className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="lim-title" className="text-2xl font-semibold leading-tight text-foreground">Limites desta demonstração</h2>
        </div>
        <ul className="space-y-4 text-sm leading-relaxed text-muted-foreground lg:col-span-8">
          <li className="border-l-2 border-[hsl(38,65%,48%)] pl-4">
            <strong className="font-semibold text-foreground">Os vetores são simulados.</strong> Não saíram de nenhum modelo de linguagem. Cada grupo recebeu um centro sorteado e cada termo é
            esse centro mais ruído gaussiano, com semente fixa. As palavras são apenas rótulos: o experimento não prova nada sobre o significado real delas.
          </li>
          <li className="border-l-2 border-border pl-4">
            <strong className="font-semibold text-foreground">A figura 3D é uma representação didática.</strong> Ela pode distorcer relações que existem no espaço de maior dimensão. Nunca
            conclua que dois itens são parecidos só porque aparecem próximos em uma projeção; confira a similaridade no espaço original.
          </li>
          <li className="border-l-2 border-border pl-4">
            <strong className="font-semibold text-foreground">Embeddings reais são menos comportados.</strong> Os grupos aqui são nuvens esféricas bem separadas por construção. Em dados reais os
            agrupamentos têm formas irregulares, tamanhos diferentes e sobreposição.
          </li>
          <li className="border-l-2 border-border pl-4">
            <strong className="font-semibold text-foreground">Os percentuais valem para esta amostra.</strong> Mude a semente e os números mudam. Eles ilustram o fenômeno; não são estimativas de
            desempenho de nenhum sistema.
          </li>
        </ul>
      </section>

      <section aria-labelledby="ref-title">
        <h2 id="ref-title" className="mono text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          Referências
        </h2>
        <ol className="mt-4 space-y-4">
          {REFS.map((r) => (
            <li key={r.href} className="border-t border-border pt-4 text-sm leading-relaxed">
              <p className="text-foreground">{r.cite}</p>
              <p className="mt-1 text-muted-foreground">{r.why}</p>
              <a href={r.href} target="_blank" rel="noreferrer" className="mt-1 inline-block break-all text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                {r.href}
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
