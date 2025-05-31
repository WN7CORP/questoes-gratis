
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, BookOpen, ArrowRight, Target, TrendingUp, Play } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import QuestionsSection from './QuestionsSection';
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
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
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
    setShowQuestions(true);
  };

  const handleBackToAreas = () => {
    setShowQuestions(false);
    setSelectedArea('');
    if (onHideNavigation) {
      onHideNavigation(false);
    }
  };

  if (showQuestions) {
    return (
      <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-netflix-red/20 to-red-800/20 border border-netflix-red/30 animate-fade-in">
            <button 
              onClick={handleBackToAreas} 
              className="text-netflix-red hover:text-red-400 transition-all duration-200 font-semibold hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
            >
              ← Voltar às Áreas
            </button>
            <div className="flex-1 w-full sm:w-auto">
              <h1 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 mb-1">
                <Play className="text-netflix-red" size={20} />
                Estudando: {selectedArea}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                Todas as questões disponíveis para esta área
              </p>
            </div>
          </div>
          
          <QuestionsSection 
            selectedArea={selectedArea} 
            onHideNavigation={onHideNavigation}
            limit={1000}
            showFilters={false}
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
