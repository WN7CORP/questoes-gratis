
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Target, Clock, TrendingUp, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface SessionResultsProps {
  isVisible: boolean;
  onClose: () => void;
  sessionStats: {
    correct: number;
    total: number;
    startTime: number;
  };
  previousStats?: {
    correct: number;
    total: number;
    accuracy: number;
  } | null;
  onContinue?: () => void;
  onNewSession?: () => void;
}

const SessionResults = ({
  isVisible,
  onClose,
  sessionStats,
  previousStats,
  onContinue,
  onNewSession
}: SessionResultsProps) => {
  const currentAccuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
  const timeSpent = Math.floor((Date.now() - sessionStats.startTime) / 1000);
  const avgTimePerQuestion = sessionStats.total > 0 ? Math.round(timeSpent / sessionStats.total) : 0;

  const getPerformanceMessage = () => {
    if (currentAccuracy >= 80) return { message: "Excelente desempenho!", color: "text-green-400", icon: Trophy };
    if (currentAccuracy >= 60) return { message: "Bom desempenho!", color: "text-blue-400", icon: Target };
    return { message: "Continue praticando!", color: "text-orange-400", icon: TrendingUp };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const performance = getPerformanceMessage();
  const PerformanceIcon = performance.icon;

  const improvement = previousStats ? currentAccuracy - previousStats.accuracy : 0;

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="bg-netflix-card border-netflix-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white text-xl">
            <PerformanceIcon className={performance.color} size={24} />
            Resultados da Sessão
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Performance Message */}
          <div className="text-center">
            <p className={`text-lg font-semibold ${performance.color}`}>
              {performance.message}
            </p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-800/50 border-gray-700 p-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-gray-300 text-sm">Acertos</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {sessionStats.correct}/{sessionStats.total}
                </div>
                <div className={`text-lg font-semibold ${currentAccuracy >= 70 ? 'text-green-400' : currentAccuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {currentAccuracy}%
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="text-blue-500" size={20} />
                  <span className="text-gray-300 text-sm">Tempo</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatTime(timeSpent)}
                </div>
                <div className="text-sm text-gray-400">
                  {avgTimePerQuestion}s por questão
                </div>
              </div>
            </Card>
          </div>

          {/* Comparison with Previous Session */}
          {previousStats && (
            <Card className="bg-gray-800/30 border-gray-700 p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={18} />
                Comparação com Sessão Anterior
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-gray-300 text-xs mb-1">Acertos Anterior</div>
                  <div className="text-white font-semibold">{previousStats.correct}/{previousStats.total}</div>
                  <div className="text-gray-400 text-sm">{previousStats.accuracy}%</div>
                </div>
                <div>
                  <div className="text-gray-300 text-xs mb-1">Evolução</div>
                  <div className={`font-bold text-lg ${improvement > 0 ? 'text-green-400' : improvement < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {improvement > 0 ? '+' : ''}{improvement}%
                  </div>
                  {improvement > 0 && <div className="text-green-400 text-xs">Melhorou!</div>}
                  {improvement < 0 && <div className="text-red-400 text-xs">Pode melhorar</div>}
                  {improvement === 0 && <div className="text-gray-400 text-xs">Manteve</div>}
                </div>
                <div>
                  <div className="text-gray-300 text-xs mb-1">Acertos Atual</div>
                  <div className="text-white font-semibold">{sessionStats.correct}/{sessionStats.total}</div>
                  <div className="text-blue-400 text-sm">{currentAccuracy}%</div>
                </div>
              </div>
            </Card>
          )}

          {/* Performance Badges */}
          <div className="flex justify-center gap-2 flex-wrap">
            {currentAccuracy === 100 && (
              <Badge className="bg-yellow-900/20 border-yellow-500 text-yellow-300">
                🏆 Perfeito!
              </Badge>
            )}
            {currentAccuracy >= 80 && (
              <Badge className="bg-green-900/20 border-green-500 text-green-300">
                🎯 Excelente
              </Badge>
            )}
            {improvement > 10 && (
              <Badge className="bg-blue-900/20 border-blue-500 text-blue-300">
                📈 Grande Melhoria
              </Badge>
            )}
            {sessionStats.total >= 10 && (
              <Badge className="bg-purple-900/20 border-purple-500 text-purple-300">
                💪 Dedicado
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {onContinue && (
              <Button 
                onClick={onContinue}
                className="flex-1 bg-netflix-red hover:bg-red-700 text-white"
              >
                <ArrowRight size={16} className="mr-2" />
                Continuar Estudando
              </Button>
            )}
            {onNewSession && (
              <Button 
                onClick={onNewSession}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Nova Sessão
              </Button>
            )}
            <Button 
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionResults;
