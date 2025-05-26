
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Target, TrendingUp, Brain } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: "OAB Questões",
    subtitle: "Prepare-se com questões comentadas",
    description: "Milhares de questões da OAB com comentários detalhados para sua aprovação",
    icon: BookOpen,
    gradient: "from-red-600 to-red-800"
  },
  {
    id: 2,
    title: "Simulados Inteligentes",
    subtitle: "Teste seus conhecimentos",
    description: "Simulados cronometrados que replicam o exame real da OAB",
    icon: Target,
    gradient: "from-blue-600 to-blue-800"
  },
  {
    id: 3,
    title: "Acompanhe seu Progresso",
    subtitle: "Estatísticas detalhadas",
    description: "Veja seu desempenho por área e identifique pontos de melhoria",
    icon: TrendingUp,
    gradient: "from-green-600 to-green-800"
  },
  {
    id: 4,
    title: "Estudo Adaptativo",
    subtitle: "Foque no que importa",
    description: "Nossa IA identifica suas dificuldades e sugere o melhor plano de estudos",
    icon: Brain,
    gradient: "from-purple-600 to-purple-800"
  }
];

const AppBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBanner = banners[currentIndex];
  const Icon = currentBanner.icon;

  return (
    <div className="relative mb-6 mx-4">
      <Card className={`
        relative overflow-hidden bg-gradient-to-r ${currentBanner.gradient} 
        border-none text-white p-6 md:p-8 min-h-[200px] flex items-center
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center gap-6 w-full">
          <div className="hidden md:block">
            <div className="bg-white/20 rounded-full p-4">
              <Icon size={48} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 animate-fade-in">
              {currentBanner.title}
            </h2>
            <h3 className="text-lg md:text-xl text-white/90 mb-3 animate-fade-in">
              {currentBanner.subtitle}
            </h3>
            <p className="text-white/80 text-sm md:text-base animate-fade-in">
              {currentBanner.description}
            </p>
          </div>

          <div className="md:hidden">
            <Icon size={32} className="text-white/80" />
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
      </Card>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-netflix-red' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AppBanner;
