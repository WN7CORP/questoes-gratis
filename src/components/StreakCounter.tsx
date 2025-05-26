
import { Flame, Star } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
  showAnimation?: boolean;
}

const StreakCounter = ({ streak, showAnimation = false }: StreakCounterProps) => {
  if (streak < 3) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold ${showAnimation ? 'animate-pulse' : ''}`}>
      <Flame size={16} className={showAnimation ? 'animate-bounce' : ''} />
      <span className="text-sm">{streak} em sequência!</span>
      {streak >= 10 && <Star size={16} className="text-yellow-300" />}
    </div>
  );
};

export default StreakCounter;
