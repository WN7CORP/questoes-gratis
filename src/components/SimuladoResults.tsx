
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Award,
  GraduationCap,
  CheckCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';

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

interface PreviousAttempt {
  correct_answers: number;
  questions_answered: number;
  total_time: number;
  completed_at: string;
}

interface SimuladoResultsProps {
  sessionStats: SessionStats;
  areaStats: AreaStats[];
  previousAttempts: PreviousAttempt[];
  examInfo: { exame?: string; ano?: string };
  totalTime: number;
  onClose: () => void;
}

const SimuladoResults = ({
  sessionStats,
  areaStats,
  previousAttempts,
  examInfo,
  totalTime,
  onClose
}: SimuladoResultsProps) => {
  const percentage = Math.round((sessionStats.correct / sessionStats.total) * 100);
  const passed = sessionStats.correct >= 40;
  const neededToPass = 40;
  
  // Find best and worst performing areas
  const bestArea = areaStats.length > 0 ? areaStats[0] : null;
  const worstArea = areaStats.length > 0 ? areaStats[areaStats.length - 1] : null;
  
  // Compare with previous attempts
  const previousAttempt = previousAttempts.length > 0 ? previousAttempts[0] : null;
  const improvement = previousAttempt 
    ? sessionStats.correct - previousAttempt.correct_answers 
    : 0;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getMotivationalMessage = () => {
    if (passed) {
      if (improvement > 0) {
        return `🎉 Incrível! Você melhorou ${improvement} questão${improvement > 1 ? 'ões' : ''} desde a última vez!`;
      }
      return "🎉 Parabéns! Você foi aprovado! Continue com essa dedicação!";
    } else {
      if (improvement > 0) {
        return `📈 Ótimo progresso! Você melhorou ${improvement} questão${improvement > 1 ? 'ões' : ''} desde a última vez. Continue assim!`;
      }
      return "📚 Continue estudando! Você está no caminho certo para a aprovação!";
    }
  };

  const getAreaEmoji = (percentage: number) => {
    if (percentage >= 80) return "🔥";
    if (percentage >= 60) return "✅";
    if (percentage >= 40) return "⚡";
    return "📚";
  };

  return (
    <div className="min-h-screen bg-netflix-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-netflix-border text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar aos Simulados
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="text-netflix-red" size={28} />
              Resultado do Simulado
            </h1>
            <p className="text-sm text-gray-400">
              {examInfo.exame} - {examInfo.ano}
            </p>
          </div>
        </div>

        {/* Main Result Card */}
        <Card className="bg-netflix-card border-netflix-border p-6 text-center">
          <div className="mb-4">
            {passed ? (
              <Trophy className="text-yellow-500 mx-auto mb-2" size={64} />
            ) : (
              <Target className="text-blue-500 mx-auto mb-2" size={64} />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {sessionStats.correct}/{sessionStats.total}
          </h2>
          
          <div className="text-6xl font-bold mb-4">
            {passed ? (
              <span className="text-green-500">{percentage}%</span>
            ) : (
              <span className="text-orange-500">{percentage}%</span>
            )}
          </div>
          
          <Badge 
            variant="outline" 
            className={`text-lg px-4 py-2 mb-4 ${
              passed 
                ? 'border-green-500 text-green-300 bg-green-900/20'
                : 'border-orange-500 text-orange-300 bg-orange-900/20'
            }`}
          >
            {passed ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                APROVADO
              </>
            ) : (
              <>
                <XCircle size={16} className="mr-2" />
                NÃO APROVADO
              </>
            )}
          </Badge>
          
          <p className="text-gray-300 text-lg mb-4">
            {getMotivationalMessage()}
          </p>
          
          {!passed && (
            <p className="text-gray-400">
              Você precisava de {neededToPass - sessionStats.correct} questão{neededToPass - sessionStats.correct > 1 ? 'ões' : ''} a mais para ser aprovado
            </p>
          )}
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <Clock className="text-blue-400 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{formatTime(totalTime)}</div>
            <div className="text-gray-400">Tempo Total</div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <Target className="text-green-400 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{sessionStats.correct}</div>
            <div className="text-gray-400">Questões Corretas</div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            {improvement >= 0 ? (
              <TrendingUp className="text-green-400 mx-auto mb-2" size={32} />
            ) : (
              <TrendingDown className="text-red-400 mx-auto mb-2" size={32} />
            )}
            <div className="text-2xl font-bold text-white">
              {improvement >= 0 ? '+' : ''}{improvement}
            </div>
            <div className="text-gray-400">vs. Última Tentativa</div>
          </Card>
        </div>

        {/* Performance by Area */}
        {areaStats.length > 0 && (
          <Card className="bg-netflix-card border-netflix-border p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="text-netflix-red" size={24} />
              Desempenho por Área
            </h3>
            
            {/* Best and Worst Areas Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {bestArea && (
                <Card className="bg-green-900/20 border-green-600 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-300 font-semibold">🔥 Melhor Área</div>
                      <div className="text-white">{bestArea.area}</div>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {bestArea.percentage}%
                    </div>
                  </div>
                </Card>
              )}
              
              {worstArea && worstArea !== bestArea && (
                <Card className="bg-orange-900/20 border-orange-600 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-orange-300 font-semibold">📚 Área para Melhorar</div>
                      <div className="text-white">{worstArea.area}</div>
                    </div>
                    <div className="text-2xl font-bold text-orange-400">
                      {worstArea.percentage}%
                    </div>
                  </div>
                </Card>
              )}
            </div>
            
            {/* Detailed Area Stats */}
            <div className="space-y-3">
              {areaStats.map((area, index) => (
                <div key={area.area} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getAreaEmoji(area.percentage)}</span>
                    <div>
                      <div className="text-white font-medium">{area.area}</div>
                      <div className="text-gray-400 text-sm">
                        {area.correct}/{area.total} questões
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      area.percentage >= 70 ? 'text-green-400' : 
                      area.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {area.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Previous Attempts */}
        {previousAttempts.length > 0 && (
          <Card className="bg-netflix-card border-netflix-border p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-netflix-red" size={24} />
              Histórico de Tentativas
            </h3>
            
            <div className="space-y-3">
              {previousAttempts.slice(0, 3).map((attempt, index) => {
                const attemptPercentage = Math.round((attempt.correct_answers / attempt.questions_answered) * 100);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <div className="text-white">
                        {new Date(attempt.completed_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {attempt.correct_answers}/{attempt.questions_answered} questões
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        attemptPercentage >= 70 ? 'text-green-400' : 
                        attemptPercentage >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {attemptPercentage}%
                      </div>
                      <div className="text-gray-400 text-sm">
                        {formatTime(attempt.total_time)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onClose}
            className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3"
          >
            Fazer Outro Simulado
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimuladoResults;
