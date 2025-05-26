
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, TrendingUp } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import QuestionsSection from './QuestionsSection';

interface AreaStats {
  area: string;
  total_questoes: number;
}

const StudyAreas = () => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [areaStats, setAreaStats] = useState<AreaStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAreaStats();
  }, []);

  const fetchAreaStats = async () => {
    try {
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
        .select('area')
        .not('area', 'is', null);

      if (error) {
        console.error('Error fetching area stats:', error);
      } else {
        // Count questions per area
        const areaCounts: Record<string, number> = {};
        data?.forEach(item => {
          if (item.area) {
            areaCounts[item.area] = (areaCounts[item.area] || 0) + 1;
          }
        });

        const stats = Object.entries(areaCounts).map(([area, count]) => ({
          area,
          total_questoes: count
        })).sort((a, b) => b.total_questoes - a.total_questoes);

        setAreaStats(stats);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedArea) {
    return (
      <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSelectedArea('')}
              className="text-netflix-red hover:text-red-400 transition-colors"
            >
              ← Voltar
            </button>
            <h1 className="text-2xl font-bold text-white">
              {selectedArea}
            </h1>
          </div>
          
          <QuestionsSection selectedArea={selectedArea} limit={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          Áreas de Estudo
        </h1>
        <p className="text-netflix-text-secondary">
          Escolha uma área para começar a estudar
        </p>
      </div>

      {/* Areas Grid */}
      <div className="px-6 pb-6">
        {loading ? (
          <div className="text-netflix-text-secondary text-center py-8">
            Carregando áreas...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areaStats.map((area) => (
              <Card 
                key={area.area}
                className="bg-netflix-card border-netflix-border p-6 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => setSelectedArea(area.area)}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-netflix-red rounded-lg p-3 mt-1">
                    <BookOpen className="text-white" size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {area.area}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-netflix-border text-netflix-text-secondary">
                        <Target size={12} className="mr-1" />
                        {area.total_questoes} questões
                      </Badge>
                    </div>
                    
                    <p className="text-netflix-text-secondary text-sm">
                      Pratique com questões comentadas e melhore seu desempenho
                    </p>
                  </div>
                  
                  <div className="text-netflix-red">
                    <TrendingUp size={20} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Estatísticas Gerais</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <div className="text-2xl font-bold text-netflix-red mb-1">
              {areaStats.length}
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Áreas Disponíveis
            </div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <div className="text-2xl font-bold text-netflix-red mb-1">
              {areaStats.reduce((sum, area) => sum + area.total_questoes, 0)}
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Total de Questões
            </div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <div className="text-2xl font-bold text-netflix-red mb-1">
              {areaStats.length > 0 ? Math.round(areaStats.reduce((sum, area) => sum + area.total_questoes, 0) / areaStats.length) : 0}
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Média por Área
            </div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center">
            <div className="text-2xl font-bold text-netflix-red mb-1">
              100%
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Questões Comentadas
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyAreas;
