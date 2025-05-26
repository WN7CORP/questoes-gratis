
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Target, Clock, Calendar, Trophy, Star } from 'lucide-react';

interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalTime: number;
  averageTime: number;
  streak: number;
  favoriteArea: string;
  recentSessions: number;
}

const UserStatsCard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [areaStats, setAreaStats] = useState<any[]>([]);

  useEffect(() => {
    fetchUserStats();
    fetchAreaStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get overall performance stats
      const { data: attempts } = await supabase
        .from('user_question_attempts')
        .select('*')
        .eq('user_id', user.id);

      // Get recent sessions
      const { data: sessions } = await supabase
        .from('user_study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (attempts) {
        const totalQuestions = attempts.length;
        const correctAnswers = attempts.filter(a => a.is_correct).length;
        const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        const totalTime = attempts.reduce((sum, a) => sum + (a.time_spent || 0), 0);
        const averageTime = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;

        setStats({
          totalQuestions,
          correctAnswers,
          accuracy,
          totalTime,
          averageTime,
          streak: 0, // TODO: Calculate streak
          favoriteArea: '', // TODO: Calculate from area stats
          recentSessions: sessions?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAreaStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_performance_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('accuracy_percentage', { ascending: false });

      setAreaStats(data || []);
    } catch (error) {
      console.error('Error fetching area stats:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700 p-6">
        <div className="text-gray-400">Carregando estatísticas...</div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-gray-900 border-gray-700 p-6 text-center">
        <Trophy className="mx-auto mb-4 text-gray-500" size={48} />
        <h3 className="text-white text-lg font-semibold mb-2">Comece a estudar</h3>
        <p className="text-gray-400">
          Responda algumas questões para ver suas estatísticas
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Stats */}
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-red-500" size={20} />
          Estatísticas Gerais
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.totalQuestions}</div>
            <div className="text-gray-400 text-sm">Questões</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${stats.accuracy >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
              {stats.accuracy}%
            </div>
            <div className="text-gray-400 text-sm">Acertos</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.averageTime}s</div>
            <div className="text-gray-400 text-sm">Tempo Médio</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.recentSessions}</div>
            <div className="text-gray-400 text-sm">Sessões (7d)</div>
          </div>
        </div>
      </Card>

      {/* Area Performance */}
      {areaStats.length > 0 && (
        <Card className="bg-gray-900 border-gray-700 p-6">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="text-red-500" size={20} />
            Desempenho por Área
          </h3>
          
          <div className="space-y-3">
            {areaStats.slice(0, 5).map((area, index) => (
              <div key={area.area} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-600' : 
                    index === 1 ? 'bg-gray-500' : 
                    index === 2 ? 'bg-orange-600' : 'bg-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{area.area}</div>
                    <div className="text-gray-400 text-sm">
                      {area.total_questions} questões
                    </div>
                  </div>
                </div>
                
                <Badge 
                  className={`${
                    area.accuracy_percentage >= 80 ? 'bg-green-900/20 text-green-400' :
                    area.accuracy_percentage >= 60 ? 'bg-yellow-900/20 text-yellow-400' :
                    'bg-red-900/20 text-red-400'
                  }`}
                >
                  {Math.round(area.accuracy_percentage)}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Study Progress */}
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="text-red-500" size={20} />
          Progresso de Estudo
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Tempo total de estudo</span>
            <span className="text-white font-semibold">{formatTime(stats.totalTime)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Questões corretas</span>
            <span className="text-green-400 font-semibold">{stats.correctAnswers}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Meta de acertos</span>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
                ></div>
              </div>
              <span className="text-white text-sm">70%</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserStatsCard;
