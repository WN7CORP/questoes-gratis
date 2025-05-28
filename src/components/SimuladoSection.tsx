
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, BookOpen, Target, Play, TrendingUp } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import QuestionsSection from './QuestionsSection';

interface ExamStats {
  exame: string;
  ano: string;
  total_questoes: number;
  areas: string[];
}

const SimuladoSection = () => {
  const [examStats, setExamStats] = useState<ExamStats[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchExamStats();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchExamStats = async () => {
    try {
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
        .select('exame, ano, area')
        .not('exame', 'is', null)
        .not('ano', 'is', null);

      if (error) {
        console.error('Error fetching exam stats:', error);
      } else {
        // Group by exam and year
        const examGroups: Record<string, ExamStats> = {};
        
        data?.forEach(item => {
          if (item.exame && item.ano) {
            const key = `${item.exame}-${item.ano}`;
            if (!examGroups[key]) {
              examGroups[key] = {
                exame: item.exame,
                ano: item.ano,
                total_questoes: 0,
                areas: []
              };
            }
            examGroups[key].total_questoes += 1;
            if (item.area && !examGroups[key].areas.includes(item.area)) {
              examGroups[key].areas.push(item.area);
            }
          }
        });

        const stats = Object.values(examGroups)
          .sort((a, b) => parseInt(b.ano) - parseInt(a.ano));
        
        setExamStats(stats);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSimulado = (exame: string, ano: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedExam(exame);
    setSelectedYear(ano);
  };

  if (selectedExam && selectedYear) {
    return (
      <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-6 px-[15px]">
          <div className="flex items-center gap-4 mb-6 px-[12px] p-4 rounded-lg bg-gray-800 border-l-4 border-netflix-red">
            <button 
              onClick={() => {
                setSelectedExam('');
                setSelectedYear('');
              }} 
              className="text-netflix-red hover:text-red-400 transition-colors font-semibold"
            >
              ← Voltar
            </button>
            <h1 className="text-2xl font-bold text-white">
              Simulado {selectedExam}ª {selectedYear}
            </h1>
          </div>
          
          <QuestionsSection 
            selectedExam={selectedExam}
            selectedYear={selectedYear}
            limit={50}
            showFilters={false}
            isSimulado={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="text-netflix-red" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Simulados OAB</h1>
            <p className="text-netflix-text-secondary text-lg">
              Pratique com provas reais dos exames anteriores
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-netflix-card border-netflix-border p-4 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-netflix-red mb-1">
              {examStats.length}
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Exames Disponíveis
            </div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {examStats.reduce((sum, exam) => sum + exam.total_questoes, 0)}
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Total de Questões
            </div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {examStats.length > 0 ? examStats[0].ano : '--'}
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Exame Mais Recente
            </div>
          </Card>
          
          <Card className="bg-netflix-card border-netflix-border p-4 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              100%
            </div>
            <div className="text-netflix-text-secondary text-sm">
              Questões Comentadas
            </div>
          </Card>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="px-6 pb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="text-netflix-red" size={24} />
          Escolha seu Simulado
        </h2>
        
        {loading ? (
          <div className="text-netflix-text-secondary text-center py-8">
            Carregando simulados...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examStats.map((exam, index) => (
              <Card 
                key={`${exam.exame}-${exam.ano}`}
                className="bg-netflix-card border-netflix-border p-6 cursor-pointer hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-l-4 border-netflix-red"
                onClick={() => handleStartSimulado(exam.exame, exam.ano)}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-netflix-red rounded-lg p-3 mt-1">
                    <Trophy className="text-white" size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-netflix-red text-white text-xs">
                        {exam.exame}ª Fase
                      </Badge>
                      <Badge variant="outline" className="border-netflix-border text-netflix-text-secondary text-xs">
                        {exam.ano}
                      </Badge>
                    </div>
                    
                    <h3 className="text-white font-semibold text-lg mb-2">
                      Exame {exam.exame}ª - {exam.ano}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1 text-netflix-text-secondary">
                        <BookOpen size={14} />
                        <span>{exam.total_questoes} questões</span>
                      </div>
                      <div className="flex items-center gap-1 text-netflix-text-secondary">
                        <Target size={14} />
                        <span>{exam.areas.length} áreas</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-blue-400 text-sm">
                        <Clock size={14} />
                        <span>~{Math.ceil(exam.total_questoes * 3)} min</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="bg-netflix-red hover:bg-red-700 text-white text-xs px-3 py-1"
                      >
                        <Play size={12} className="mr-1" />
                        Iniciar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="px-6 pb-6">
        <Card className="bg-netflix-card border-netflix-border p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 rounded-lg p-3">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Como funcionam os Simulados
              </h3>
              <ul className="text-netflix-text-secondary space-y-1 text-sm">
                <li>• Questões reais de exames anteriores da OAB</li>
                <li>• Todas as questões são comentadas com justificativas</li>
                <li>• Cronômetro para simular condições reais</li>
                <li>• Relatório detalhado de desempenho ao final</li>
                <li>• Estatísticas por área do direito</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SimuladoSection;
