import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Clock, Target, ChevronRight, User, Trophy, Award } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import QuestionsSection from './QuestionsSection';
import StudyOptionsModal from './StudyOptionsModal';

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

interface UserAreaStats {
  area: string;
  total_sessions: number;
  total_questions: number;
  total_correct: number;
  accuracy_percentage: number;
  avg_time_per_question: number;
}

const HomeSection = () => {
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [userAreaStats, setUserAreaStats] = useState<UserAreaStats[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [pendingMode, setPendingMode] = useState<string>('');
  const [studyOptions, setStudyOptions] = useState<{ mode: string; questionCount: number; areas: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchHomeData();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    console.log('Current user:', user);
  };

  const fetchHomeData = async () => {
    try {
      // Fetch recent questions ordenadas por ID (mais recentes primeiro)
      const { data: questionsData, error: questionsError } = await supabase
        .from('Questoes_Comentadas')
        .select('*')
        .order('id', { ascending: false })
        .limit(5);

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
      } else {
        setRecentQuestions(questionsData || []);
      }

      // Fetch user performance statistics by area with better query
      console.log('Fetching user area statistics...');
      const { data: statsData, error: statsError } = await supabase
        .from('user_study_sessions')
        .select('*')
        .not('area', 'is', null)
        .order('created_at', { ascending: false });

      console.log('Raw stats data:', statsData);
      console.log('Stats error:', statsError);

      if (statsError) {
        console.error('Error fetching user stats:', statsError);
      } else if (statsData && statsData.length > 0) {
        // Process stats by area
        const areaStats: Record<string, {
          total_sessions: number;
          total_questions: number;
          total_correct: number;
          total_time: number;
        }> = {};

        statsData.forEach(session => {
          if (session.area && session.area.trim() !== '') {
            if (!areaStats[session.area]) {
              areaStats[session.area] = {
                total_sessions: 0,
                total_questions: 0,
                total_correct: 0,
                total_time: 0
              };
            }
            areaStats[session.area].total_sessions += 1;
            areaStats[session.area].total_questions += session.questions_answered || 0;
            areaStats[session.area].total_correct += session.correct_answers || 0;
            areaStats[session.area].total_time += session.total_time || 0;
          }
        });

        console.log('Processed area stats:', areaStats);

        const processedStats = Object.entries(areaStats)
          .map(([area, stats]) => ({
            area,
            total_sessions: stats.total_sessions,
            total_questions: stats.total_questions,
            total_correct: stats.total_correct,
            accuracy_percentage: stats.total_questions > 0 
              ? Math.round((stats.total_correct / stats.total_questions) * 100) 
              : 0,
            avg_time_per_question: stats.total_questions > 0 
              ? Math.round(stats.total_time / stats.total_questions) 
              : 0
          }))
          .filter(stat => stat.total_questions >= 3) // Reduzindo para 3 questões mínimas
          .sort((a, b) => b.accuracy_percentage - a.accuracy_percentage)
          .slice(0, 6);

        console.log('Final processed stats:', processedStats);
        setUserAreaStats(processedStats);
      } else {
        console.log('No statistics data found');
        setUserAreaStats([]);
      }
    } catch (error) {
      console.error('Error in fetchHomeData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartStudy = (mode: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setPendingMode(mode);
    setShowOptionsModal(true);
  };

  const handleOptionsConfirm = (options: { mode: string; questionCount: number; areas: string[] }) => {
    setStudyOptions(options);
    setSelectedMode(options.mode);
    setShowOptionsModal(false);
  };

  const handleAreaClick = (area: string) => {
    // Navegar para a seção de estudos com a área específica
    if (!user) {
      navigate('/auth');
      return;
    }
    // Aqui você pode implementar a navegação para StudyAreas com filtro específico
    console.log('Navegando para área:', area);
  };

  if (selectedMode && studyOptions) {
    return (
      <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-6 px-[15px]">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                setSelectedMode('');
                setStudyOptions(null);
              }} 
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
            limit={studyOptions.questionCount} 
            showFilters={selectedMode !== 'simulado'}
            selectedArea={studyOptions.areas.length > 0 ? studyOptions.areas[0] : undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Bem-vindo ao OAB Questões
            </h1>
            <p className="text-netflix-text-secondary text-lg">
              Estude com questões comentadas e prepare-se para o exame
            </p>
          </div>
          {!user && (
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-netflix-red hover:bg-red-700 text-white"
            >
              <User className="mr-2" size={16} />
              Entrar
            </Button>
          )}
        </div>
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

      {/* User Performance Statistics */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={24} />
          Estatísticas de Desempenho por Área
        </h2>
        {user ? (
          loading ? (
            <Card className="bg-netflix-card border-netflix-border p-6 text-center">
              <div className="text-netflix-text-secondary">
                Carregando estatísticas...
              </div>
            </Card>
          ) : userAreaStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAreaStats.map((stat, index) => (
                <Card 
                  key={stat.area} 
                  className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => handleAreaClick(stat.area)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy className="text-yellow-500 flex-shrink-0" size={20} />}
                      {index === 1 && <Award className="text-gray-400 flex-shrink-0" size={20} />}
                      {index === 2 && <Award className="text-orange-500 flex-shrink-0" size={20} />}
                      {index > 2 && <BookOpen className="text-netflix-red flex-shrink-0" size={20} />}
                    </div>
                    <Badge 
                      className={`
                        ${stat.accuracy_percentage >= 80 ? 'bg-green-600' : 
                          stat.accuracy_percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        } text-white
                      `}
                    >
                      {stat.accuracy_percentage}%
                    </Badge>
                  </div>
                  
                  <h3 className="text-white font-medium text-sm mb-2 truncate">
                    {stat.area}
                  </h3>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-netflix-text-secondary">
                      <span>Questões:</span>
                      <span className="text-white">{stat.total_questions}</span>
                    </div>
                    <div className="flex justify-between text-netflix-text-secondary">
                      <span>Acertos:</span>
                      <span className="text-green-400">{stat.total_correct}</span>
                    </div>
                    <div className="flex justify-between text-netflix-text-secondary">
                      <span>Tempo/Q:</span>
                      <span className="text-blue-400">{stat.avg_time_per_question}s</span>
                    </div>
                    <div className="flex justify-between text-netflix-text-secondary">
                      <span>Sessões:</span>
                      <span className="text-purple-400">{stat.total_sessions}</span>
                    </div>
                  </div>
                  
                  <ChevronRight className="text-netflix-text-secondary mt-2 ml-auto" size={16} />
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-netflix-card border-netflix-border p-6 text-center">
              <Trophy className="mx-auto mb-4 text-gray-500" size={48} />
              <h3 className="text-white text-lg font-semibold mb-2">Nenhuma estatística ainda</h3>
              <p className="text-netflix-text-secondary">
                Complete algumas sessões de estudo para ver suas estatísticas de desempenho
              </p>
            </Card>
          )
        ) : (
          <Card className="bg-netflix-card border-netflix-border p-6 text-center">
            <User className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-white text-lg font-semibold mb-2">Faça login para ver estatísticas</h3>
            <p className="text-netflix-text-secondary mb-4">
              Entre na sua conta para acompanhar seu desempenho por área
            </p>
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-netflix-red hover:bg-red-700 text-white"
            >
              Fazer Login
            </Button>
          </Card>
        )}
      </div>

      {/* Recent Questions Preview */}
      <div className="px-6 pb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Questões Recentes</h2>
        <div className="space-y-3">
          {loading ? (
            <div className="text-netflix-text-secondary text-center py-8">
              Carregando questões...
            </div>
          ) : (
            recentQuestions.slice(0, 3).map(question => (
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

      {/* Modal de Opções */}
      <StudyOptionsModal
        isVisible={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onStart={handleOptionsConfirm}
        mode={pendingMode}
      />
    </div>
  );
};

export default HomeSection;
