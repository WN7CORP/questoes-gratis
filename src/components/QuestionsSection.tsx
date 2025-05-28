import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import MinimalQuestionCard from './MinimalQuestionCard';
import StudyModeSelector from './StudyModeSelector';
import CelebrationModal from './CelebrationModal';
import StreakCounter from './StreakCounter';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Target, Zap, Clock, Pause, Square } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getAreaColors } from '../utils/areaColors';

interface Question {
  id: number;
  ano: string;
  exame: string;
  area: string;
  numero: string;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  resposta_correta: string;
  justificativa: string;
  banca: string;
}

interface QuestionsSectionProps {
  selectedArea?: string;
  selectedExam?: string;
  selectedYear?: string;
  limit?: number;
  showFilters?: boolean;
  isSimulado?: boolean;
  isDailyChallenge?: boolean;
  onHideNavigation?: (hide: boolean) => void;
}

const QuestionsSection = ({
  selectedArea,
  selectedExam,
  selectedYear,
  limit = 10,
  showFilters = true,
  isSimulado = false,
  isDailyChallenge = false,
  onHideNavigation
}: QuestionsSectionProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string; correct: boolean; timestamp: number }>>({});
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>(selectedArea || '');
  const [studyMode, setStudyMode] = useState<'all' | 'favorites' | 'wrong'>('all');
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, startTime: Date.now() });
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // Simulado specific states
  const [simuladoTime, setSimuladoTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [simuladoStartTime, setSimuladoStartTime] = useState<number | null>(null);
  
  const { toast } = useToast();

  const areaColorScheme = selectedAreaFilter ? getAreaColors(selectedAreaFilter) : null;

  useEffect(() => {
    fetchQuestions();
    fetchAreas();
    createStudySession();
    
    if (isSimulado || isDailyChallenge) {
      setSimuladoStartTime(Date.now());
      // Hide navigation on mobile when starting questions
      if (onHideNavigation) {
        onHideNavigation(true);
      }
    }

    // Cleanup function to show navigation again
    return () => {
      if (onHideNavigation) {
        onHideNavigation(false);
      }
    };
  }, [selectedAreaFilter, selectedExam, selectedYear, limit, studyMode]);

  // Timer for simulado
  useEffect(() => {
    if ((isSimulado || isDailyChallenge) && !isPaused && simuladoStartTime) {
      const timer = setInterval(() => {
        setSimuladoTime(Math.floor((Date.now() - simuladoStartTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSimulado, isDailyChallenge, isPaused, simuladoStartTime]);

  const createStudySession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sessionMode = isDailyChallenge ? 'daily_challenge' : studyMode;

      const { data: session, error } = await supabase
        .from('user_study_sessions')
        .insert({
          user_id: user.id,
          mode: sessionMode,
          area: selectedAreaFilter || null,
          questions_answered: 0,
          correct_answers: 0,
          total_time: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating study session:', error);
      } else {
        setCurrentSessionId(session.id);
        console.log('Study session created:', session.id);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const saveSessionProgress = async () => {
    if (!currentSessionId) return;

    try {
      const totalTime = Math.floor((Date.now() - sessionStats.startTime) / 1000);
      
      const { error } = await supabase
        .from('user_study_sessions')
        .update({
          questions_answered: sessionStats.total,
          correct_answers: sessionStats.correct,
          total_time: totalTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', currentSessionId);

      if (error) {
        console.error('Error saving session progress:', error);
      } else {
        console.log('Session progress saved:', {
          questions: sessionStats.total,
          correct: sessionStats.correct,
          time: totalTime
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const saveQuestionResponse = async (questionId: number, selectedAnswer: string, isCorrect: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_questoes')
        .insert({
          user_id: user.id,
          questao_id: questionId,
          resposta_selecionada: selectedAnswer,
          acertou: isCorrect
        });

      if (error) {
        console.error('Error saving question response:', error);
      } else {
        console.log('Question response saved:', { questionId, selectedAnswer, isCorrect });
      }
    } catch (error) {
      console.error('Error saving question response:', error);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase.from('Questoes_Comentadas').select('*');
      
      if (selectedAreaFilter) {
        query = query.eq('area', selectedAreaFilter);
      }
      
      if (selectedExam) {
        query = query.eq('exame', selectedExam);
      }
      
      if (selectedYear) {
        query = query.eq('ano', selectedYear);
      }
      
      // For daily challenge, get random questions
      if (isDailyChallenge) {
        query = query.limit(20);
        // Add some randomization logic here if needed
      } else if (isSimulado && selectedExam) {
        query = query.order('numero', { ascending: true });
      }
      
      query = query.limit(limit);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as questões",
          variant: "destructive"
        });
      } else {
        setQuestions(data || []);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setStreak(0);
        setSessionStats({ correct: 0, total: 0, startTime: Date.now() });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
        .select('area')
        .not('area', 'is', null);
      
      if (error) {
        console.error('Error fetching areas:', error);
      } else {
        const uniqueAreas = [...new Set(data?.map(item => item.area) || [])];
        setAreas(uniqueAreas.filter(Boolean));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAnswer = async (questionId: number, selectedAnswer: string, isCorrect: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer: selectedAnswer,
        correct: isCorrect,
        timestamp: Date.now()
      }
    }));
    
    setSessionStats(prev => ({
      ...prev,
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0)
    }));

    await saveQuestionResponse(questionId, selectedAnswer, isCorrect);

    setTimeout(() => {
      saveSessionProgress();
    }, 100);

    if (isCorrect) {
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak >= 3 && newStreak % 3 === 0) {
          setShowStreakAnimation(true);
          setTimeout(() => setShowStreakAnimation(false), 1500);
        }
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // If question is annulled, skip without requiring answer
    if (currentQuestion?.resposta_correta === 'ANULADA') {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        finishSession();
      }
      return;
    }

    // Normal flow for regular questions
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishSession();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const pauseSimulado = () => {
    setIsPaused(true);
    toast({
      title: "Simulado pausado",
      description: "Você pode continuar de onde parou a qualquer momento"
    });
  };

  const resumeSimulado = () => {
    setIsPaused(false);
    if (simuladoStartTime) {
      setSimuladoStartTime(Date.now() - simuladoTime * 1000);
    }
  };

  const finishSimulado = async () => {
    const totalTime = Math.floor((Date.now() - (simuladoStartTime || Date.now())) / 1000);
    const percentage = Math.round((sessionStats.correct / sessionStats.total) * 100);
    
    await saveSessionProgress();
    
    setShowCelebration(true);
    
    toast({
      title: isDailyChallenge ? "Desafio concluído!" : "Simulado finalizado!",
      description: `Você acertou ${sessionStats.correct} de ${sessionStats.total} questões (${percentage}%)`
    });
  };

  const finishSession = async () => {
    if (isSimulado || isDailyChallenge) {
      finishSimulado();
    } else {
      const totalTime = Math.floor((Date.now() - sessionStats.startTime) / 1000);
      const percentage = Math.round((sessionStats.correct / sessionStats.total) * 100);
      
      await saveSessionProgress();
      
      setShowCelebration(true);
      
      toast({
        title: "Sessão finalizada!",
        description: `Você acertou ${sessionStats.correct} de ${sessionStats.total} questões (${percentage}%)`
      });
    }
  };

  const shuffleQuestions = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSessionStats({ correct: 0, total: 0, startTime: Date.now() });
    setStreak(0);
    createStudySession();
  };

  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSessionStats({ correct: 0, total: 0, startTime: Date.now() });
    setStreak(0);
    createStudySession();
  };

  const getStats = () => {
    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = Object.values(answers).filter(a => a.correct).length;
    const percentage = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;
    return { answeredQuestions, correctAnswers, percentage };
  };

  // Save progress when component unmounts or user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionStats.total > 0) {
        saveSessionProgress();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save progress when component unmounts
      if (sessionStats.total > 0) {
        saveSessionProgress();
      }
    };
  }, [sessionStats, currentSessionId]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
        <div className="text-gray-400 ml-4">Carregando questões...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="bg-netflix-card border-netflix-border p-8 text-center">
        <Scale className="mx-auto mb-4 text-gray-500" size={48} />
        <h3 className="text-white text-xl font-semibold mb-2">Nenhuma questão encontrada</h3>
        <p className="text-gray-400">
          Não há questões disponíveis para os filtros selecionados.
        </p>
      </Card>
    );
  }

  const stats = getStats();
  const currentQuestion = questions[currentQuestionIndex];
  const isQuestionAnnulled = currentQuestion?.resposta_correta === 'ANULADA';

  return (
    <div className="space-y-6 p-4 sm:p-0 px-0 py-0">
      {/* Simulado Timer and Controls */}
      {(isSimulado || isDailyChallenge) && (
        <Card className="bg-netflix-card border-netflix-border p-4 border-l-4 border-netflix-red sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="text-netflix-red" size={20} />
                <span className="text-2xl font-bold text-white">
                  {formatTime(simuladoTime)}
                </span>
              </div>
              {isPaused && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-300 bg-yellow-900/20">
                  PAUSADO
                </Badge>
              )}
              {isDailyChallenge && (
                <Badge variant="outline" className="border-orange-500 text-orange-300 bg-orange-900/20">
                  DESAFIO DIÁRIO
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isPaused ? (
                <Button
                  onClick={pauseSimulado}
                  variant="outline"
                  size="sm"
                  className="border-yellow-600 text-yellow-300 hover:bg-yellow-900/20"
                >
                  <Pause size={16} className="mr-1" />
                  Pausar
                </Button>
              ) : (
                <Button
                  onClick={resumeSimulado}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Continuar
                </Button>
              )}
              <Button
                onClick={finishSimulado}
                variant="outline"
                size="sm"
                className="border-netflix-red text-netflix-red hover:bg-red-900/20"
              >
                <Square size={16} className="mr-1" />
                Finalizar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Study Mode Selector - Hide for simulado and daily challenge */}
      {!isSimulado && !isDailyChallenge && (
        <StudyModeSelector
          studyMode={studyMode}
          setStudyMode={setStudyMode}
          selectedAreaFilter={selectedAreaFilter}
          setSelectedAreaFilter={setSelectedAreaFilter}
          areas={areas}
          onShuffle={shuffleQuestions}
          onReset={resetSession}
        />
      )}

      {/* Enhanced Stats with area colors and streak */}
      <Card className={`bg-netflix-card border-netflix-border p-4 ${areaColorScheme ? `border-l-4 ${areaColorScheme.border}` : ''}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className={`border-gray-600 text-gray-300 text-lg font-bold px-4 py-2 ${areaColorScheme ? areaColorScheme.bg : 'bg-gray-800'}`}>
              Questão {currentQuestionIndex + 1} de {questions.length}
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800">
              Respondidas: {stats.answeredQuestions}
            </Badge>
            <Badge variant="outline" className={`border-gray-600 ${stats.percentage >= 70 ? 'text-green-400 bg-green-900/20' : 'text-gray-300 bg-gray-800'}`}>
              <Target size={14} className="mr-1" />
              Acertos: {stats.percentage}%
            </Badge>
            {streak >= 3 && (
              <Badge variant="outline" className="border-orange-500 text-orange-300 bg-orange-900/20 animate-pulse">
                <Zap size={14} className="mr-1" />
                {streak} sequência!
              </Badge>
            )}
            {isQuestionAnnulled && (
              <Badge variant="outline" className="border-gray-500 text-gray-400 bg-gray-800/50">
                QUESTÃO ANULADA
              </Badge>
            )}
          </div>
          
          {/* Streak Counter */}
          <StreakCounter streak={streak} showAnimation={showStreakAnimation} />
        </div>
      </Card>

      {/* Question with annulled state */}
      <div className={isQuestionAnnulled ? 'opacity-50 pointer-events-none' : ''}>
        <MinimalQuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          isAnswered={!!answers[currentQuestion.id]}
          isAnnulled={isQuestionAnnulled}
        />
      </div>

      {/* Enhanced Navigation */}
      <div className="flex justify-between items-center gap-4">
        <Button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className={`border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 ${areaColorScheme ? `${areaColorScheme.hover} ${areaColorScheme.border} border` : 'bg-gray-800'} transition-all duration-200`}
        >
          Anterior
        </Button>
        
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">
            Progresso: {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </div>
          <div className="w-32 sm:w-48 bg-gray-800 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${areaColorScheme ? areaColorScheme.primary : 'bg-netflix-red'}`}
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        <Button
          onClick={nextQuestion}
          disabled={!isQuestionAnnulled && currentQuestionIndex === questions.length - 1 && !answers[currentQuestion.id]}
          className={`${areaColorScheme ? `${areaColorScheme.primary} ${areaColorScheme.hover}` : 'bg-netflix-red hover:bg-red-700'} text-white disabled:opacity-50 transition-all duration-200 hover:scale-[1.02]`}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
        </Button>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isVisible={showCelebration}
        onClose={() => setShowCelebration(false)}
        streak={streak}
        percentage={stats.percentage}
        questionsAnswered={stats.answeredQuestions}
      />
    </div>
  );
};

export default QuestionsSection;
