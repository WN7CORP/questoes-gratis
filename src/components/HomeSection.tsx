
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Clock, Target, ChevronRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import QuestionsSection from './QuestionsSection';

interface Question {
  id: number;
  ano: string;
  exame: string;
  area: string;
  numero: string;
  questao: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  resposta_correta: string;
  justificativa: string;
}

interface AreaStats {
  area: string;
  total_questoes: number;
}

const HomeSection = () => {
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [popularAreas, setPopularAreas] = useState<AreaStats[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch recent questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('Questoes_Comentadas')
        .select('*')
        .limit(5);

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
      } else {
        setRecentQuestions(questionsData || []);
      }

      // Fetch popular areas
      const { data: areasData, error: areasError } = await supabase
        .from('Questoes_Comentadas')
        .select('area')
        .not('area', 'is', null);

      if (areasError) {
        console.error('Error fetching areas:', areasError);
      } else {
        const areaCounts: Record<string, number> = {};
        areasData?.forEach(item => {
          if (item.area) {
            areaCounts[item.area] = (areaCounts[item.area] || 0) + 1;
          }
        });

        const stats = Object.entries(areaCounts)
          .map(([area, count]) => ({ area, total_questoes: count }))
          .sort((a, b) => b.total_questoes - a.total_questoes)
          .slice(0, 6);

        setPopularAreas(stats);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartStudy = (mode: string) => {
    setSelectedMode(mode);
  };

  if (selectedMode) {
    return (
      <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSelectedMode('')}
              className="text-netflix-red hover:text-red-400 transition-colors"
            >
              ← Voltar
            </button>
            <h1 className="text-2xl font-bold text-white">
              {selectedMode === 'random' ? 'Questões Aleatórias' : 
               selectedMode === 'recent' ? 'Questões Recentes' : 
               'Simulado Rápido'}
            </h1>
          </div>
          
          <QuestionsSection 
            limit={selectedMode === 'simulado' ? 20 : 10}
            showFilters={selectedMode !== 'simulado'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2">
          Bem-vindo ao OAB Questões
        </h1>
        <p className="text-netflix-text-secondary text-lg">
          Estude com questões comentadas e prepare-se para o exame
        </p>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Começar Estudos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="bg-netflix-card border-netflix-border p-6 cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={() => handleStartStudy('random')}
          >
            <div className="flex items-center gap-4">
              <div className="bg-netflix-red rounded-lg p-3">
                <Target className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Questões Aleatórias</h3>
                <p className="text-netflix-text-secondary text-sm">
                  Pratique com questões variadas
                </p>
              </div>
              <ChevronRight className="text-netflix-text-secondary" size={20} />
            </div>
          </Card>

          <Card 
            className="bg-netflix-card border-netflix-border p-6 cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={() => handleStartStudy('simulado')}
          >
            <div className="flex items-center gap-4">
              <div className="bg-netflix-red rounded-lg p-3">
                <Clock className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Simulado Rápido</h3>
                <p className="text-netflix-text-secondary text-sm">
                  20 questões cronometradas
                </p>
              </div>
              <ChevronRight className="text-netflix-text-secondary" size={20} />
            </div>
          </Card>

          <Card 
            className="bg-netflix-card border-netflix-border p-6 cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={() => handleStartStudy('recent')}
          >
            <div className="flex items-center gap-4">
              <div className="bg-netflix-red rounded-lg p-3">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Questões Recentes</h3>
                <p className="text-netflix-text-secondary text-sm">
                  Últimas questões adicionadas
                </p>
              </div>
              <ChevronRight className="text-netflix-text-secondary" size={20} />
            </div>
          </Card>
        </div>
      </div>

      {/* Popular Areas */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Áreas Populares</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {popularAreas.map((area) => (
            <Card 
              key={area.area}
              className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="text-netflix-red flex-shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate">
                    {area.area}
                  </h3>
                  <p className="text-netflix-text-secondary text-xs">
                    {area.total_questoes} questões
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Questions Preview */}
      <div className="px-6 pb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Questões em Destaque</h2>
        <div className="space-y-3">
          {loading ? (
            <div className="text-netflix-text-secondary text-center py-8">
              Carregando questões...
            </div>
          ) : (
            recentQuestions.slice(0, 3).map((question) => (
              <Card key={question.id} className="bg-netflix-card border-netflix-border p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-netflix-red rounded-lg p-2 mt-1">
                    <BookOpen className="text-white" size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-netflix-border text-netflix-text-secondary text-xs">
                        {question.area}
                      </Badge>
                      <Badge variant="outline" className="border-netflix-border text-netflix-text-secondary text-xs">
                        {question.exame}ª {question.ano}
                      </Badge>
                    </div>
                    
                    <p className="text-white text-sm leading-relaxed line-clamp-2">
                      {question.questao}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
