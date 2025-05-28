
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Target, TrendingUp, Search } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import QuestionsSection from './QuestionsSection';
import { getAreaColors } from '../utils/areaColors';

interface AreaStats {
  area: string;
  total_questoes: number;
}

const StudyAreas = () => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [areaStats, setAreaStats] = useState<AreaStats[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<AreaStats[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAreaStats();
  }, []);

  useEffect(() => {
    // Filter areas based on search term
    if (searchTerm.trim() === '') {
      setFilteredAreas(areaStats);
    } else {
      const filtered = areaStats.filter(area =>
        area.area.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAreas(filtered);
    }
  }, [searchTerm, areaStats]);

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

        const stats = Object.entries(areaCounts)
          .map(([area, count]) => ({
            area,
            total_questoes: count
          }))
          .sort((a, b) => b.total_questoes - a.total_questoes);

        setAreaStats(stats);
        setFilteredAreas(stats);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedArea) {
    const areaColorScheme = getAreaColors(selectedArea);
    return (
      <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-6 my-0 mx-0 py-[13px] px-[14px]">
          <div className={`flex items-center gap-4 mb-6 px-[12px] p-4 rounded-lg ${areaColorScheme.bg} border-l-4 ${areaColorScheme.border}`}>
            <button 
              onClick={() => setSelectedArea('')} 
              className={`${areaColorScheme.text} hover:text-white transition-colors font-semibold`}
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

      {/* Enhanced Mobile-Friendly Search */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-text-secondary" size={20} />
          <Input
            placeholder="Buscar área do direito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-netflix-card border-netflix-border text-white placeholder-netflix-text-secondary h-12 text-base"
          />
        </div>
      </div>

      {/* Improved Mobile Areas Grid */}
      <div className="px-6 pb-6">
        {loading ? (
          <div className="text-netflix-text-secondary text-center py-8">
            Carregando áreas...
          </div>
        ) : (
          <>
            {searchTerm && (
              <div className="mb-4">
                <p className="text-netflix-text-secondary text-sm">
                  {filteredAreas.length} área(s) encontrada(s) para "{searchTerm}"
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              {filteredAreas.map(area => {
                const areaColorScheme = getAreaColors(area.area);
                return (
                  <Card 
                    key={area.area} 
                    className={`bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] border-l-4 ${areaColorScheme.border} active:scale-95`} 
                    onClick={() => setSelectedArea(area.area)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${areaColorScheme.primary} rounded-lg p-3 transition-all duration-300 flex-shrink-0`}>
                        <BookOpen className="text-white" size={24} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold text-base truncate">
                            {area.area}
                          </h3>
                          <TrendingUp size={16} className={`${areaColorScheme.text} flex-shrink-0 ml-2`} />
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={`${areaColorScheme.bg} ${areaColorScheme.text} ${areaColorScheme.border} border text-xs`}>
                            <Target size={10} className="mr-1" />
                            {area.total_questoes} questões
                          </Badge>
                        </div>
                        
                        <p className="text-netflix-text-secondary text-sm">
                          Questões comentadas para praticar
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredAreas.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <Search className="mx-auto mb-4 text-gray-500" size={48} />
                <h3 className="text-white text-lg font-semibold mb-2">Nenhuma área encontrada</h3>
                <p className="text-netflix-text-secondary">
                  Tente usar termos diferentes para sua busca
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Quick Stats */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Estatísticas Gerais</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-netflix-card border-netflix-border p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-netflix-red mb-1 animate-pulse">
              {areaStats.length}
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Áreas Disponíveis
            </div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {areaStats.reduce((sum, area) => sum + area.total_questoes, 0)}
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Total de Questões
            </div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {areaStats.length > 0 ? Math.round(areaStats.reduce((sum, area) => sum + area.total_questoes, 0) / areaStats.length) : 0}
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Média por Área
            </div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
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
