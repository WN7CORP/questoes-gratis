
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Clock, Award } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  totalSessions: number;
  averageAccuracy: number;
  bestAccuracy: number;
}

const UserStatsCard = () => {
  const [stats, setStats] = useState<UserStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    totalTime: 0,
    totalSessions: 0,
    averageAccuracy: 0,
    bestAccuracy: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar sessões do usuário
      const { data: sessions, error } = await supabase
        .from('user_study_sessions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user stats:', error);
        setLoading(false);
        return;
      }

      if (sessions && sessions.length > 0) {
        const totalQuestions = sessions.reduce((sum, session) => sum + session.questions_answered, 0);
        const correctAnswers = sessions.reduce((sum, session) => sum + session.correct_answers, 0);
        const totalTime = sessions.reduce((sum, session) => sum + session.total_time, 0);
        const totalSessions = sessions.length;
        
        const averageAccuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        const bestAccuracy = sessions.reduce((best, session) => {
          const accuracy = session.questions_answered > 0 
            ? (session.correct_answers / session.questions_answered) * 100 
            : 0;
          return Math.max(best, accuracy);
        }, 0);

        setStats({
          totalQuestions,
          correctAnswers,
          totalTime,
          totalSessions,
          averageAccuracy: Math.round(averageAccuracy),
          bestAccuracy: Math.round(bestAccuracy)
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <Card className="bg-netflix-card border-netflix-border p-6">
        <div className="text-netflix-text-secondary text-center py-8">
          Carregando estatísticas...
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-netflix-card border-netflix-border p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
        <div className="bg-netflix-red rounded-lg p-2">
          <TrendingUp className="text-white" size={24} />
        </div>
        Estatísticas Gerais
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-netflix-black/50 rounded-lg border border-netflix-border/30">
          <div className="bg-blue-600/20 rounded-lg p-3 mb-3 mx-auto w-fit">
            <Target className="mx-auto text-blue-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalQuestions}</div>
          <div className="text-netflix-text-secondary text-sm">Questões</div>
        </div>
        
        <div className="text-center p-4 bg-netflix-black/50 rounded-lg border border-netflix-border/30">
          <div className="bg-green-600/20 rounded-lg p-3 mb-3 mx-auto w-fit">
            <Award className="mx-auto text-green-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.averageAccuracy}%</div>
          <div className="text-netflix-text-secondary text-sm">Acurácia Média</div>
        </div>
        
        <div className="text-center p-4 bg-netflix-black/50 rounded-lg border border-netflix-border/30">
          <div className="bg-orange-600/20 rounded-lg p-3 mb-3 mx-auto w-fit">
            <Clock className="mx-auto text-orange-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatTime(stats.totalTime)}</div>
          <div className="text-netflix-text-secondary text-sm">Tempo Total</div>
        </div>
        
        <div className="text-center p-4 bg-netflix-black/50 rounded-lg border border-netflix-border/30">
          <div className="bg-purple-600/20 rounded-lg p-3 mb-3 mx-auto w-fit">
            <TrendingUp className="mx-auto text-purple-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.bestAccuracy}%</div>
          <div className="text-netflix-text-secondary text-sm">Melhor Resultado</div>
        </div>
      </div>

      {stats.totalSessions > 0 && (
        <div className="mt-6 p-4 bg-netflix-black/30 rounded-lg border border-netflix-border/30">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-netflix-red rounded-full"></div>
            Resumo de Atividade
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between items-center p-2 bg-netflix-black/50 rounded">
              <span className="text-netflix-text-secondary">Total de Sessões:</span>
              <span className="text-white font-semibold">{stats.totalSessions}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-netflix-black/50 rounded">
              <span className="text-netflix-text-secondary">Acertos:</span>
              <span className="text-green-400 font-semibold">{stats.correctAnswers}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-netflix-black/50 rounded">
              <span className="text-netflix-text-secondary">Erros:</span>
              <span className="text-red-400 font-semibold">{stats.totalQuestions - stats.correctAnswers}</span>
            </div>
          </div>
        </div>
      )}

      {stats.totalSessions === 0 && (
        <div className="mt-6 p-4 bg-netflix-black/30 rounded-lg border border-netflix-border/30 text-center">
          <div className="bg-netflix-red/20 rounded-lg p-3 mb-3 mx-auto w-fit">
            <Award className="mx-auto text-netflix-red" size={32} />
          </div>
          <p className="text-netflix-text-secondary">
            Complete algumas sessões de estudo para ver suas estatísticas!
          </p>
        </div>
      )}
    </Card>
  );
};

export default UserStatsCard;
