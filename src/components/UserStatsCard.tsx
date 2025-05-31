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
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar sessões do usuário
      const {
        data: sessions,
        error
      } = await supabase.from('user_study_sessions').select('*').eq('user_id', user.id);
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
        const averageAccuracy = totalQuestions > 0 ? correctAnswers / totalQuestions * 100 : 0;
        const bestAccuracy = sessions.reduce((best, session) => {
          const accuracy = session.questions_answered > 0 ? session.correct_answers / session.questions_answered * 100 : 0;
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
    const minutes = Math.floor(seconds % 3600 / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  if (loading) {
    return <Card className="bg-netflix-card border-netflix-border p-6">
        <div className="text-netflix-text-secondary text-center py-8">
          Carregando estatísticas...
        </div>
      </Card>;
  }
  return;
};
export default UserStatsCard;