
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Bell, Download, Star, BookOpen, Trophy, Clock, Heart, Target } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import FavoriteQuestions from './FavoriteQuestions';
import UserStatsCard from './UserStatsCard';
import { UserAchievement } from "@/types/database";

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

const ProfileSection = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchAchievements();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          created_at: authUser.created_at
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Usar RPC para buscar achievements
      const { data, error } = await supabase.rpc('get_user_achievements', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching achievements:', error);
      } else {
        setAchievements(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long'
    });
  };

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-gray-400">Carregando perfil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <Card className="bg-gray-900 border-gray-700 p-8 text-center max-w-md">
          <User className="mx-auto mb-4 text-gray-500" size={48} />
          <h3 className="text-white text-xl font-semibold mb-2">Faça login</h3>
          <p className="text-gray-400">
            Entre na sua conta para acessar seu perfil e estatísticas
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-black">
      {/* Header */}
      <div className="p-4 sm:p-6 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Meu Perfil
        </h1>
        <p className="text-gray-400">
          Gerencie suas informações e acompanhe seu progresso
        </p>
      </div>

      <div className="px-4 sm:px-6 space-y-6">
        {/* Profile Info */}
        <Card className="bg-gray-900 border-gray-700 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-600 p-4 rounded-full">
              <User className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{user.email}</h2>
              <p className="text-gray-400">Membro desde {formatDate(user.created_at)}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-yellow-600 text-white">
                  <Star size={12} className="mr-1" />
                  Estudante Dedicado
                </Badge>
                {totalPoints > 0 && (
                  <Badge className="bg-purple-600 text-white">
                    <Trophy size={12} className="mr-1" />
                    {totalPoints} pontos
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-700">
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Target size={16} className="mr-1" />
              <span className="hidden sm:inline">Estatísticas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="favorites"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Heart size={16} className="mr-1" />
              <span className="hidden sm:inline">Favoritos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Trophy size={16} className="mr-1" />
              <span className="hidden sm:inline">Conquistas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Settings size={16} className="mr-1" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-6">
            <UserStatsCard />
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <FavoriteQuestions />
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <Card className="bg-gray-900 border-gray-700 p-6">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Conquistas ({achievements.length})
              </h3>
              
              {achievements.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="mx-auto mb-4 text-gray-500" size={48} />
                  <h4 className="text-white text-lg font-semibold mb-2">Nenhuma conquista ainda</h4>
                  <p className="text-gray-400">
                    Continue estudando para desbloquear conquistas
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                      <div className="bg-yellow-600 p-3 rounded-full">
                        <Trophy className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{achievement.achievement_name}</h4>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                        <div className="text-yellow-400 text-sm font-medium">
                          +{achievement.points} pontos • {new Date(achievement.unlocked_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-4">
              <Card className="bg-gray-900 border-gray-700 p-4">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
                  <Settings className="mr-3" size={20} />
                  Configurações Gerais
                </Button>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700 p-4">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
                  <Bell className="mr-3" size={20} />
                  Notificações
                </Button>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700 p-4">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
                  <Download className="mr-3" size={20} />
                  Exportar Dados
                </Button>
              </Card>

              <Card className="bg-red-900/20 border-red-800 p-4">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sair da Conta
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSection;
