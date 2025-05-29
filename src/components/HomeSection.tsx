import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, BookOpen, Target, TrendingUp, Zap } from 'lucide-react';
import UserStatsCard from "./UserStatsCard";
import OabTipsCarousel from "./OabTipsCarousel";
import DailyChallenge from "./DailyChallenge";

const HomeSection = () => {
  return (
    <div className="h-full overflow-y-auto bg-netflix-black p-6">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-netflix-red rounded-lg p-3 transition-transform duration-200 hover:scale-110">
            <BookOpen className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">OAB Questões</h1>
            <p className="text-netflix-text-secondary">
              Pratique e aprimore seus conhecimentos para a prova da OAB
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Target size={16} />
            <span>Foco na sua aprovação</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span>Estatísticas atualizadas diariamente</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
        {/* Daily Challenge Card */}
        <Card className="bg-gradient-to-br from-orange-600 to-red-600 border-orange-500 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-gray-100 transition-colors">
                Desafio Diário
              </h3>
              <p className="text-orange-100 text-sm mb-3">
                20 questões selecionadas para você
              </p>
              <Badge variant="outline" className="border-orange-300 text-orange-100 bg-orange-800/20">
                Novo hoje!
              </Badge>
            </div>
            <div className="bg-orange-700 rounded-lg p-2 transition-transform duration-200 group-hover:scale-110">
              <Target className="text-white" size={20} />
            </div>
          </div>
          
          <DailyChallenge />
        </Card>

        {/* Study by Areas Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-blue-500 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
              onClick={() => document.querySelector('[value="areas"]')?.click()}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-gray-100 transition-colors">
                Estudar por Áreas
              </h3>
              <p className="text-blue-100 text-sm mb-3">
                Explore questões por área do direito
              </p>
              <Badge variant="outline" className="border-blue-300 text-blue-100 bg-blue-800/20">
                {/* Número de áreas dinâmico aqui */}
                +10 áreas
              </Badge>
            </div>
            <div className="bg-blue-700 rounded-lg p-2 transition-transform duration-200 group-hover:scale-110">
              <BookOpen className="text-white" size={20} />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-blue-200 text-sm">
              Começar agora
            </div>
            <ArrowRight 
              className="text-blue-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" 
              size={16} 
            />
          </div>
        </Card>

        {/* Simulado Card */}
        <Card className="bg-gradient-to-br from-green-600 to-teal-600 border-green-500 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
              onClick={() => document.querySelector('[value="simulado"]')?.click()}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-gray-100 transition-colors">
                Simulados OAB
              </h3>
              <p className="text-teal-100 text-sm mb-3">
                Prepare-se com simulados completos
              </p>
              <Badge variant="outline" className="border-green-300 text-green-100 bg-green-800/20">
                {/* Número de simulados aqui */}
                3 opções
              </Badge>
            </div>
            <div className="bg-green-700 rounded-lg p-2 transition-transform duration-200 group-hover:scale-110">
              <Scale className="text-white" size={20} />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-teal-200 text-sm">
              Iniciar um simulado
            </div>
            <ArrowRight 
              className="text-teal-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" 
              size={16} 
            />
          </div>
        </Card>
      </div>

      {/* Recent Performance */}
      <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <UserStatsCard />
      </div>

      {/* Tips Carousel */}
      <div className="mt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <OabTipsCarousel />
      </div>
    </div>
  );
};

export default HomeSection;
