
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Clock, CheckCircle, Award } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  streak: number;
  totalStudyTime: number;
}

const UserStatsCard = () => {
  const [stats, setStats] = useState<UserStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    averageTime: 0,
    streak: 0,
    totalStudyTime: 0
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

      // Mock data for demonstration
      setStats({
        totalQuestions: 156,
        correctAnswers: 124,
        accuracy: 79,
        averageTime: 45,
        streak: 7,
        totalStudyTime: 1280
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700 p-6">
        <div className="text-gray-400">Carregando estatísticas...</div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="text-red-500" size={20} />
        Suas Estatísticas
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalQuestions}</div>
          <div className="text-gray-400 text-sm">Questões Respondidas</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.accuracy}%</div>
          <div className="text-gray-400 text-sm">Taxa de Acerto</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.averageTime}s</div>
          <div className="text-gray-400 text-sm">Tempo Médio</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.streak}</div>
          <div className="text-gray-400 text-sm">Sequência</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{formatTime(stats.totalStudyTime)}</div>
          <div className="text-gray-400 text-sm">Tempo Total</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{stats.correctAnswers}</div>
          <div className="text-gray-400 text-sm">Acertos</div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="border-green-600 text-green-300 bg-green-900/20">
          <CheckCircle size={12} className="mr-1" />
          Ativo hoje
        </Badge>
        <Badge variant="outline" className="border-yellow-600 text-yellow-300 bg-yellow-900/20">
          <Award size={12} className="mr-1" />
          {stats.streak} dias seguidos
        </Badge>
      </div>
    </Card>
  );
};

export default UserStatsCard;
