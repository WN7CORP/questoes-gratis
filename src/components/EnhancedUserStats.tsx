
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  streak: number;
  timeSpent: number;
  favoriteQuestions: number;
}

const EnhancedUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    streak: 0,
    timeSpent: 0,
    favoriteQuestions: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load stats from localStorage temporarily
      const savedStats = localStorage.getItem('userStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
      
      // Count favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('questionFavorites') || '[]');
      setStats(prev => ({ ...prev, favoriteQuestions: favorites.length }));
    } catch (error) {
      console.error('Error loading stats:', error);
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

  return (
    <Card className="bg-netflix-card border-netflix-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-blue-500" size={20} />
        <h3 className="text-white font-semibold">Suas Estatísticas</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 rounded-lg p-2">
            <Target className="text-blue-400" size={16} />
          </div>
          <div>
            <div className="text-white font-medium">{stats.totalQuestions}</div>
            <div className="text-gray-400 text-xs">Questões</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-green-500/20 rounded-lg p-2">
            <Award className="text-green-400" size={16} />
          </div>
          <div>
            <div className="text-white font-medium">{stats.accuracy}%</div>
            <div className="text-gray-400 text-xs">Acertos</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-yellow-500/20 rounded-lg p-2">
            <Clock className="text-yellow-400" size={16} />
          </div>
          <div>
            <div className="text-white font-medium">{formatTime(stats.timeSpent)}</div>
            <div className="text-gray-400 text-xs">Tempo</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 rounded-lg p-2">
            <Award className="text-red-400" size={16} />
          </div>
          <div>
            <div className="text-white font-medium">{stats.favoriteQuestions}</div>
            <div className="text-gray-400 text-xs">Favoritas</div>
          </div>
        </div>
      </div>

      {stats.streak > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <Badge variant="outline" className="border-orange-500 text-orange-400">
            🔥 {stats.streak} dias seguidos
          </Badge>
        </div>
      )}
    </Card>
  );
};

export default EnhancedUserStats;
