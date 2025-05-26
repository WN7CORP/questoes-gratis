import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import QuestionCard from './QuestionCard';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter, Shuffle, Target, Timer, Heart, TrendingUp, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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
  const [answers, setAnswers] = useState<Record<number, {
    answer: string;
    correct: boolean;
    timestamp: number;
  }>>({});
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>(selectedArea || '');
  const [mode, setMode] = useState<'practice' | 'simulation' | 'review'>('practice');
  const [studyMode, setStudyMode] = useState<'all' | 'favorites' | 'wrong' | 'unanswered'>('all');
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    startTime: Date.now()
  });
  const {
    toast
  } = useToast();
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
      const {
        data,
        error
      } = await query;
      if (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as questões",
          variant: "destructive"
        });
      } else {
        setQuestions(data || []);
        // Reset answers when new questions are loaded
        setAnswers({});
        setCurrentQuestionIndex(0);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAreas = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('Questoes_Comentadas').select('area').not('area', 'is', null);
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
    toast({
      title: "Sessão finalizada!",
      description: `Você acertou ${sessionStats.correct} de ${sessionStats.total} questões (${Math.round(sessionStats.correct / sessionStats.total * 100)}%)`
    });
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
  };
  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSessionStats({
      correct: 0,
      total: 0,
      startTime: Date.now()
    });
  };
  const getStats = () => {
    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = Object.values(answers).filter(a => a.correct).length;
    const percentage = answeredQuestions > 0 ? Math.round(correctAnswers / answeredQuestions * 100) : 0;
    return {
      answeredQuestions,
      correctAnswers,
      percentage
    };
  };
  if (loading) {
    return <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Carregando questões...</div>
      </div>;
  }
  if (questions.length === 0) {
    return <Card className="bg-gray-900 border-gray-700 p-8 text-center">
        <BookOpen className="mx-auto mb-4 text-gray-500" size={48} />
        <h3 className="text-white text-xl font-semibold mb-2">Nenhuma questão encontrada</h3>
        <p className="text-gray-400">
          Não há questões disponíveis para os filtros selecionados.
        </p>
      </Card>;
  }
  const stats = getStats();
  const currentQuestion = questions[currentQuestionIndex];
  return <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 px-0 py-0">
      {/* Study Mode Selector */}
      <Card className="bg-gray-900 border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h3 className="text-white font-medium">Modo de Estudo:</h3>
          <div className="flex flex-wrap gap-2">
            {[{
            key: 'all',
            label: 'Todas',
            icon: BookOpen
          }, {
            key: 'favorites',
            label: 'Favoritas',
            icon: Heart
          }, {
            key: 'wrong',
            label: 'Erradas',
            icon: RotateCcw
          }].map(({
            key,
            label,
            icon: Icon
          }) => <Button key={key} variant={studyMode === key ? "default" : "outline"} size="sm" onClick={() => setStudyMode(key as any)} className={`${studyMode === key ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800'}`}>
                <Icon size={16} className="mr-1" />
                {label}
              </Button>)}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-white font-medium">Filtros:</span>
          </div>
          
          <select value={selectedAreaFilter} onChange={e => setSelectedAreaFilter(e.target.value)} className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm">
            <option value="">Todas as áreas</option>
            {areas.map(area => <option key={area} value={area}>{area}</option>)}
          </select>

          <div className="flex gap-2">
            <Button onClick={shuffleQuestions} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800">
              <Shuffle size={16} className="mr-1" />
              Embaralhar
            </Button>

            <Button onClick={resetSession} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800">
              <RotateCcw size={16} className="mr-1" />
              Reiniciar
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card className="bg-gray-900 border-gray-700 p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800">
              Respondidas: {stats.answeredQuestions}
            </Badge>
            <Badge variant="outline" className={`border-gray-600 ${stats.percentage >= 70 ? 'text-green-400 bg-green-900/20' : 'text-gray-300 bg-gray-800'}`}>
              <Target size={14} className="mr-1" />
              Acertos: {stats.percentage}%
            </Badge>
          </div>
          
          {mode === 'simulation' && <Badge variant="outline" className="border-orange-600 text-orange-300 bg-orange-900/20">
              <Timer size={14} className="mr-1" />
              Modo Simulado
            </Badge>}
        </div>
      </Card>

      {/* Question */}
      <QuestionCard question={currentQuestion} onAnswer={handleAnswer} mode={mode} timeLimit={mode === 'simulation' ? 300 : undefined} isAnswered={!!answers[currentQuestion.id]} />

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4">
        <Button onClick={previousQuestion} disabled={currentQuestionIndex === 0} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 bg-gray-800">
          Anterior
        </Button>
        
        <div className="text-center">
          <div className="text-gray-400 text-sm">
            Progresso: {Math.round((currentQuestionIndex + 1) / questions.length * 100)}%
          </div>
          <div className="w-32 sm:w-48 bg-gray-800 rounded-full h-2 mt-1">
            <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{
            width: `${(currentQuestionIndex + 1) / questions.length * 100}%`
          }}></div>
          </div>
        </div>
        
        <Button onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1} className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50">
          {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
        </Button>
      </div>
    </div>;
};
export default QuestionsSection;