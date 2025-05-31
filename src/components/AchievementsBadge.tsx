
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Zap, Award } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  type: string;
  value: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

interface AchievementsBadgeProps {
  questionsAnswered: number;
  correctAnswers: number;
  streak: number;
  onNewAchievement?: (achievement: Achievement) => void;
}

const AchievementsBadge = ({ 
  questionsAnswered, 
  correctAnswers, 
  streak,
  onNewAchievement 
}: AchievementsBadgeProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const { toast } = useToast();

  const allAchievements: Achievement[] = [
    {
      id: 'first_question',
      type: 'questions_answered',
      value: 1,
      title: 'Primeiro Passo',
      description: 'Responda sua primeira questão',
      icon: <Star className="text-yellow-500" size={16} />,
      unlocked: false
    },
    {
      id: 'ten_questions',
      type: 'questions_answered',
      value: 10,
      title: 'Estudante Dedicado',
      description: 'Responda 10 questões',
      icon: <Target className="text-blue-500" size={16} />,
      unlocked: false
    },
    {
      id: 'fifty_questions',
      type: 'questions_answered',
      value: 50,
      title: 'Especialista',
      description: 'Responda 50 questões',
      icon: <Trophy className="text-orange-500" size={16} />,
      unlocked: false
    },
    {
      id: 'hundred_questions',
      type: 'questions_answered',
      value: 100,
      title: 'Mestre',
      description: 'Responda 100 questões',
      icon: <Award className="text-purple-500" size={16} />,
      unlocked: false
    },
    {
      id: 'streak_five',
      type: 'streak',
      value: 5,
      title: 'Em Chamas',
      description: 'Acerte 5 questões seguidas',
      icon: <Zap className="text-red-500" size={16} />,
      unlocked: false
    },
    {
      id: 'streak_ten',
      type: 'streak',
      value: 10,
      title: 'Imparável',
      description: 'Acerte 10 questões seguidas',
      icon: <Zap className="text-orange-500" size={16} />,
      unlocked: false
    },
    {
      id: 'accuracy_80',
      type: 'accuracy',
      value: 80,
      title: 'Precisão',
      description: '80% de acerto (mín. 10 questões)',
      icon: <Target className="text-green-500" size={16} />,
      unlocked: false
    }
  ];

  useEffect(() => {
    loadUserAchievements();
  }, []);

  useEffect(() => {
    checkForNewAchievements();
  }, [questionsAnswered, correctAnswers, streak]);

  const loadUserAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use fallback approach for achievements
      const userAchievements = allAchievements.map(achievement => ({
        ...achievement,
        unlocked: false // For now, will implement proper tracking later
      }));

      setAchievements(userAchievements);
      setUnlockedCount(userAchievements.filter(a => a.unlocked).length);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const checkForNewAchievements = async () => {
    const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;
    
    for (const achievement of allAchievements) {
      const shouldUnlock = 
        (achievement.type === 'questions_answered' && questionsAnswered >= achievement.value) ||
        (achievement.type === 'streak' && streak >= achievement.value) ||
        (achievement.type === 'accuracy' && accuracy >= achievement.value && questionsAnswered >= 10);

      const currentAchievement = achievements.find(a => a.id === achievement.id);
      
      if (shouldUnlock && (!currentAchievement || !currentAchievement.unlocked)) {
        await unlockAchievement(achievement);
      }
    }
  };

  const unlockAchievement = async (achievement: Achievement) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save achievement to database (using fallback approach for now)
      const updatedAchievements = achievements.map(a => 
        a.id === achievement.id ? { ...a, unlocked: true } : a
      );
      
      setAchievements(updatedAchievements);
      setUnlockedCount(prev => prev + 1);

      // Show achievement notification
      toast({
        title: "🏆 Nova Conquista!",
        description: `${achievement.title}: ${achievement.description}`,
        duration: 4000
      });

      if (onNewAchievement) {
        onNewAchievement({ ...achievement, unlocked: true });
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className="border-yellow-600 text-yellow-300 bg-yellow-900/20 flex items-center gap-1"
      >
        <Trophy size={14} />
        {unlockedCount}/{allAchievements.length}
      </Badge>
      
      {unlockedCount > 0 && (
        <div className="flex items-center gap-1">
          {achievements
            .filter(a => a.unlocked)
            .slice(-3)
            .map(achievement => (
              <div 
                key={achievement.id}
                className="p-1 bg-gray-800 rounded border border-gray-600"
                title={`${achievement.title}: ${achievement.description}`}
              >
                {achievement.icon}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsBadge;
