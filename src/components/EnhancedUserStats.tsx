
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
    const minutes = Math.floor(seconds % 3600 / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="bg-gray-800 border-gray-700 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Estatísticas</h3>
        <TrendingUp className="text-blue-400" size={20} />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-blue-400 text-xl font-bold">{stats.totalQuestions}</div>
          <div className="text-gray-400 text-xs">Questões</div>
        </div>
        
        <div className="text-center">
          <div className="text-green-400 text-xl font-bold">{stats.accuracy}%</div>
          <div className="text-gray-400 text-xs">Precisão</div>
        </div>
        
        <div className="text-center">
          <div className="text-yellow-400 text-xl font-bold">{stats.streak}</div>
          <div className="text-gray-400 text-xs">Sequência</div>
        </div>
        
        <div className="text-center">
          <div className="text-red-400 text-xl font-bold">{stats.favoriteQuestions}</div>
          <div className="text-gray-400 text-xs">Favoritas</div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedUserStats;
