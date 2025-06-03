
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock, Heart } from 'lucide-react';

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
      setStats(prev => ({
        ...prev,
        favoriteQuestions: favorites.length
      }));
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
    <Card className="bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 p-4 sm:p-6 shadow-lg">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        {/* Total Questions */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-blue-600 rounded-full p-2">
              <Target className="text-white" size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalQuestions}</div>
          <div className="text-xs sm:text-sm text-gray-400">Questões</div>
        </div>

        {/* Accuracy */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-green-600 rounded-full p-2">
              <TrendingUp className="text-white" size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{stats.accuracy.toFixed(0)}%</div>
          <div className="text-xs sm:text-sm text-gray-400">Precisão</div>
        </div>

        {/* Time Spent */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-orange-600 rounded-full p-2">
              <Clock className="text-white" size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{formatTime(stats.timeSpent)}</div>
          <div className="text-xs sm:text-sm text-gray-400">Tempo</div>
        </div>

        {/* Favorites */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-red-600 rounded-full p-2">
              <Heart className="text-white" size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{stats.favoriteQuestions}</div>
          <div className="text-xs sm:text-sm text-gray-400">Favoritos</div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedUserStats;
