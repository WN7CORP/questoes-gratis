
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Target, Award, TrendingUp, Users, Heart } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: "Bem-vindo ao Questões Jurídicas",
    description: "A plataforma mais completa para estudar direito com questões comentadas e análises detalhadas.",
    icon: BookOpen,
    color: "from-red-600 to-red-800"
  },
  {
    id: 2,
    title: "Pratique com Questões Reais",
    description: "Milhares de questões de concursos anteriores com comentários explicativos de especialistas.",
    icon: Target,
    color: "from-blue-600 to-blue-800"
  },
  {
    id: 3,
    title: "Acompanhe seu Progresso",
    description: "Estatísticas detalhadas para identificar pontos fortes e áreas que precisam de mais estudo.",
    icon: TrendingUp,
    color: "from-green-600 to-green-800"
  },
  {
    id: 4,
    title: "Conquiste suas Metas",
    description: "Sistema de gamificação com badges, pontos e rankings para manter sua motivação.",
    icon: Award,
    color: "from-yellow-600 to-yellow-800"
  },
  {
    id: 5,
    title: "Comunidade Ativa",
    description: "Participe de discussões, tire dúvidas e compartilhe conhecimento com outros estudantes.",
    icon: Users,
    color: "from-purple-600 to-purple-800"
  },
  {
    id: 6,
    title: "Favoritos e Anotações",
    description: "Salve questões importantes, faça anotações personalizadas e organize seu estudo.",
    icon: Heart,
    color: "from-pink-600 to-pink-800"
  }
];

const AppBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBannerData = banners[currentBanner];
  const IconComponent = currentBannerData.icon;

  return (
    <Card className="bg-gray-900 border-gray-700 mb-6 overflow-hidden">
      <div className={`bg-gradient-to-r ${currentBannerData.color} p-6 text-white relative`}>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevBanner}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </Button>
          
          <div className="flex-1 text-center px-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <IconComponent size={32} />
              <h2 className="text-xl font-bold">{currentBannerData.title}</h2>
            </div>
            <p className="text-white/90 text-sm max-w-2xl mx-auto">
              {currentBannerData.description}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextBanner}
            className="text-white hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
        
        {/* Dots indicator */}
        <div className="flex justify-center mt-4 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentBanner ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AppBanner;
