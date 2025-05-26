
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, Clock, TrendingUp, Brain } from 'lucide-react';

const HomeSection = () => {
  const recentQuestions = [
    { id: 1, subject: "Ética Profissional", difficulty: "Médio", answered: true },
    { id: 2, subject: "Direito Constitucional", difficulty: "Difícil", answered: false },
    { id: 3, subject: "Direito Civil", difficulty: "Fácil", answered: true },
  ];

  const featuredSections = [
    {
      title: "🧠 Questões de Ética Profissional",
      subtitle: "25 questões • Atualizado hoje",
      icon: Brain,
      color: "bg-gradient-to-r from-blue-600 to-blue-800"
    },
    {
      title: "🔥 Mais Erradas da Semana",
      subtitle: "15 questões desafiadoras",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-red-600 to-red-800"
    },
    {
      title: "⭐ Minhas Favoritas",
      subtitle: "8 questões salvas",
      icon: Star,
      color: "bg-gradient-to-r from-yellow-600 to-yellow-800"
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          Olá, Estudante! 👋
        </h1>
        <p className="text-netflix-text-secondary">
          Continue seus estudos de onde parou
        </p>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <div className="text-2xl font-bold text-netflix-red">127</div>
            <div className="text-sm text-netflix-text-secondary">Resolvidas</div>
          </Card>
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <div className="text-2xl font-bold text-green-500">78%</div>
            <div className="text-sm text-netflix-text-secondary">Acertos</div>
          </Card>
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">12</div>
            <div className="text-sm text-netflix-text-secondary">Dias</div>
          </Card>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Seções em Destaque</h2>
        <div className="space-y-4">
          {featuredSections.map((section, index) => (
            <Card 
              key={index}
              className={`${section.color} border-none p-6 cursor-pointer hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {section.title}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {section.subtitle}
                  </p>
                </div>
                <ChevronRight className="text-white" size={24} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Continue Studying */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Continue Estudando</h2>
          <Button variant="ghost" className="text-netflix-red p-0 h-auto">
            Ver todas
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentQuestions.map((question) => (
            <Card key={question.id} className="bg-netflix-card border-netflix-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold">
                    Questão {question.id}
                  </h3>
                  <p className="text-netflix-text-secondary text-sm">
                    {question.subject} • {question.difficulty}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {question.answered && (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                  <Clock size={16} className="text-netflix-text-secondary" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          <Button className="bg-netflix-red hover:bg-red-700 text-white p-6 h-auto flex flex-col gap-2">
            <Brain size={24} />
            <span>Simulado Rápido</span>
          </Button>
          <Button variant="outline" className="border-netflix-border text-white p-6 h-auto flex flex-col gap-2 hover:bg-netflix-card">
            <Star size={24} />
            <span>Revisar Favoritas</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
