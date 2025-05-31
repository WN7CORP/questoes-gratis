
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, BookOpen, ArrowRight, Target, TrendingUp, Play } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import StudySessionFinal from './StudySessionFinal';
import { getAreaColors } from '../utils/areaColors';

interface AreaCount {
  area: string;
  count: number;
}

interface StudyAreasProps {
  onHideNavigation?: (hide: boolean) => void;
}

const StudyAreas = ({
  onHideNavigation
}: StudyAreasProps) => {
  const [areas, setAreas] = useState<AreaCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [showStudySession, setShowStudySession] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('QUESTOES_FINAL')
        .select('area')
        .not('area', 'is', null);

      if (error) {
        console.error('Error fetching areas:', error);
      } else {
        const areaCounts: Record<string, number> = {};
        data?.forEach(item => {
          if (item.area) {
            areaCounts[item.area] = (areaCounts[item.area] || 0) + 1;
          }
        });

        const areasArray: AreaCount[] = Object.entries(areaCounts)
          .map(([area, count]) => ({ area, count }))
          .sort((a, b) => b.count - a.count);

        setAreas(areasArray);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setShowStudySession(true);
    onHideNavigation?.(true);
  };

  const handleBackToAreas = () => {
    setShowStudySession(false);
    setSelectedArea('');
    onHideNavigation?.(false);
  };

  if (showStudySession) {
    return (
      <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-4 mb-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-800/40 to-gray-700/20 border border-gray-600/30 backdrop-blur-sm animate-fade-in shadow-lg">
            <button 
              onClick={handleBackToAreas} 
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 text-sm sm:text-base bg-gray-700/50 hover:bg-gray-600/50 px-3 py-2 rounded-lg border border-gray-600/50 hover:border-gray-500/50 hover:scale-105"
            >
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Voltar às Áreas</span>
              <span className="sm:hidden">Voltar</span>
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-1.5 flex-shrink-0">
                  <Play className="text-white" size={14} />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                  {selectedArea}
                </h2>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Questões em ordem aleatória
              </p>
            </div>
          </div>
          
          <StudySessionFinal 
            filters={{ area: selectedArea }}
            onExit={handleBackToAreas}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
        <div className="text-gray-400 ml-4 text-sm sm:text-base">Carregando áreas...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-netflix-black p-3 sm:p-6">
      {/* Header Mobile Optimized */}
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="bg-gradient-to-r from-netflix-red to-red-700 rounded-lg p-2 sm:p-3 transition-transform duration-200 hover:scale-110 shadow-lg w-fit">
            <BookOpen className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Áreas do Direito</h1>
            <p className="text-netflix-text-secondary text-sm sm:text-base">
              Estude por área específica e domine cada disciplina
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Target size={16} />
            <span>{areas.length} áreas disponíveis</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span>Ordenado por quantidade de questões</span>
          </div>
        </div>
      </div>

      {/* Areas Grid Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {areas.map((area, index) => {
          const colorScheme = getAreaColors(area.area);
          return (
            <Card 
              key={area.area} 
              className={`${colorScheme.bg} ${colorScheme.border} border-l-4 p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group animate-fade-in relative overflow-hidden`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleAreaSelect(area.area)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 group-hover:to-black/30 transition-all duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 pr-2">
                    <h3 className="text-white font-bold text-base sm:text-lg mb-2 group-hover:text-gray-100 transition-colors leading-tight">
                      {area.area}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`${colorScheme.border} ${colorScheme.text} bg-black/30 transition-all duration-200 group-hover:scale-105 font-medium text-xs`}
                    >
                      {area.count} questões
                    </Badge>
                  </div>
                  <div className={`${colorScheme.primary} rounded-lg p-2 transition-transform duration-200 group-hover:scale-110 shadow-lg flex-shrink-0`}>
                    <Scale className="text-white" size={18} />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-gray-300 text-xs sm:text-sm">
                    Clique para estudar todas as questões
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 self-end sm:self-auto" size={14} />
                </div>

                <div className="mt-3 w-full bg-gray-700/50 rounded-full h-1 overflow-hidden">
                  <div 
                    className={`h-1 ${colorScheme.primary} transition-all duration-500 group-hover:w-full`}
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Stats Footer Mobile Optimized */}
      <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-r from-netflix-red/10 to-red-800/10 border border-netflix-red/20 rounded-lg animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="text-center">
          <h3 className="text-white font-bold text-base sm:text-lg mb-2 flex items-center justify-center gap-2">
            <Target className="text-netflix-red" size={18} />
            Total de {areas.reduce((sum, area) => sum + area.count, 0).toLocaleString()} questões disponíveis
          </h3>
          <p className="text-netflix-text-secondary text-sm sm:text-base mb-3 sm:mb-4">
            Escolha uma área acima para iniciar uma sessão de estudo completa
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-400">
            <span>✓ Estudo focado por área</span>
            <span>✓ Resultados detalhados</span>
            <span>✓ Progresso personalizado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyAreas;
