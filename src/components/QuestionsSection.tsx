
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { QuestionFinal } from '@/types/questionFinal';
import { transformSupabaseToQuestionsFinal } from '@/utils/questionFinalTransform';
import QuestionCardFinal from './QuestionCardFinal';
import StudyModeSelector from './StudyModeSelector';
import CelebrationModal from './CelebrationModal';
import StreakCounter from './StreakCounter';
import QuestionJustification from './QuestionJustification';
import SimuladoResults from './SimuladoResults';
import StudySession from './StudySession';
import PlaylistCreator from './PlaylistCreator';
import PlaylistManager from './PlaylistManager';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Scale, Target, Zap, Clock, Pause, Square, GraduationCap, List, Shuffle, Flag } from 'lucide-react';
import { getAreaColors } from '../utils/areaColors';

interface QuestionsSectionProps {
  selectedArea?: string;
  selectedExam?: string;
  selectedYear?: string;
  limit?: number;
  showFilters?: boolean;
  isSimulado?: boolean;
  isDailyChallenge?: boolean;
  onHideNavigation?: (hide: boolean) => void;
  randomizeQuestions?: boolean;
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
  randomizeQuestions = false
}: QuestionsSectionProps) => {
  const [questions, setQuestions] = useState<QuestionFinal[]>([]);
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
  const [showPlaylistCreator, setShowPlaylistCreator] = useState(false);
  const [showPlaylistManager, setShowPlaylistManager] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState<any>(null);
  const [showAreaStudySession, setShowAreaStudySession] = useState(false);
  const [showAreaResults, setShowAreaResults] = useState(false);
  const [areaStudyResults, setAreaStudyResults] = useState<any>(null);
  const questionCardRef = useRef<HTMLDivElement>(null);
  const areaColorScheme = selectedAreaFilter ? getAreaColors(selectedAreaFilter) : null;

  const scrollToTop = () => {
    const target = document.getElementById('questions-container') || document.body;
    
    try {
      target.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } catch (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    setTimeout(() => {
      try {
        target.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } catch (error) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
    
    requestAnimationFrame(() => {
      try {
        target.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } catch (error) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  useEffect(() => {
    fetchQuestions();
    fetchAreas();
    createStudySession();
    if (isSimulado || isDailyChallenge) {
      setSimuladoStartTime(Date.now());
      fetchPreviousAttempts();
    }
    
    if (onHideNavigation) {
      onHideNavigation(true);
    }
    
    return () => {
      if (onHideNavigation) {
        onHideNavigation(false);
      }
    };
  }, [selectedAreaFilter, selectedExam, selectedYear, limit, studyMode, onHideNavigation]);

  useEffect(() => {
    if (onHideNavigation) {
      onHideNavigation(true);
    }
    return () => {
      if (onHideNavigation) {
        onHideNavigation(false);
      }
    };
  }, [onHideNavigation]);

  useEffect(() => {
    if ((isSimulado || isDailyChallenge) && !isPaused && simuladoStartTime) {
      const timer = setInterval(() => {
        setSimuladoTime(Math.floor((Date.now() - simuladoStartTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSimulado, isDailyChallenge, isPaused, simuladoStartTime]);

  useEffect(() => {
    scrollToTop();
  }, [currentQuestionIndex]);

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
    const stats: Record<string, { correct: number; total: number; }> = {};
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
      let query = supabase.from('QUESTOES_FINAL').select('*');
      
      if (selectedAreaFilter) {
        query = query.eq('area', selectedAreaFilter);
      }
      if (selectedExam) {
        query = query.eq('aplicada_em', selectedExam);
      }

      if (isDailyChallenge) {
        query = query.not('resposta_correta', 'eq', 'ANULADA').limit(20);
      } else if (isSimulado && selectedExam) {
        query = query.order('numero_questao', { ascending: true });
      } else if (!selectedArea) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        let questionsData = data || [];
        
        const transformedQuestions = transformSupabaseToQuestionsFinal(questionsData);
        
        if (randomizeQuestions && !isSimulado && !isDailyChallenge) {
          transformedQuestions.sort(() => Math.random() - 0.5);
        }
        
        setQuestions(transformedQuestions);
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
        .from('QUESTOES_FINAL')
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
        setTimeout(() => scrollToTop(), 50);
      } else {
        finishSession();
      }
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeout(() => scrollToTop(), 50);
    } else {
      finishSession();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTimeout(() => scrollToTop(), 50);
    }
  };

  const pauseSimulado = () => {
    setIsPaused(true);
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
    const finalAreaStats = calculateAreaStats();
    setShowResults(true);
  };

  const finishSession = async () => {
    if (isSimulado || isDailyChallenge) {
      finishSimulado();
    } else {
      const totalTime = Math.floor((Date.now() - sessionStats.startTime) / 1000);
      await saveSessionProgress();
      setShowCelebration(true);
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
    return { answeredQuestions, correctAnswers, percentage };
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaylistStart = (playlist: any) => {
    console.log('Starting playlist:', playlist);
    setActivePlaylist(playlist);
    
    setSelectedAreaFilter(playlist.areas?.[0] || '');
    setStudyMode('all');
    
    const playlistLimit = playlist.question_count || 10;
    
    fetchQuestionsWithPlaylistFilters(playlist, playlistLimit);
  };

  const fetchQuestionsWithPlaylistFilters = async (playlist: any, playlistLimit: number) => {
    setLoading(true);
    try {
      let query = supabase.from('QUESTOES_FINAL').select('*');
      
      if (playlist.areas && playlist.areas.length > 0) {
        query = query.in('area', playlist.areas);
      }
      
      if (playlist.exams && playlist.exams.length > 0) {
        query = query.in('aplicada_em', playlist.exams);
      }

      query = query.limit(playlistLimit);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching playlist questions:', error);
      } else {
        const transformedQuestions = transformSupabaseToQuestionsFinal(data || []);
        
        setQuestions(transformedQuestions);
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

  const handleAreaStudyStart = () => {
    if (selectedArea) {
      setShowAreaStudySession(true);
    }
  };

  const handleAreaStudyComplete = () => {
    setShowAreaStudySession(false);
    setShowAreaResults(true);
    
    const results = {
      sessionStats,
      areaStats: calculateAreaStats(),
      totalTime: Math.floor((Date.now() - sessionStats.startTime) / 1000)
    };
    
    setAreaStudyResults(results);
    
    saveAreaStudySession(results);
  };

  const handleAreaStudyExit = () => {
    setShowAreaStudySession(false);
  };

  const handleAreaResultsClose = () => {
    setShowAreaResults(false);
    setAreaStudyResults(null);
    if (onHideNavigation) {
      onHideNavigation(false);
    }
  };

  const handleChooseNewArea = () => {
    setShowAreaResults(false);
    setAreaStudyResults(null);
    if (onHideNavigation) {
      onHideNavigation(false);
    }
    window.location.hash = '#areas';
  };

  const saveAreaStudySession = async (results: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_study_sessions')
        .insert({
          user_id: user.id,
          mode: 'area_study',
          area: selectedArea || null,
          questions_answered: results.sessionStats.total,
          correct_answers: results.sessionStats.correct,
          total_time: results.totalTime,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving area study session:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (showResults && (isSimulado || isDailyChallenge)) {
    return <SimuladoResults 
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
        if (onHideNavigation) {
          onHideNavigation(false);
        }
        window.location.reload();
      }} 
    />;
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
  const canFinish = stats.answeredQuestions > 0;

  if (showAreaStudySession && selectedArea && questions.length > 0) {
    return (
      <StudySession
        questions={questions}
        onExit={handleAreaStudyExit}
        onComplete={handleAreaStudyComplete}
        title={`Estudando: ${selectedArea}`}
        mode="area"
      />
    );
  }

  if (showResults && (isSimulado || isDailyChallenge || (selectedArea && randomizeQuestions))) {
    return (
      <SimuladoResults
        sessionStats={sessionStats}
        areaStats={areaStats}
        previousAttempts={selectedArea ? [] : previousAttempts}
        examInfo={{
          exame: selectedArea ? 'Estudo de Área' : selectedExam,
          ano: selectedArea ? selectedArea : selectedYear
        }}
        totalTime={selectedArea ? Math.floor((Date.now() - sessionStats.startTime) / 1000) : simuladoTime}
        onClose={() => {
          setShowResults(false);
          if (onHideNavigation) {
            onHideNavigation(false);
          }
          if (selectedArea) {
            window.location.hash = '#areas';
          } else {
            window.location.reload();
          }
        }}
        onChooseNewArea={selectedArea ? () => {
          setShowResults(false);
          if (onHideNavigation) {
            onHideNavigation(false);
          }
          window.location.hash = '#areas';
        } : undefined}
      />
    );
  }

  return (
    <div id="questions-container" className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-0 py-0 px-0">
      {(isSimulado || isDailyChallenge) && (
        <div className="flex justify-between items-center animate-fade-in">
          <Badge variant="outline" className="border-gray-600 text-gray-400 bg-gray-800/50 text-xs">
            <Clock size={12} className="mr-1" />
            {formatTime(simuladoTime)}
          </Badge>
          
          <div className="flex gap-2">
            {isPaused ? (
              <Button onClick={resumeSimulado} size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 transition-all duration-200 hover:scale-105">
                Retomar
              </Button>
            ) : (
              <Button onClick={pauseSimulado} size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs px-3 py-1 transition-all duration-200 hover:scale-105">
                <Pause size={12} className="mr-1" />
                Pausar
              </Button>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20 text-xs px-3 py-1 transition-all duration-200 hover:scale-105">
                  <Square size={12} className="mr-1" />
                  Encerrar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-netflix-card border-netflix-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Encerrar Simulado?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Tem certeza que deseja encerrar o simulado? Suas respostas serão salvas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={finishSimulado} className="bg-netflix-red hover:bg-red-700 text-white">
                    Sim, Encerrar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      {!isSimulado && !isDailyChallenge && (
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <StudyModeSelector 
                studyMode={studyMode} 
                setStudyMode={setStudyMode} 
                selectedAreaFilter={selectedAreaFilter} 
                setSelectedAreaFilter={setSelectedAreaFilter} 
                areas={areas} 
                onShuffle={shuffleQuestions} 
                onReset={resetSession} 
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setShowPlaylistCreator(true)}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-400 hover:bg-blue-900/20 flex items-center gap-2"
              >
                <List size={16} />
                Criar Playlist
              </Button>
              
              <Button
                onClick={() => setShowPlaylistManager(true)}
                variant="outline"
                size="sm"
                className="border-green-600 text-green-400 hover:bg-green-900/20 flex items-center gap-2"
              >
                <Shuffle size={16} />
                Playlists
              </Button>
            </div>
          </div>
          
          {activePlaylist && (
            <Card className="bg-blue-900/20 border-blue-600/30 p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-blue-300 font-medium">{activePlaylist.name}</h4>
                  <p className="text-blue-400/70 text-sm">{activePlaylist.description}</p>
                </div>
                <Button
                  onClick={() => setActivePlaylist(null)}
                  size="sm"
                  variant="ghost"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sair
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      <Card className={`bg-netflix-card border-netflix-border p-3 sm:p-4 transition-all duration-300 hover:shadow-lg animate-fade-in ${areaColorScheme ? `border-l-4 ${areaColorScheme.border}` : ''}`}>
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4 mb-3">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <Badge variant="outline" className={`border-gray-600 text-gray-300 text-sm sm:text-lg font-bold px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 hover:scale-105 ${areaColorScheme ? areaColorScheme.bg : 'bg-gray-800'}`}>
              Questão {currentQuestionIndex + 1} de {questions.length}
            </Badge>
            {selectedArea && randomizeQuestions && (
              <Badge variant="outline" className="border-green-600 text-green-300 bg-green-900/20 text-xs sm:text-sm">
                Aleatório: {questions.length} questões
              </Badge>
            )}
            <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800 text-xs sm:text-sm transition-all duration-200 hover:scale-105">
              Respondidas: {stats.answeredQuestions}
            </Badge>
            <Badge variant="outline" className={`border-gray-600 text-xs sm:text-sm transition-all duration-200 hover:scale-105 ${stats.percentage >= 70 ? 'text-green-400 bg-green-900/20' : 'text-gray-300 bg-gray-800'}`}>
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

        {canFinish && !isSimulado && !isDailyChallenge && selectedArea && (
          <div className="flex justify-center mb-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-200"
                  size="sm"
                >
                  <Flag size={16} />
                  Finalizar Estudo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-netflix-card border-netflix-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Finalizar Estudo?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Você respondeu {stats.answeredQuestions} de {questions.length} questões ({Math.round((stats.answeredQuestions / questions.length) * 100)}%).
                    <br />
                    <span className="text-green-400 font-medium">
                      Taxa de acerto: {stats.percentage}%
                    </span>
                    <br />
                    <span className="text-yellow-400 text-sm">
                      Você pode continuar estudando ou ver seus resultados agora.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                    Continuar Estudando
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={finishSession} 
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Ver Resultados
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </Card>

      <div ref={questionCardRef} className={`transition-all duration-500 animate-fade-in ${isQuestionAnnulled ? 'opacity-50 pointer-events-none' : ''}`}>
        <QuestionCardFinal 
          question={currentQuestion} 
          onAnswer={handleAnswer} 
          showQuestionNumber={true}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      </div>

      {isQuestionAnswered && !isQuestionAnnulled && currentQuestion?.justificativa && (
        <div className="flex justify-center animate-fade-in">
          <Button 
            onClick={handleShowJustification} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-200"
          >
            <GraduationCap size={20} />
            Ver Comentário
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center gap-4 animate-fade-in mt-4">
        <Button 
          onClick={previousQuestion} 
          disabled={currentQuestionIndex === 0} 
          variant="outline" 
          className={`border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 transition-all duration-200 hover:scale-105 ${areaColorScheme ? `${areaColorScheme.hover} ${areaColorScheme.border} border` : 'bg-gray-800'} text-sm px-4 py-3`}
        >
          Anterior
        </Button>
        
        <div className="text-center flex-1">
          <div className="text-gray-400 text-xs sm:text-sm mb-2">
            Progresso: {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${areaColorScheme ? areaColorScheme.primary : 'bg-netflix-red'}`} 
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
              }} 
            />
          </div>
        </div>
        
        <Button 
          onClick={nextQuestion} 
          disabled={!isQuestionAnnulled && currentQuestionIndex === questions.length - 1 && !answers[currentQuestion.id]} 
          className={`${areaColorScheme ? `${areaColorScheme.primary} ${areaColorScheme.hover}` : 'bg-netflix-red hover:bg-red-700'} text-white disabled:opacity-50 transition-all duration-200 hover:scale-105 text-sm px-4 py-3`}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
        </Button>
      </div>

      <QuestionJustification 
        justification={currentJustification} 
        isVisible={showJustification} 
        onClose={() => setShowJustification(false)} 
      />

      <CelebrationModal 
        isVisible={showCelebration} 
        onClose={() => setShowCelebration(false)} 
        streak={streak} 
        percentage={stats.percentage} 
        questionsAnswered={stats.answeredQuestions} 
      />

      <PlaylistCreator
        isVisible={showPlaylistCreator}
        onClose={() => setShowPlaylistCreator(false)}
        areas={areas}
      />

      <PlaylistManager
        isVisible={showPlaylistManager}
        onClose={() => setShowPlaylistManager(false)}
        onPlaylistStart={handlePlaylistStart}
      />
    </div>
  );
};

export default QuestionsSection;
