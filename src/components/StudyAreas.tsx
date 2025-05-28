import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Scale, Search, ChevronRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import QuestionsSection from './QuestionsSection';
interface StudyAreasProps {
  onHideNavigation?: (hide: boolean) => void;
}
const StudyAreas = ({
  onHideNavigation
}: StudyAreasProps) => {
  const [areas, setAreas] = useState<{
    area: string;
    count: number;
  }[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<{
    area: string;
    count: number;
  }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchAreas();
  }, []);
  useEffect(() => {
    const filtered = areas.filter(area => area.area.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredAreas(filtered);
  }, [searchTerm, areas]);
  const fetchAreas = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('Questoes_Comentadas').select('area').not('area', 'is', null);
      if (error) {
        console.error('Error fetching areas:', error);
      } else {
        const areaCount = data?.reduce((acc: Record<string, number>, item) => {
          if (item.area) {
            acc[item.area] = (acc[item.area] || 0) + 1;
          }
          return acc;
        }, {});
        const areasWithCount = Object.entries(areaCount || {}).map(([area, count]) => ({
          area,
          count: count as number
        })).sort((a, b) => b.count - a.count);
        setAreas(areasWithCount);
        setFilteredAreas(areasWithCount);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
  };
  const getAreaColors = (index: number) => {
    const colors = ['from-blue-900/30 to-blue-800/20 border-blue-700/50', 'from-green-900/30 to-green-800/20 border-green-700/50', 'from-purple-900/30 to-purple-800/20 border-purple-700/50', 'from-red-900/30 to-red-800/20 border-red-700/50', 'from-orange-900/30 to-orange-800/20 border-orange-700/50', 'from-cyan-900/30 to-cyan-800/20 border-cyan-700/50'];
    return colors[index % colors.length];
  };
  if (selectedArea) {
    return <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-6 px-[6px]">
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-gray-800 border-l-4 border-netflix-red">
            <button onClick={() => setSelectedArea('')} className="text-netflix-red hover:text-red-400 transition-colors font-semibold">
              ← Voltar às Áreas
            </button>
            <h1 className="text-2xl font-bold text-white">
              Estudando: {selectedArea}
            </h1>
          </div>
          
          <QuestionsSection selectedArea={selectedArea} limit={50} onHideNavigation={onHideNavigation} />
        </div>
      </div>;
  }
  return <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="text-netflix-red" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Áreas do Direito</h1>
            <p className="text-netflix-text-secondary text-lg">
              Escolha uma área para estudar questões específicas
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input placeholder="Buscar área do direito..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-netflix-card border-netflix-border text-white placeholder-gray-400 focus:border-netflix-red" />
        </div>
      </div>

      {/* Areas Grid */}
      <div className="pb-6 px-6">
        {loading ? <div className="text-netflix-text-secondary text-center py-8">
            Carregando áreas...
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAreas.map((areaInfo, index) => <Card key={areaInfo.area} className={`bg-gradient-to-br ${getAreaColors(index)} p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group border-2`} onClick={() => handleAreaSelect(areaInfo.area)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/10 rounded-lg p-3 group-hover:scale-110 transition-transform">
                    <Scale className="text-white" size={24} />
                  </div>
                  <ChevronRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-white transition-colors">
                  {areaInfo.area}
                </h3>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-white/30 text-white bg-white/10">
                    {areaInfo.count} questões
                  </Badge>
                  
                  <div className="text-white/80 text-sm font-medium">
                    Estudar →
                  </div>
                </div>
              </Card>)}
          </div>}

        {!loading && filteredAreas.length === 0 && <div className="text-center py-12">
            <Scale className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-white text-xl font-semibold mb-2">Nenhuma área encontrada</h3>
            <p className="text-gray-400">
              Tente buscar por outro termo ou verifique a ortografia.
            </p>
          </div>}
      </div>
    </div>;
};
export default StudyAreas;