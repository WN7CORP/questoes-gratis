
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Target } from 'lucide-react';
import AchievementsBadge from './AchievementsBadge';

interface ProgressBarProps {
  current: number;
  total: number;
  correct?: number;
  timeSpent?: number;
  showStats?: boolean;
  streak?: number;
}

const ProgressBar = ({ 
  current, 
  total, 
  correct = 0, 
  timeSpent = 0, 
  showStats = true,
  streak = 0
}: ProgressBarProps) => {
  const progressPercentage = (current / total) * 100;
  const accuracy = current > 0 ? Math.round((correct / current) * 100) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-netflix-card border border-netflix-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Target size={18} className="text-netflix-red" />
          Progresso da Sessão
        </h3>
        <div className="flex items-center gap-3">
          <AchievementsBadge 
            questionsAnswered={current}
            correctAnswers={correct}
            streak={streak}
          />
          <div className="text-netflix-text-secondary text-sm">
            {current} de {total} questões
          </div>
        </div>
      </div>

      <div className="mb-3">
        <Progress 
          value={progressPercentage} 
          className="h-3 bg-gray-700" 
        />
        <div className="flex justify-between text-xs text-netflix-text-secondary mt-1">
          <span>0%</span>
          <span className="font-medium text-netflix-red">{Math.round(progressPercentage)}%</span>
          <span>100%</span>
        </div>
      </div>

      {showStats && current > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-netflix-border">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <div>
              <div className="text-white font-medium">{accuracy}%</div>
              <div className="text-xs text-netflix-text-secondary">Acertos</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            <div>
              <div className="text-white font-medium">{formatTime(timeSpent)}</div>
              <div className="text-xs text-netflix-text-secondary">Tempo</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
