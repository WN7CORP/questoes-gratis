
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Trophy, Target, Clock, TrendingUp, BookOpen, Settings, LogOut } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  display_name?: string;
}

interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  studyTime: number;
  streak: number;
  favoriteArea: string;
  weeklyGoal: number;
  weeklyProgress: number;
  areaStats: Array<{
    area: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
}

const ProfileSection = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    studyTime: 0,
    streak: 0,
    favoriteArea: '',
    weeklyGoal: 50,
    weeklyProgress: 0,
    areaStats: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchUserStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          created_at: authUser.created_at,
          display_name: authUser.user_metadata?.display_name || authUser.email?.split('@')[0]
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar estatísticas reais das sessões de estudo
      const { data: sessionsData } = await supabase
        .from('user_study_sessions')
        .select('*')
        .eq('user_id', user.id);

      // Buscar respostas das questões
      const { data: questionsData } = await supabase
        .from('user_questoes')
        .select('*')
        .eq('user_id', user.id);

      if (sessionsData || questionsData) {
        const totalFromSessions = sessionsData?.reduce((sum, session) => sum + session.questions_answered, 0) || 0;
        const correctFromSessions = sessionsData?.reduce((sum, session) => sum + session.correct_answers, 0) || 0;
        const totalTimeFromSessions = sessionsData?.reduce((sum, session) => sum + session.total_time, 0) || 0;

        const totalFromQuestions = questionsData?.length || 0;
        const correctFromQuestions = questionsData?.filter(q => q.acertou).length || 0;

        const totalQuestions = Math.max(totalFromSessions, totalFromQuestions);
        const correctAnswers = Math.max(correctFromSessions, correctFromQuestions);

        // Calcular estatísticas por área
        const areaStats: Record<string, { correct: number; total: number }> = {};
        
        if (questionsData) {
          for (const question of questionsData) {
            // Buscar a área da questão
            const { data: questionDetails } = await supabase
              .from('Questoes_Comentadas')
              .select('area')
              .eq('id', question.questao_id)
              .single();

            if (questionDetails?.area) {
              if (!areaStats[questionDetails.area]) {
                areaStats[questionDetails.area] = { correct: 0, total: 0 };
              }
              areaStats[questionDetails.area].total++;
              if (question.acertou) {
                areaStats[questionDetails.area].correct++;
              }
            }
          }
        }

        const areaStatsArray = Object.entries(areaStats).map(([area, data]) => ({
          area,
          correct: data.correct,
          total: data.total,
          percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
        })).sort((a, b) => b.percentage - a.percentage);

        const favoriteArea = areaStatsArray.length > 0 ? areaStatsArray[0].area : '';

        // Calcular progresso semanal (questões respondidas na última semana)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentSessions = sessionsData?.filter(session => 
          new Date(session.created_at) >= oneWeekAgo
        ) || [];

        const weeklyProgress = recentSessions.reduce((sum, session) => sum + session.questions_answered, 0);

        setStats({
          totalQuestions,
          correctAnswers,
          studyTime: Math.floor(totalTimeFromSessions / 60), // Convert to minutes
          streak: 0, // This would need to be calculated based on consecutive correct answers
          favoriteArea,
          weeklyGoal: 50,
          weeklyProgress,
          areaStats: areaStatsArray.slice(0, 5) // Top 5 areas
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getAccuracyPercentage = () => {
    if (stats.totalQuestions === 0) return 0;
    return Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-netflix-black">
        <div className="text-gray-400">Carregando perfil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-netflix-black p-6">
        <Card className="bg-netflix-card border-netflix-border p-8 text-center max-w-md">
          <User className="mx-auto mb-4 text-gray-500" size={48} />
          <h3 className="text-white text-xl font-semibold mb-4">Faça login</h3>
          <p className="text-gray-400 mb-6">
            Entre na sua conta para acessar seu perfil e estatísticas
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-netflix-red hover:bg-red-700 text-white"
          >
            Fazer Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-3 sm:p-6 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Meu Perfil</h1>
        <p className="text-gray-400 text-sm sm:text-base">Acompanhe seu progresso e gerencie sua conta</p>
      </div>

      <div className="px-3 sm:px-6 space-y-4 sm:space-y-6">
        {/* Profile Card */}
        <Card className="bg-netflix-card border-netflix-border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <div className="bg-netflix-red p-3 sm:p-4 rounded-full">
              <User className="text-white" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{user.display_name}</h2>
              <p className="text-gray-400 text-sm sm:text-base truncate">{user.email}</p>
              <p className="text-gray-500 text-xs sm:text-sm">Membro desde {formatDate(user.created_at)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white self-start sm:self-center"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-netflix-card border-netflix-border p-3 sm:p-4 text-center">
            <BookOpen className="mx-auto mb-2 text-blue-500" size={20} />
            <div className="text-lg sm:text-2xl font-bold text-white">{stats.totalQuestions}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Questões</div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-3 sm:p-4 text-center">
            <Target className="mx-auto mb-2 text-green-500" size={20} />
            <div className="text-lg sm:text-2xl font-bold text-white">{getAccuracyPercentage()}%</div>
            <div className="text-gray-400 text-xs sm:text-sm">Acurácia</div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-3 sm:p-4 text-center">
            <Clock className="mx-auto mb-2 text-orange-500" size={20} />
            <div className="text-lg sm:text-2xl font-bold text-white">{stats.studyTime}min</div>
            <div className="text-gray-400 text-xs sm:text-sm">Estudo</div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-3 sm:p-4 text-center">
            <TrendingUp className="mx-auto mb-2 text-purple-500" size={20} />
            <div className="text-lg sm:text-2xl font-bold text-white">{stats.streak}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Sequência</div>
          </Card>
        </div>

        {/* Progress Details */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-netflix-card border border-netflix-border">
            <TabsTrigger 
              value="progress" 
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white text-sm"
            >
              Progresso
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white text-sm"
            >
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-4 sm:mt-6 space-y-4">
            {/* Weekly Goal */}
            <Card className="bg-netflix-card border-netflix-border p-4 sm:p-6">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-4">Meta Semanal</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progresso desta semana</span>
                  <span className="text-white">{stats.weeklyProgress} / {stats.weeklyGoal} questões</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div 
                    className="bg-netflix-red h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-center text-sm text-gray-400">
                  {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}% concluído
                </div>
              </div>
            </Card>

            {/* Performance by Area */}
            <Card className="bg-netflix-card border-netflix-border p-4 sm:p-6">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-4">Desempenho por Área</h3>
              <div className="space-y-3">
                {stats.areaStats.length > 0 ? (
                  stats.areaStats.map((areaStat, index) => (
                    <div key={areaStat.area} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                      <span className="text-gray-300 text-sm truncate flex-1 mr-2">{areaStat.area}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{areaStat.correct}/{areaStat.total}</span>
                        <Badge 
                          className={`text-white text-xs ${
                            areaStat.percentage >= 80 ? 'bg-green-600' :
                            areaStat.percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                        >
                          {areaStat.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    <BookOpen className="mx-auto mb-2 text-gray-500" size={32} />
                    <p>Responda algumas questões para ver seu desempenho por área!</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 sm:mt-6 space-y-4">
            <Card className="bg-netflix-card border-netflix-border p-4">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
                <Settings className="mr-3" size={20} />
                Preferências de Estudo
              </Button>
            </Card>
            
            <Card className="bg-netflix-card border-netflix-border p-4">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
                <Target className="mr-3" size={20} />
                Definir Metas
              </Button>
            </Card>

            <Card className="bg-red-900/20 border-red-800 p-4">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2" size={16} />
                Sair da Conta
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSection;
