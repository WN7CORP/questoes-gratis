
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

const oabTips = [
  {
    day: 1,
    title: "Organize seu cronograma",
    tip: "Dedique pelo menos 3 horas diárias de estudo, dividindo entre teoria e questões práticas."
  },
  {
    day: 2,
    title: "Foque na Ética Profissional",
    tip: "O Estatuto da OAB representa 20% da prova. Leia o regulamento completo pelo menos 3 vezes."
  },
  {
    day: 3,
    title: "Pratique questões diariamente",
    tip: "Resolva no mínimo 20 questões por dia. A prática constante melhora sua velocidade e precisão."
  },
  {
    day: 4,
    title: "Domine o Direito Constitucional",
    tip: "Foque nos direitos fundamentais, organização do Estado e controle de constitucionalidade."
  },
  {
    day: 5,
    title: "Revise questões erradas",
    tip: "Mantenha um caderno de erros. Revise semanalmente as questões que você errou."
  },
  {
    day: 6,
    title: "Simule condições reais",
    tip: "Faça simulados cronometrados para treinar o gerenciamento do tempo na prova."
  },
  {
    day: 7,
    title: "Estude Direito Civil sistematicamente",
    tip: "Foque em pessoas, bens, fatos jurídicos, obrigações e contratos. São temas recorrentes."
  },
  {
    day: 8,
    title: "Mantenha-se atualizado",
    tip: "Acompanhe mudanças legislativas recentes, especialmente no Código Civil e Penal."
  },
  {
    day: 9,
    title: "Pratique redação jurídica",
    tip: "Para a 2ª fase, treine peças processuais seguindo modelos padrão e jurisprudência atual."
  },
  {
    day: 10,
    title: "Gerencie seu tempo",
    tip: "Na 1ª fase, você tem aproximadamente 3,75 minutos por questão. Pratique esse ritmo."
  },
  {
    day: 11,
    title: "Estude Direito Penal com foco",
    tip: "Concentre-se na parte geral, crimes contra a pessoa e patrimônio."
  },
  {
    day: 12,
    title: "Domine os processos",
    tip: "Direito Processual Civil e Penal: foque em procedimentos, recursos e prazos."
  },
  {
    day: 13,
    title: "Use técnicas de memorização",
    tip: "Crie mnemônicos para lembrar de listas, prazos e classificações importantes."
  },
  {
    day: 14,
    title: "Faça pausas estratégicas",
    tip: "Descanse a cada 2 horas de estudo. O cérebro precisa consolidar o aprendizado."
  },
  {
    day: 15,
    title: "Estude em grupo",
    tip: "Discussões com colegas ajudam a esclarecer dúvidas e fixar conceitos."
  },
  {
    day: 16,
    title: "Analise bancas anteriores",
    tip: "Cada banca tem seu estilo. Estude provas da FGV dos últimos 5 anos."
  },
  {
    day: 17,
    title: "Cuide da saúde mental",
    tip: "Pratique exercícios, durma bem e mantenha uma alimentação equilibrada."
  },
  {
    day: 18,
    title: "Revise diariamente",
    tip: "Reserve 30 minutos diários para revisar o que estudou nos dias anteriores."
  },
  {
    day: 19,
    title: "Domine Direito do Trabalho",
    tip: "Foque em contrato de trabalho, jornada, férias, FGTS e rescisão contratual."
  },
  {
    day: 20,
    title: "Pratique interpretação",
    tip: "Leia com atenção. Muitas questões testam interpretação de texto, não só conhecimento."
  },
  {
    day: 21,
    title: "Estude Direito Administrativo",
    tip: "Concentre-se em princípios, atos administrativos, licitações e contratos."
  },
  {
    day: 22,
    title: "Organize seus materiais",
    tip: "Tenha resumos bem estruturados para revisão final nos últimos dias."
  },
  {
    day: 23,
    title: "Mantenha a calma",
    tip: "No dia da prova, chegue cedo, leia as questões com calma e comece pelas mais fáceis."
  },
  {
    day: 24,
    title: "Treine eliminação",
    tip: "Aprenda a eliminar alternativas claramente erradas para aumentar suas chances."
  },
  {
    day: 25,
    title: "Revise jurisprudência",
    tip: "Acompanhe súmulas do STF e STJ, especialmente as mais recentes."
  },
  {
    day: 26,
    title: "Foque nos detalhes",
    tip: "Questões de OAB costumam testar conhecimentos específicos e detalhados."
  },
  {
    day: 27,
    title: "Pratique concentração",
    tip: "Treine estudar em ambientes com ruído para simular condições adversas."
  },
  {
    day: 28,
    title: "Revise fórmulas e prazos",
    tip: "Crie uma tabela com todos os prazos processuais e prazos prescricionais."
  },
  {
    day: 29,
    title: "Confie no seu preparo",
    tip: "Nos últimos dias, evite estudar matéria nova. Foque em revisar o que já sabe."
  },
  {
    day: 30,
    title: "Visualize o sucesso",
    tip: "Imagine-se aprovado. A confiança e o mindset positivo fazem diferença na prova."
  }
];

const OabTipsCarousel = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % oabTips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + oabTips.length) % oabTips.length);
  };

  const currentDay = new Date().getDate();
  const todayTip = oabTips.find(tip => tip.day === currentDay) || oabTips[0];

  return (
    <div className="space-y-4">
      {/* Today's tip highlight */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 border-blue-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 rounded-lg p-3">
            <Lightbulb className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Dica do Dia {todayTip.day}</h3>
            <p className="text-blue-200">Sua dica diária para o sucesso na OAB</p>
          </div>
        </div>
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-600/30">
          <h4 className="text-white font-semibold mb-2">{todayTip.title}</h4>
          <p className="text-blue-100">{todayTip.tip}</p>
        </div>
      </Card>

      {/* Carousel */}
      <Card className="bg-netflix-card border-netflix-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">30 Dicas para o Sucesso</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTip}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-gray-400 text-sm">
              {currentTip + 1} / {oabTips.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextTip}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-netflix-red rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{oabTips[currentTip].day}</span>
            </div>
            <h4 className="text-white font-semibold">{oabTips[currentTip].title}</h4>
          </div>
          <p className="text-gray-300 leading-relaxed">{oabTips[currentTip].tip}</p>
        </div>

        {/* Progress indicators */}
        <div className="flex gap-1 mt-4 justify-center">
          {oabTips.slice(0, 10).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTip(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentTip ? 'bg-netflix-red' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OabTipsCarousel;
