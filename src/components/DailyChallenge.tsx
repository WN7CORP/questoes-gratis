
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Target, Flame, CheckCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DailyChallengeProps {
  onStartChallenge: () => void;
}

const DailyChallenge = ({ onStartChallenge }: DailyChallengeProps) => {
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkTodayProgress();
  }, []);

  const checkTodayProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Check if today's challenge is completed
      const { data: todayData } = await supabase
        .from('user_study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`)
        .eq('mode', 'daily_challenge')
        .gte('questions_answered', 20)
        .single();

      setTodayCompleted(!!todayData);

      // Calculate streak (mock for now)
      setStreak(5); // This would be calculated from database
    } catch (error) {
      console.error('Error checking daily progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = () => {
    if (todayCompleted) {
      toast({
        title: "Desafio já concluído!",
        description: "Você já completou o desafio de hoje. Volte amanhã para um novo desafio!",
        variant: "default"
      });
      return;
    }
    onStartChallenge();
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-800 rounded-lg"></div>;
  }

  return (
    <Card className="bg-gradient-to-r from-orange-900/30 to-orange-800/20 border-orange-700/50 p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
              <Flame className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Desafio Diário
                {todayCompleted && <CheckCircle className="text-green-400" size={20} />}
              </h3>
              <p className="text-orange-200">20 questões para manter o ritmo</p>
            </div>
          </div>
          
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-600/20 px-3 py-1 rounded-full">
              <Trophy className="text-orange-300" size={16} />
              <span className="text-orange-200 font-bold">{streak} dias</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-orange-200">
              <Target size={16} />
              <span className="text-sm">20 questões mistas</span>
            </div>
            <div className="flex items-center gap-2 text-orange-200">
              <Calendar size={16} />
              <span className="text-sm">Diário</span>
            </div>
          </div>
          
          <Button
            onClick={handleStartChallenge}
            disabled={todayCompleted}
            className={`${
              todayCompleted 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            } transition-all duration-200`}
          >
            {todayCompleted ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                Concluído
              </>
            ) : (
              'Começar Desafio'
            )}
          </Button>
        </div>

        {todayCompleted && (
          <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-600/30">
            <p className="text-green-300 text-sm">
              🎉 Parabéns! Você completou o desafio de hoje. Continue assim!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DailyChallenge;
