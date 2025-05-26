
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
      <Card className="bg-gray-900 border-gray-700 p-6">
        <div className="text-gray-400 text-center py-8">
          Carregando estatísticas...
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="text-red-500" size={20} />
        Estatísticas Gerais
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <Target className="mx-auto mb-2 text-blue-500" size={24} />
          <div className="text-2xl font-bold text-white">{stats.totalQuestions}</div>
          <div className="text-gray-400 text-sm">Questões</div>
        </div>
        
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <Award className="mx-auto mb-2 text-green-500" size={24} />
          <div className="text-2xl font-bold text-white">{stats.averageAccuracy}%</div>
          <div className="text-gray-400 text-sm">Acurácia Média</div>
        </div>
        
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <Clock className="mx-auto mb-2 text-orange-500" size={24} />
          <div className="text-2xl font-bold text-white">{formatTime(stats.totalTime)}</div>
          <div className="text-gray-400 text-sm">Tempo Total</div>
        </div>
        
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <TrendingUp className="mx-auto mb-2 text-purple-500" size={24} />
          <div className="text-2xl font-bold text-white">{stats.bestAccuracy}%</div>
          <div className="text-gray-400 text-sm">Melhor Resultado</div>
        </div>
      </div>

      {stats.totalSessions > 0 && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Resumo de Atividade</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Total de Sessões:</span>
              <span className="text-white ml-2 font-semibold">{stats.totalSessions}</span>
            </div>
            <div>
              <span className="text-gray-400">Acertos:</span>
              <span className="text-green-400 ml-2 font-semibold">{stats.correctAnswers}</span>
            </div>
            <div>
              <span className="text-gray-400">Erros:</span>
              <span className="text-red-400 ml-2 font-semibold">{stats.totalQuestions - stats.correctAnswers}</span>
            </div>
          </div>
        </div>
      )}

      {stats.totalSessions === 0 && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
          <p className="text-gray-400">
            Complete algumas sessões de estudo para ver suas estatísticas!
          </p>
        </div>
      )}
    </Card>
  );
};

export default UserStatsCard;
