
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import MinimalQuestionCard from './MinimalQuestionCard';
import StudyModeSelector from './StudyModeSelector';
import CelebrationModal from './CelebrationModal';
import StreakCounter from './StreakCounter';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Zap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getAreaColors } from '../utils/areaColors';

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

interface QuestionsSectionProps {
  selectedArea?: string;
  limit?: number;
  showFilters?: boolean;
}

const QuestionsSection = ({
  selectedArea,
  limit = 10,
  showFilters = true
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
  const { toast } = useToast();

  const areaColorScheme = selectedAreaFilter ? getAreaColors(selectedAreaFilter) : null;

  useEffect(() => {
    fetchQuestions();
    fetchAreas();
  }, [selectedAreaFilter, limit, studyMode]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase.from('Questoes_Comentadas').select('*');
      
      if (selectedAreaFilter) {
        query = query.eq('area', selectedAreaFilter);
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

  const handleAnswer = (questionId: number, selectedAnswer: string, isCorrect: boolean) => {
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

    // Update streak
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

  const finishSession = async () => {
    const totalTime = Math.floor((Date.now() - sessionStats.startTime) / 1000);
    const percentage = Math.round((sessionStats.correct / sessionStats.total) * 100);
    
    setShowCelebration(true);
    
    toast({
      title: "Sessão finalizada!",
      description: `Você acertou ${sessionStats.correct} de ${sessionStats.total} questões (${percentage}%)`
    });
  };

  const shuffleQuestions = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSessionStats({ correct: 0, total: 0, startTime: Date.now() });
    setStreak(0);
  };

  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSessionStats({ correct: 0, total: 0, startTime: Date.now() });
    setStreak(0);
  };

  const getStats = () => {
    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = Object.values(answers).filter(a => a.correct).length;
    const percentage = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;
    return { answeredQuestions, correctAnswers, percentage };
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
        <BookOpen className="mx-auto mb-4 text-gray-500" size={48} />
        <h3 className="text-white text-xl font-semibold mb-2">Nenhuma questão encontrada</h3>
        <p className="text-gray-400">
          Não há questões disponíveis para os filtros selecionados.
        </p>
      </Card>
    );
  }

  const stats = getStats();
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6 p-4 sm:p-0 px-0 py-0">
      {/* Study Mode Selector */}
      <StudyModeSelector
        studyMode={studyMode}
        setStudyMode={setStudyMode}
        selectedAreaFilter={selectedAreaFilter}
        setSelectedAreaFilter={setSelectedAreaFilter}
        areas={areas}
        onShuffle={shuffleQuestions}
        onReset={resetSession}
      />

      {/* Enhanced Stats with area colors and streak */}
      <Card className={`bg-netflix-card border-netflix-border p-4 ${areaColorScheme ? `border-l-4 ${areaColorScheme.border}` : ''}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className={`border-gray-600 text-gray-300 ${areaColorScheme ? areaColorScheme.bg : 'bg-gray-800'}`}>
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
          </div>
          
          {/* Streak Counter */}
          <StreakCounter streak={streak} showAnimation={showStreakAnimation} />
        </div>
      </Card>

      {/* Question */}
      <MinimalQuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        isAnswered={!!answers[currentQuestion.id]}
      />

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
          disabled={currentQuestionIndex === questions.length - 1}
          className={`${areaColorScheme ? `${areaColorScheme.primary} ${areaColorScheme.hover}` : 'bg-netflix-red hover:bg-red-700'} text-white disabled:opacity-50 transition-all duration-200`}
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
