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
  return;
};
export default EnhancedUserStats;