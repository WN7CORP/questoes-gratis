
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Clock, TrendingUp, Award, Star, RotateCcw, BookOpen } from 'lucide-react';

interface AreaStats {
  area: string;
  correct: number;
  total: number;
  percentage: number;
}

interface SessionStats {
  correct: number;
  total: number;
  startTime: number;
}

interface ExamInfo {
  exame?: string;
  ano?: string;
}

interface SimuladoResultsProps {
  sessionStats: SessionStats;
  areaStats: AreaStats[];
  previousAttempts: any[];
  examInfo: ExamInfo;
  totalTime: number;
  onClose: () => void;
  onChooseNewArea?: () => void;
}

const SimuladoResults = ({
  sessionStats,
  areaStats,
  previousAttempts,
  examInfo,
  totalTime,
  onClose,
  onChooseNewArea
}: SimuladoResultsProps) => {
  const [showAllAreas, setShowAllAreas] = useState(false);
  
  const percentage = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
  const averageTime = sessionStats.total > 0 ? Math.round(totalTime / sessionStats.total) : 0;
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Excelente! Você domina muito bem esta área!", color: "text-green-400", icon: "🏆" };
    if (percentage >= 80) return { message: "Muito bom! Continue praticando para melhorar ainda mais.", color: "text-blue-400", icon: "🎯" };
    if (percentage >= 70) return { message: "Bom desempenho! Foque nas áreas que precisa melhorar.", color: "text-yellow-400", icon: "👍" };
    if (percentage >= 60) return { message: "Regular. Revise os conteúdos e pratique mais.", color: "text-orange-400", icon: "📚" };
    return { message: "Precisa estudar mais. Não desista, continue praticando!", color: "text-red-400", icon: "💪" };
  };

  const performance = getPerformanceMessage();
  const isAreaStudy = examInfo.exame === 'Estudo de Área';

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}min ${secs}s`;
    }
    return `${minutes}min ${secs}s`;
  };

  const displayedAreas = showAllAreas ? areaStats : areaStats.slice(0, 5);

  return (
    <div className="min-h-screen bg-netflix-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-4 shadow-lg">
              <Trophy className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isAreaStudy ? 'Resultado do Estudo de Área' : 'Resultado do Simulado'}
          </h1>
          <p className="text-gray-400">
            {isAreaStudy ? examInfo.ano : `${examInfo.exame} - ${examInfo.ano}`}
          </p>
        </div>

        {/* Performance Overview */}
        <Card className="bg-netflix-card border-netflix-border p-6 mb-6 animate-fade-in">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-white mb-2">{percentage}%</div>
            <div className={`text-lg ${performance.color} mb-4 flex items-center justify-center gap-2`}>
              <span>{performance.icon}</span>
              {performance.message}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{sessionStats.correct}</div>
              <div className="text-sm text-gray-400">Acertos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{sessionStats.total - sessionStats.correct}</div>
              <div className="text-sm text-gray-400">Erros</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{sessionStats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{formatTime(totalTime)}</div>
              <div className="text-sm text-gray-400">Tempo Total</div>
            </div>
          </div>
        </Card>

        {/* Performance by Area */}
        {areaStats.length > 0 && (
          <Card className="bg-netflix-card border-netflix-border p-6 mb-6 animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="text-blue-500" size={24} />
              Desempenho por Área
            </h3>
            
            <div className="space-y-3">
              {displayedAreas.map((area, index) => (
                <div key={area.area} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-white font-medium">{area.area}</div>
                    <div className="text-sm text-gray-400">{area.correct} de {area.total} questões</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          area.percentage >= 80 ? 'bg-green-500' : 
                          area.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${area.percentage}%` }}
                      />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        area.percentage >= 80 ? 'border-green-500 text-green-400' : 
                        area.percentage >= 60 ? 'border-yellow-500 text-yellow-400' : 'border-red-500 text-red-400'
                      } bg-transparent`}
                    >
                      {area.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {areaStats.length > 5 && (
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowAllAreas(!showAllAreas)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {showAllAreas ? 'Mostrar menos' : `Ver mais ${areaStats.length - 5} áreas`}
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Time Analysis */}
        <Card className="bg-netflix-card border-netflix-border p-6 mb-6 animate-fade-in">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="text-orange-500" size={24} />
            Análise de Tempo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-orange-400">{formatTime(totalTime)}</div>
              <div className="text-sm text-gray-400">Tempo Total</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-orange-400">{averageTime}s</div>
              <div className="text-sm text-gray-400">Tempo por Questão</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-orange-400">
                {averageTime <= 90 ? 'Excelente' : averageTime <= 120 ? 'Bom' : 'Pode melhorar'}
              </div>
              <div className="text-sm text-gray-400">Velocidade</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          {isAreaStudy && onChooseNewArea && (
            <Button
              onClick={onChooseNewArea}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-200"
            >
              <BookOpen size={20} />
              Estudar Outra Área
            </Button>
          )}
          
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <RotateCcw size={20} />
            {isAreaStudy ? 'Voltar às Áreas' : 'Novo Simulado'}
          </Button>
        </div>

        {/* Motivation Message */}
        <div className="text-center mt-8 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600/30 rounded-lg animate-fade-in">
          <p className="text-gray-300 text-lg">
            {percentage >= 80 ? 
              "🎉 Parabéns pelo excelente desempenho! Continue praticando para manter o nível." :
              "💪 Continue estudando! Cada questão respondida é um passo mais próximo da aprovação."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimuladoResults;
