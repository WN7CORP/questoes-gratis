
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
}

const ProfileSection = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    studyTime: 0,
    streak: 0,
    favoriteArea: 'Direito Constitucional',
    weeklyGoal: 50,
    weeklyProgress: 32
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

      // Fetch real stats from user_questoes table
      const { data: questionsData } = await supabase
        .from('user_questoes')
        .select('*')
        .eq('user_id', user.id);

      if (questionsData) {
        const totalQuestions = questionsData.length;
        const correctAnswers = questionsData.filter(q => q.acertou).length;
        
        setStats(prev => ({
          ...prev,
          totalQuestions,
          correctAnswers,
          studyTime: totalQuestions * 2, // Approximate 2 minutes per question
        }));
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
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-2">Meu Perfil</h1>
        <p className="text-gray-400">Acompanhe seu progresso e gerencie sua conta</p>
      </div>

      <div className="px-6 space-y-6">
        {/* Profile Card */}
        <Card className="bg-netflix-card border-netflix-border p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-netflix-red p-4 rounded-full">
              <User className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{user.display_name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-500 text-sm">Membro desde {formatDate(user.created_at)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <BookOpen className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-2xl font-bold text-white">{stats.totalQuestions}</div>
            <div className="text-gray-400 text-sm">Questões</div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <Target className="mx-auto mb-2 text-green-500" size={24} />
            <div className="text-2xl font-bold text-white">{getAccuracyPercentage()}%</div>
            <div className="text-gray-400 text-sm">Acurácia</div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <Clock className="mx-auto mb-2 text-orange-500" size={24} />
            <div className="text-2xl font-bold text-white">{Math.floor(stats.studyTime / 60)}h</div>
            <div className="text-gray-400 text-sm">Estudo</div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <TrendingUp className="mx-auto mb-2 text-purple-500" size={24} />
            <div className="text-2xl font-bold text-white">{stats.streak}</div>
            <div className="text-gray-400 text-sm">Sequência</div>
          </Card>
        </div>

        {/* Progress Details */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-netflix-card border border-netflix-border">
            <TabsTrigger 
              value="progress" 
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
            >
              Progresso
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
            >
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-6 space-y-4">
            {/* Weekly Goal */}
            <Card className="bg-netflix-card border-netflix-border p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Meta Semanal</h3>
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
            <Card className="bg-netflix-card border-netflix-border p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Desempenho por Área</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                  <span className="text-gray-300">Direito Constitucional</span>
                  <Badge className="bg-green-600 text-white">85%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                  <span className="text-gray-300">Direito Civil</span>
                  <Badge className="bg-yellow-600 text-white">72%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                  <span className="text-gray-300">Direito Penal</span>
                  <Badge className="bg-red-600 text-white">68%</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6 space-y-4">
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
