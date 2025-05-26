
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Bell, Download, Star, BookOpen, Trophy, Clock } from 'lucide-react';

const ProfileSection = () => {
  const achievements = [
    { name: "Primeira Questão", description: "Resolveu sua primeira questão", earned: true },
    { name: "Streak de 7 dias", description: "Estudou por 7 dias seguidos", earned: true },
    { name: "100 Questões", description: "Resolveu 100 questões", earned: true },
    { name: "Expert em Ética", description: "80% de acerto em Ética Profissional", earned: false },
  ];

  const studyPreferences = [
    { label: "Notificações de estudo", enabled: true },
    { label: "Lembrete diário", enabled: true },
    { label: "Modo escuro", enabled: true },
    { label: "Som nos acertos", enabled: false },
  ];

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          Meu Perfil
        </h1>
        <p className="text-netflix-text-secondary">
          Gerencie suas informações e configurações
        </p>
      </div>

      {/* Profile Info */}
      <div className="px-6 mb-6">
        <Card className="bg-netflix-card border-netflix-border p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-netflix-red p-4 rounded-full">
              <User className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Estudante OAB</h2>
              <p className="text-netflix-text-secondary">Membro desde Janeiro 2024</p>
              <Badge className="bg-yellow-600 text-white mt-2">
                <Star size={12} className="mr-1" />
                Estudante Dedicado
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-netflix-red">127</div>
              <div className="text-sm text-netflix-text-secondary">Questões</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">12</div>
              <div className="text-sm text-netflix-text-secondary">Dias Seguidos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">78%</div>
              <div className="text-sm text-netflix-text-secondary">Acertos</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Estatísticas Rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <BookOpen className="text-netflix-red mx-auto mb-2" size={24} />
            <div className="text-lg font-bold text-white">7</div>
            <div className="text-sm text-netflix-text-secondary">Disciplinas Estudadas</div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <Clock className="text-blue-500 mx-auto mb-2" size={24} />
            <div className="text-lg font-bold text-white">45s</div>
            <div className="text-sm text-netflix-text-secondary">Tempo Médio</div>
          </Card>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Conquistas</h2>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <Card key={index} className="bg-netflix-card border-netflix-border p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-yellow-600' : 'bg-netflix-border'}`}>
                  <Trophy className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${achievement.earned ? 'text-white' : 'text-netflix-text-secondary'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-netflix-text-secondary text-sm">
                    {achievement.description}
                  </p>
                </div>
                {achievement.earned && (
                  <Badge className="bg-yellow-600 text-white">
                    Conquistado
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Configurações</h2>
        <div className="space-y-3">
          <Card className="bg-netflix-card border-netflix-border p-4">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-netflix-border">
              <Settings className="mr-3" size={20} />
              Configurações Gerais
            </Button>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-netflix-border">
              <Bell className="mr-3" size={20} />
              Notificações
            </Button>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-netflix-border">
              <Download className="mr-3" size={20} />
              Baixar Progresso
            </Button>
          </Card>
        </div>
      </div>

      {/* Study Goal */}
      <div className="px-6 pb-6">
        <Card className="bg-gradient-to-r from-netflix-red to-red-700 border-none p-6">
          <div className="text-center">
            <Trophy className="text-white mx-auto mb-3" size={32} />
            <h3 className="text-white font-bold text-lg mb-2">
              Meta Diária: 10 Questões
            </h3>
            <p className="text-gray-200 text-sm mb-4">
              Você resolveu 8 de 10 questões hoje
            </p>
            <div className="w-full bg-red-800 rounded-full h-3 mb-4">
              <div className="bg-white h-3 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <Button variant="secondary" className="bg-white text-netflix-red hover:bg-gray-100">
              Completar Meta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSection;
