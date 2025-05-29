import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, BookOpen, ArrowRight, Target, TrendingUp } from 'lucide-react';
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

const StudyAreas = ({ onHideNavigation }: StudyAreasProps) => {
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
    // Mostrar o menu novamente quando voltar para a lista de áreas
    if (onHideNavigation) {
      onHideNavigation(false);
    }
  };

  if (showQuestions) {
    return (
      <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-gray-800 border-l-4 border-netflix-red animate-fade-in">
            <button 
              onClick={handleBackToAreas} 
              className="text-netflix-red hover:text-red-400 transition-all duration-200 font-semibold hover:scale-105"
            >
              ← Voltar às Áreas
            </button>
            <h1 className="text-2xl font-bold text-white">
              Estudando: {selectedArea}
            </h1>
          </div>
          
          <QuestionsSection 
            selectedArea={selectedArea} 
            onHideNavigation={onHideNavigation}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
        <div className="text-gray-400 ml-4">Carregando áreas...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-netflix-black p-6">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-netflix-red rounded-lg p-3 transition-transform duration-200 hover:scale-110">
            <BookOpen className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Áreas do Direito</h1>
            <p className="text-netflix-text-secondary">
              Estude por área específica e domine cada disciplina
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">
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

      {/* Areas Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area, index) => {
          const colorScheme = getAreaColors(area.area);
          return (
            <Card 
              key={area.area} 
              className={`${colorScheme.bg} ${colorScheme.border} border-l-4 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleAreaSelect(area.area)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-gray-100 transition-colors">
                    {area.area}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`${colorScheme.border} ${colorScheme.text} bg-black/20 transition-all duration-200 group-hover:scale-105`}
                  >
                    {area.count} questões
                  </Badge>
                </div>
                <div className={`${colorScheme.primary} rounded-lg p-2 transition-transform duration-200 group-hover:scale-110`}>
                  <Scale className="text-white" size={20} />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-gray-300 text-sm">
                  Clique para estudar
                </div>
                <ArrowRight 
                  className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" 
                  size={16} 
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className="mt-12 p-6 bg-gradient-to-r from-netflix-red/10 to-red-800/10 border border-netflix-red/20 rounded-lg animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="text-center">
          <h3 className="text-white font-bold text-lg mb-2">
            Total de {areas.reduce((sum, area) => sum + area.count, 0).toLocaleString()} questões disponíveis
          </h3>
          <p className="text-netflix-text-secondary">
            Escolha uma área acima para começar seus estudos focados
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyAreas;
