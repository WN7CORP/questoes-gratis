import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import MinimalQuestionCard from './MinimalQuestionCard';
import StudyModeSelector from './StudyModeSelector';
import CelebrationModal from './CelebrationModal';
import StreakCounter from './StreakCounter';
import QuestionJustification from './QuestionJustification';
import SimuladoResults from './SimuladoResults';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Target, Zap, Clock, Pause, Square, GraduationCap, Play } from 'lucide-react';
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
  onFinishSimulado?: () => void;
}

interface AreaStats {
  area: string;
  correct: number;
  total: number;
  percentage: number;
}

const QuestionsSection = ({
  selectedArea,
  selectedExam,
  selectedYear,
  limit = 10,
  showFilters = true,
  isSimulado = false,
  isDailyChallenge = false,
  onHideNavigation,
  onFinishSimulado
}: QuestionsSectionProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, {
    answer: string;
    correct: boolean;
    timestamp: number;
  }>>({});
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>(selectedArea || '');
  const [studyMode, setStudyMode] = useState<'all' | 'favorites' | 'wrong'>('all');
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    startTime: Date.now()
  });
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [simuladoTime, setSimuladoTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [simuladoStartTime, setSimuladoStartTime] = useState<number | null>(null);
  const [showJustification, setShowJustification] = useState(false);
  const [currentJustification, setCurrentJustification] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [areaStats, setAreaStats] = useState<AreaStats[]>([]);
  const [previousAttempts, setPreviousAttempts] = useState<any[]>([]);

  const { toast } = useToast();
  const areaColorScheme = selectedAreaFilter ? getAreaColors(selectedAreaFilter) : null;

  useEffect(() => {
    fetchQuestions();
    fetchAreas();
    createStudySession();
    if (isSimulado || isDailyChallenge) {
      setSimuladoStartTime(Date.now());
      fetchPreviousAttempts();
      if (onHideNavigation) {
        onHideNavigation(true);
      }
    }
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

  const fetchPreviousAttempts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('mode', 'simulado')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching previous attempts:', error);
      } else {
        setPreviousAttempts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculateAreaStats = () => {
    const stats: Record<string, { correct: number; total: number }> = {};
    
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        if (!stats[question.area]) {
          stats[question.area] = { correct: 0, total: 0 };
        }
        stats[question.area].total++;
        if (answer.correct) {
          stats[question.area].correct++;
        }
      }
    });

    const areaStatsArray: AreaStats[] = Object.entries(stats).map(([area, data]) => ({
      area,
      correct: data.correct,
      total: data.total,
      percentage: Math.round((data.correct / data.total) * 100)
    }));

    areaStatsArray.sort((a, b) => b.percentage - a.percentage);
    setAreaStats(areaStatsArray);
    return areaStatsArray;
  };

  const createStudySession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sessionMode = isDailyChallenge ? 'daily_challenge' : isSimulado ? 'simulado' : studyMode;

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

      // Para desafio diário, excluir questões anuladas
      if (isDailyChallenge) {
        query = query.not('resposta_correta', 'eq', 'ANULADA').limit(20);
      } else if (isSimulado && selectedExam) {
        // Para simulados, ordenar por número da questão
        query = query.order('numero', { ascending: true });
      }

      query = query.limit(limit);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        setQuestions(data || []);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setStreak(0);
        setSessionStats({
          correct: 0,
          total: 0,
          startTime: Date.now()
        });
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

  const handleShowJustification = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion?.justificativa) {
      setCurrentJustification(currentQuestion.justificativa);
      setShowJustification(true);
    }
  };

  const nextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion?.resposta_correta === 'ANULADA') {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        finishSession();
      }
      return;
    }

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
      title: "⏸️ Simulado pausado",
      description: "Clique em retomar para continuar",
      duration: 2000
    });
  };

  const resumeSimulado = () => {
    setIsPaused(false);
    if (simuladoStartTime) {
      setSimuladoStartTime(Date.now() - simuladoTime * 1000);
    }
    toast({
      title: "▶️ Simulado retomado",
      description: "Continue respondendo",
      duration: 2000
    });
  };

  const finishSimuladoEarly = async () => {
    await finishSimulado();
  };

  const finishSimulado = async () => {
    const totalTime = Math.floor((Date.now() - (simuladoStartTime || Date.now())) / 1000);
    const percentage = Math.round((sessionStats.correct / sessionStats.total) * 100);
    const passed = sessionStats.correct >= 40;

    await saveSessionProgress();

    const finalAreaStats = calculateAreaStats();
    setShowResults(true);

    // Esconder navegação para mostrar resultados
    if (onHideNavigation) {
      onHideNavigation(false);
    }
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
        title: "✅ Sessão concluída",
        description: `${sessionStats.correct}/${sessionStats.total} (${percentage}%)`,
        duration: 2000
      });
    }
  };

  const shuffleQuestions = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSessionStats({
      correct: 0,
      total: 0,
      startTime: Date.now()
    });
    setStreak(0);
    createStudySession();
  };

  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSessionStats({
      correct: 0,
      total: 0,
      startTime: Date.now()
    });
    setStreak(0);
    createStudySession();
  };

  const getStats = () => {
    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = Object.values(answers).filter(a => a.correct).length;
    const percentage = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;

    return {
      answeredQuestions,
      correctAnswers,
      percentage
    };
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionStats.total > 0) {
        saveSessionProgress();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
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

  if (showResults && (isSimulado || isDailyChallenge)) {
    return (
      <SimuladoResults
        sessionStats={sessionStats}
        areaStats={areaStats}
        previousAttempts={previousAttempts}
        examInfo={{
          exame: selectedExam,
          ano: selectedYear
        }}
        totalTime={simuladoTime}
        onClose={() => {
          setShowResults(false);
          if (onFinishSimulado) {
            onFinishSimulado();
          }
        }}
      />
    );
  }

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
  const isQuestionAnswered = !!answers[currentQuestion.id];

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-0 px-[5px] py-0">
      {/* Simulado Controls & Timer */}
      {(isSimulado || isDailyChallenge) && (
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {isPaused ? (
              <Button
                onClick={resumeSimulado}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play size={14} className="mr-1" />
                Retomar
              </Button>
            ) : (
              <Button
                onClick={pauseSimulado}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Pause size={14} className="mr-1" />
                Pausar
              </Button>
            )}
            <Button
              onClick={finishSimuladoEarly}
              size="sm"
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-900/20"
            >
              <Square size={14} className="mr-1" />
              Encerrar
            </Button>
          </div>
          
          <Badge variant="outline" className="border-gray-600 text-gray-400 bg-gray-800/50 text-xs">
            <Clock size={12} className="mr-1" />
            {formatTime(simuladoTime)}
          </Badge>
        </div>
      )}

      {/* Study Mode Selector */}
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

      {/* Enhanced Stats */}
      <Card className={`bg-netflix-card border-netflix-border p-3 sm:p-4 ${areaColorScheme ? `border-l-4 ${areaColorScheme.border}` : ''}`}>
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <Badge variant="outline" className={`border-gray-600 text-gray-300 text-sm sm:text-lg font-bold px-2 sm:px-4 py-1 sm:py-2 ${areaColorScheme ? areaColorScheme.bg : 'bg-gray-800'}`}>
              Questão {currentQuestionIndex + 1} de {questions.length}
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800 text-xs sm:text-sm">
              Respondidas: {stats.answeredQuestions}
            </Badge>
            <Badge variant="outline" className={`border-gray-600 text-xs sm:text-sm ${stats.percentage >= 70 ? 'text-green-400 bg-green-900/20' : 'text-gray-300 bg-gray-800'}`}>
              <Target size={12} className="mr-1" />
              Acertos: {stats.percentage}%
            </Badge>
            {streak >= 3 && (
              <Badge variant="outline" className="border-orange-500 text-orange-300 bg-orange-900/20 animate-pulse text-xs sm:text-sm">
                <Zap size={12} className="mr-1" />
                {streak} sequência!
              </Badge>
            )}
            {isQuestionAnnulled && (
              <Badge variant="outline" className="border-gray-500 text-gray-400 bg-gray-800/50 text-xs">
                QUESTÃO ANULADA
              </Badge>
            )}
          </div>
          
          <StreakCounter streak={streak} showAnimation={showStreakAnimation} />
        </div>
      </Card>

      {/* Question */}
      <div className={isQuestionAnnulled ? 'opacity-50 pointer-events-none' : ''}>
        <MinimalQuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          isAnswered={isQuestionAnswered}
          isAnnulled={isQuestionAnnulled}
        />
      </div>

      {/* Ver Comentário Button */}
      {isQuestionAnswered && !isQuestionAnnulled && currentQuestion?.justificativa && (
        <div className="flex justify-center">
          <Button
            onClick={handleShowJustification}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-200"
          >
            <GraduationCap size={20} />
            Ver Comentário
          </Button>
        </div>
      )}

      {/* Enhanced Navigation */}
      <div className="flex justify-between items-center gap-4">
        <Button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className={`border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 ${areaColorScheme ? `${areaColorScheme.hover} ${areaColorScheme.border} border` : 'bg-gray-800'} transition-all duration-200 text-sm px-3 py-2`}
        >
          Anterior
        </Button>
        
        <div className="text-center flex-1">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">
            Progresso: {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${areaColorScheme ? areaColorScheme.primary : 'bg-netflix-red'}`}
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        <Button
          onClick={nextQuestion}
          disabled={!isQuestionAnnulled && currentQuestionIndex === questions.length - 1 && !answers[currentQuestion.id]}
          className={`${areaColorScheme ? `${areaColorScheme.primary} ${areaColorScheme.hover}` : 'bg-netflix-red hover:bg-red-700'} text-white disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] text-sm px-3 py-2`}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
        </Button>
      </div>

      {/* Question Justification Modal */}
      <QuestionJustification
        justification={currentJustification}
        isVisible={showJustification}
        onClose={() => setShowJustification(false)}
      />

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
