
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

const concursoTips = [{
  day: 1,
  title: "Organize seu cronograma",
  tip: "Dedique pelo menos 3 horas diárias de estudo, dividindo entre teoria e questões práticas. A consistência é fundamental para aprovação."
}, {
  day: 2,
  title: "Conheça o edital profundamente",
  tip: "Leia o edital várias vezes e destaque os pontos mais importantes. O edital é sua bússola de estudos."
}, {
  day: 3,
  title: "Pratique questões diariamente",
  tip: "Resolva no mínimo 20 questões por dia. A prática constante melhora sua velocidade e precisão na prova."
}, {
  day: 4,
  title: "Domine Direito Constitucional",
  tip: "Foque nos direitos fundamentais, organização do Estado e controle de constitucionalidade. É matéria básica em qualquer concurso."
}, {
  day: 5,
  title: "Revise questões erradas",
  tip: "Mantenha um caderno de erros. Revise semanalmente as questões que você errou e entenda o motivo do erro."
}, {
  day: 6,
  title: "Simule condições reais",
  tip: "Faça simulados cronometrados para treinar o gerenciamento do tempo na prova real."
}, {
  day: 7,
  title: "Estude Direito Administrativo",
  tip: "Concentre-se em princípios, atos administrativos, licitações e contratos. É essencial para concursos públicos."
}, {
  day: 8,
  title: "Mantenha-se atualizado",
  tip: "Acompanhe mudanças legislativas recentes e jurisprudência dos tribunais superiores."
}, {
  day: 9,
  title: "Pratique redação discursiva",
  tip: "Para provas discursivas, treine redação jurídica seguindo modelos padrão e jurisprudência atual."
}, {
  day: 10,
  title: "Gerencie seu tempo",
  tip: "Calcule quanto tempo pode gastar por questão e pratique esse ritmo durante os estudos."
}, {
  day: 11,
  title: "Estude Direito Penal sistematicamente",
  tip: "Concentre-se na parte geral, crimes contra a pessoa e patrimônio. São temas recorrentes."
}, {
  day: 12,
  title: "Domine os processos",
  tip: "Direito Processual Civil e Penal: foque em procedimentos, recursos e prazos processuais."
}, {
  day: 13,
  title: "Use técnicas de memorização",
  tip: "Crie mnemônicos para lembrar de listas, prazos e classificações importantes do direito."
}, {
  day: 14,
  title: "Faça pausas estratégicas",
  tip: "Descanse a cada 2 horas de estudo. O cérebro precisa consolidar o aprendizado."
}, {
  day: 15,
  title: "Estude em grupo",
  tip: "Discussões com colegas ajudam a esclarecer dúvidas e fixar conceitos jurídicos."
}, {
  day: 16,
  title: "Analise bancas anteriores",
  tip: "Cada banca tem seu estilo. Estude provas anteriores da mesma organizadora."
}, {
  day: 17,
  title: "Cuide da saúde mental",
  tip: "Pratique exercícios, durma bem e mantenha uma alimentação equilibrada durante os estudos."
}, {
  day: 18,
  title: "Revise diariamente",
  tip: "Reserve 30 minutos diários para revisar o que estudou nos dias anteriores."
}, {
  day: 19,
  title: "Domine Direito do Trabalho",
  tip: "Foque em contrato de trabalho, jornada, férias, FGTS e rescisão contratual."
}, {
  day: 20,
  title: "Pratique interpretação",
  tip: "Leia com atenção. Muitas questões testam interpretação de texto, não só conhecimento jurídico."
}, {
  day: 21,
  title: "Estude Direito Tributário",
  tip: "Concentre-se no Sistema Tributário Nacional, princípios e limitações ao poder de tributar."
}, {
  day: 22,
  title: "Organize seus materiais",
  tip: "Tenha resumos bem estruturados para revisão final nos últimos dias antes da prova."
}, {
  day: 23,
  title: "Mantenha a calma",
  tip: "No dia da prova, chegue cedo, leia as questões com calma e comece pelas mais fáceis."
}, {
  day: 24,
  title: "Treine eliminação",
  tip: "Aprenda a eliminar alternativas claramente erradas para aumentar suas chances de acerto."
}, {
  day: 25,
  title: "Revise jurisprudência",
  tip: "Acompanhe súmulas do STF e STJ, especialmente as mais recentes e relevantes."
}, {
  day: 26,
  title: "Foque nos detalhes",
  tip: "Questões de concurso costumam testar conhecimentos específicos e detalhados da legislação."
}, {
  day: 27,
  title: "Pratique concentração",
  tip: "Treine estudar em ambientes com ruído para simular condições adversas da prova."
}, {
  day: 28,
  title: "Revise prazos processuais",
  tip: "Crie uma tabela com todos os prazos processuais e prazos prescricionais importantes."
}, {
  day: 29,
  title: "Confie no seu preparo",
  tip: "Nos últimos dias, evite estudar matéria nova. Foque em revisar o que já domina."
}, {
  day: 30,
  title: "Visualize o sucesso",
  tip: "Imagine-se aprovado. A confiança e o mindset positivo fazem diferença na prova."
}, {
  day: 31,
  title: "Última revisão",
  tip: "Revise apenas os pontos mais importantes. Mantenha a calma e confie no seu preparo."
}];

const ConcursoTipsCarousel = () => {
  const [currentTip, setCurrentTip] = useState(0);
  
  const nextTip = () => {
    setCurrentTip(prev => (prev + 1) % concursoTips.length);
  };
  
  const prevTip = () => {
    setCurrentTip(prev => (prev - 1 + concursoTips.length) % concursoTips.length);
  };

  // Função para obter o número de dias no mês atual
  const getDaysInCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Função para obter a dica do dia atual
  const getTodayTip = () => {
    const currentDay = new Date().getDate();
    const daysInMonth = getDaysInCurrentMonth();
    
    // Se o dia atual é maior que o número de dicas disponíveis, 
    // usa a última dica disponível
    if (currentDay > concursoTips.length) {
      return concursoTips[concursoTips.length - 1];
    }
    
    return concursoTips.find(tip => tip.day === currentDay) || concursoTips[0];
  };

  const todayTip = getTodayTip();
  const daysInMonth = getDaysInCurrentMonth();

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
            <p className="text-blue-200">Sua dica diária para o sucesso em concursos</p>
          </div>
        </div>
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-600/30">
          <h4 className="text-white font-semibold mb-2">{todayTip.title}</h4>
          <p className="text-blue-100">{todayTip.tip}</p>
        </div>
      </Card>

      {/* Carousel */}
      <Card className="bg-netflix-card border-netflix-border p-6 px-[14px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">
            {daysInMonth} Dicas para Concursos
          </h3>
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
              {currentTip + 1} / {Math.min(concursoTips.length, daysInMonth)}
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
              <span className="text-white font-bold text-sm">{concursoTips[currentTip].day}</span>
            </div>
            <h4 className="text-white font-semibold">{concursoTips[currentTip].title}</h4>
          </div>
          <p className="text-gray-300 leading-relaxed">{concursoTips[currentTip].tip}</p>
        </div>

        {/* Progress indicators - mostra apenas os dias do mês atual */}
        <div className="flex gap-1 mt-4 justify-center flex-wrap">
          {Array.from({ length: Math.min(10, daysInMonth) }, (_, index) => (
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

export default ConcursoTipsCarousel;
