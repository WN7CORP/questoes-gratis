
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Award, Clock, BookOpen, Star } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number;
  streak: number;
  favoriteQuestions: number;
  studySessions: number;
  averageTime: number;
}

const EnhancedUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    timeSpent: 0,
    streak: 0,
    favoriteQuestions: 0,
    studySessions: 0,
    averageTime: 0
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

      // Fetch progress data
      const { data: progressData } = await supabase
        .from('progresso_questos1')
        .select('*')
        .eq('user_id', user.id);

      // Fetch favorites count
      const { data: favoritesData } = await supabase
        .from('question_favorites')
        .select('id')
        .eq('user_id', user.id);

      if (progressData) {
        const totalQuestions = progressData.length;
        const correctAnswers = progressData.filter(q => q.is_correct).length;
        const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        const totalTime = progressData.reduce((sum, q) => sum + (q.time_spent || 0), 0);
        const averageTime = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;
        
        // Get unique session count
        const uniqueSessions = new Set(progressData.map(q => q.session_id)).size;

        setStats({
          totalQuestions,
          correctAnswers,
          accuracy,
          timeSpent: totalTime,
          streak: 0, // Could be calculated based on recent correct answers
          favoriteQuestions: favoritesData?.length || 0,
          studySessions: uniqueSessions,
          averageTime
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user stats:', error);
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

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-500';
    if (accuracy >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAccuracyBadgeColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-900/20 border-green-600 text-green-400';
    if (accuracy >= 60) return 'bg-yellow-900/20 border-yellow-600 text-yellow-400';
    return 'bg-red-900/20 border-red-600 text-red-400';
  };

  if (loading) {
    return (
      <Card className="bg-netflix-card border-netflix-border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-netflix-card to-gray-900 border-netflix-border shadow-xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
            <TrendingUp className="text-white" size={20} />
          </div>
          <h3 className="text-white text-xl font-bold">Suas Estatísticas</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Questions */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="text-blue-400" size={16} />
              <span className="text-gray-400 text-sm">Questões</span>
            </div>
            <div className="text-white text-2xl font-bold">{stats.totalQuestions}</div>
          </div>

          {/* Accuracy */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-green-400" size={16} />
              <span className="text-gray-400 text-sm">Precisão</span>
            </div>
            <div className={`text-2xl font-bold ${getAccuracyColor(stats.accuracy)}`}>
              {stats.accuracy}%
            </div>
          </div>

          {/* Study Time */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-purple-400" size={16} />
              <span className="text-gray-400 text-sm">Tempo</span>
            </div>
            <div className="text-white text-2xl font-bold">{formatTime(stats.timeSpent)}</div>
          </div>

          {/* Favorites */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Star className="text-yellow-400" size={16} />
              <span className="text-gray-400 text-sm">Favoritos</span>
            </div>
            <div className="text-white text-2xl font-bold">{stats.favoriteQuestions}</div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm flex items-center gap-2">
            <Award className="text-yellow-500" size={16} />
            Conquistas
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getAccuracyBadgeColor(stats.accuracy)}>
              {stats.accuracy >= 80 ? '🎯 Expert' : stats.accuracy >= 60 ? '📈 Progredindo' : '🎯 Iniciante'}
            </Badge>
            {stats.totalQuestions >= 100 && (
              <Badge variant="outline" className="bg-blue-900/20 border-blue-600 text-blue-400">
                💯 Centurião
              </Badge>
            )}
            {stats.studySessions >= 10 && (
              <Badge variant="outline" className="bg-purple-900/20 border-purple-600 text-purple-400">
                📚 Dedicado
              </Badge>
            )}
            {stats.favoriteQuestions >= 20 && (
              <Badge variant="outline" className="bg-yellow-900/20 border-yellow-600 text-yellow-400">
                ⭐ Colecionador
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-lg border border-gray-700/50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Sessões de estudo:</span>
              <span className="text-white ml-2 font-semibold">{stats.studySessions}</span>
            </div>
            <div>
              <span className="text-gray-400">Tempo médio:</span>
              <span className="text-white ml-2 font-semibold">{formatTime(stats.averageTime)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedUserStats;
