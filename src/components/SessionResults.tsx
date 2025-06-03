import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown, Minus, Target, Clock, RotateCcw, Home, Calendar, BarChart3 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
interface SessionResultsProps {
  sessionStats: {
    correct: number;
    total: number;
    timeSpent: number;
    area?: string;
    tema?: string;
    assunto?: string;
  };
  onRestart: () => void;
  onHome: () => void;
}
interface PreviousSession {
  percentage: number;
  total_questions: number;
  correct_answers: number;
  session_date: string;
}
const SessionResults = ({
  sessionStats,
  onRestart,
  onHome
}: SessionResultsProps) => {
  const [previousSession, setPreviousSession] = useState<PreviousSession | null>(null);
  const [loading, setLoading] = useState(true);
  const currentPercentage = sessionStats.total > 0 ? Math.round(sessionStats.correct / sessionStats.total * 100) : 0;
  const averageTimePerQuestion = sessionStats.total > 0 ? Math.round(sessionStats.timeSpent / sessionStats.total) : 0;
  useEffect(() => {
    fetchPreviousSession();
  }, []);
  const fetchPreviousSession = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      let query = supabase.from('progresso_questos1').select('*').eq('user_id', user.id).order('answered_at', {
        ascending: false
      });

      // Apply filters to get similar sessions
      if (sessionStats.area) {
        query = query.eq('area', sessionStats.area);
      }
      if (sessionStats.tema) {
        query = query.eq('tema', sessionStats.tema);
      }
      if (sessionStats.assunto) {
        query = query.eq('assunto', sessionStats.assunto);
      }
      const {
        data
      } = await query.limit(50);
      if (data && data.length > 0) {
        // Group by session_id to get previous sessions
        const sessions = new Map();
        data.forEach(record => {
          if (record.session_id) {
            if (!sessions.has(record.session_id)) {
              sessions.set(record.session_id, {
                correct: 0,
                total: 0,
                date: record.answered_at
              });
            }
            const session = sessions.get(record.session_id);
            session.total++;
            if (record.is_correct) session.correct++;
          }
        });
        const sessionArray = Array.from(sessions.values()).filter(session => session.total > 0).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (sessionArray.length > 0) {
          const lastSession = sessionArray[0];
          setPreviousSession({
            percentage: Math.round(lastSession.correct / lastSession.total * 100),
            total_questions: lastSession.total,
            correct_answers: lastSession.correct,
            session_date: new Date(lastSession.date).toLocaleDateString('pt-BR')
          });
        }
      }
    } catch (error) {
      console.error('Error fetching previous session:', error);
    } finally {
      setLoading(false);
    }
  };
  const getPerformanceIcon = () => {
    if (!previousSession) return <Minus className="text-gray-400" size={20} />;
    const diff = currentPercentage - previousSession.percentage;
    if (diff > 0) return <TrendingUp className="text-green-500" size={20} />;
    if (diff < 0) return <TrendingDown className="text-red-500" size={20} />;
    return <Minus className="text-gray-400" size={20} />;
  };
  const getPerformanceText = () => {
    if (!previousSession) return "Primeira sessão nesta área";
    const diff = currentPercentage - previousSession.percentage;
    if (diff > 0) return `+${diff}% melhor que a sessão anterior`;
    if (diff < 0) return `${diff}% pior que a sessão anterior`;
    return "Mesmo desempenho da sessão anterior";
  };
  const getPerformanceColor = () => {
    if (currentPercentage >= 80) return "text-green-500";
    if (currentPercentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  const getPerformanceMessage = () => {
    if (currentPercentage >= 90) return "Excelente! Desempenho excepcional!";
    if (currentPercentage >= 70) return "Muito bom! Continue assim!";
    if (currentPercentage >= 50) return "Bom progresso! Continue estudando!";
    return "Continue se esforçando! A prática leva à perfeição!";
  };

  // Formatação de tempo mais amigável
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };
  return <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="bg-gray-800 border-gray-700 p-6 max-w-2xl w-full shadow-2xl py-0">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 rounded-full p-4 shadow-lg">
              <Trophy className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sessão Finalizada!</h2>
          <p className="text-gray-400">Aqui está o resumo do seu desempenho</p>
          <p className="text-sm text-gray-500 mt-1">{getPerformanceMessage()}</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gray-700 border-gray-600 p-4 text-center">
            <div className={`text-3xl font-bold mb-1 ${getPerformanceColor()}`}>
              {currentPercentage}%
            </div>
            <div className="text-gray-400 text-sm">Aproveitamento</div>
          </Card>
          
          <Card className="bg-gray-700 border-gray-600 p-4 text-center">
            <div className="text-white text-3xl font-bold mb-1">
              {sessionStats.correct}/{sessionStats.total}
            </div>
            <div className="text-gray-400 text-sm">Acertos</div>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={18} />
              <span className="text-white text-sm">Tempo total da sessão</span>
            </div>
            <span className="text-gray-300 font-mono">{formatTime(sessionStats.timeSpent)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-purple-400" size={18} />
              <span className="text-white text-sm">Tempo médio por questão</span>
            </div>
            <span className="text-gray-300 font-mono">{averageTimePerQuestion}s</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex items-center gap-3">
              <Target className="text-green-400" size={18} />
              <span className="text-white text-sm">Questões respondidas</span>
            </div>
            <span className="text-gray-300">{sessionStats.total} questões</span>
          </div>

          

          {/* Performance Comparison */}
          {!loading && <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="flex items-center gap-3">
                {getPerformanceIcon()}
                <span className="text-white text-sm">Comparação</span>
              </div>
              <span className="text-gray-300 text-xs">{getPerformanceText()}</span>
            </div>}

          {previousSession && <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
              <div className="text-gray-400 text-xs mb-2">Sessão anterior ({previousSession.session_date}):</div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-300">{previousSession.percentage}% aproveitamento</span>
                <span className="text-gray-300">{previousSession.correct_answers}/{previousSession.total_questions} acertos</span>
              </div>
            </div>}
        </div>

        {/* Filter Info */}
        {(sessionStats.area || sessionStats.tema || sessionStats.assunto) && <div className="mb-6">
            <div className="text-gray-400 text-sm mb-2">Filtros aplicados:</div>
            <div className="flex gap-2 flex-wrap">
              {sessionStats.area && <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-700/50">
                  {sessionStats.area}
                </Badge>}
              {sessionStats.tema && <Badge variant="outline" className="border-blue-600 text-blue-400 bg-blue-900/30">
                  {sessionStats.tema}
                </Badge>}
              {sessionStats.assunto && <Badge variant="outline" className="border-green-600 text-green-400 bg-green-900/30">
                  {sessionStats.assunto}
                </Badge>}
            </div>
          </div>}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={onRestart} className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Nova Sessão
          </Button>
          <Button onClick={onHome} variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
            <Home className="mr-2 h-4 w-4" />
            Início
          </Button>
        </div>
      </Card>
    </div>;
};
export default SessionResults;