
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import QuestionCard from './QuestionCard';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter, Shuffle, Target } from 'lucide-react';

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

const QuestionsSection = ({ selectedArea, limit = 10, showFilters = true }: QuestionsSectionProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string; correct: boolean }>>({});
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>(selectedArea || '');

  useEffect(() => {
    fetchQuestions();
    fetchAreas();
  }, [selectedAreaFilter, limit]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('Questoes_Comentadas')
        .select('*')
        .limit(limit);

      if (selectedAreaFilter) {
        query = query.eq('area', selectedAreaFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        setQuestions(data || []);
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
      [questionId]: { answer: selectedAnswer, correct: isCorrect }
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const shuffleQuestions = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setAnswers({});
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
        <div className="text-netflix-text-secondary">Carregando questões...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="bg-netflix-card border-netflix-border p-8 text-center">
        <BookOpen className="mx-auto mb-4 text-netflix-text-secondary" size={48} />
        <h3 className="text-white text-xl font-semibold mb-2">Nenhuma questão encontrada</h3>
        <p className="text-netflix-text-secondary">
          Não há questões disponíveis para os filtros selecionados.
        </p>
      </Card>
    );
  }

  const stats = getStats();
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card className="bg-netflix-card border-netflix-border p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-netflix-text-secondary" />
              <span className="text-white font-medium">Filtros:</span>
            </div>
            
            <select
              value={selectedAreaFilter}
              onChange={(e) => setSelectedAreaFilter(e.target.value)}
              className="bg-netflix-black border border-netflix-border rounded px-3 py-1 text-white"
            >
              <option value="">Todas as áreas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>

            <Button
              onClick={shuffleQuestions}
              variant="outline"
              size="sm"
              className="border-netflix-border text-netflix-text-secondary hover:bg-netflix-red hover:text-white"
            >
              <Shuffle size={16} className="mr-1" />
              Embaralhar
            </Button>
          </div>
        </Card>
      )}

      {/* Stats */}
      <Card className="bg-netflix-card border-netflix-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-netflix-border text-netflix-text-secondary">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </Badge>
            <Badge variant="outline" className="border-netflix-border text-netflix-text-secondary">
              Respondidas: {stats.answeredQuestions}
            </Badge>
            <Badge 
              variant="outline" 
              className={`border-netflix-border ${stats.percentage >= 70 ? 'text-green-400' : 'text-netflix-text-secondary'}`}
            >
              <Target size={14} className="mr-1" />
              Acertos: {stats.percentage}%
            </Badge>
          </div>
        </div>
      </Card>

      {/* Question */}
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="border-netflix-border text-netflix-text-secondary hover:bg-netflix-card"
        >
          Anterior
        </Button>
        
        <Button
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="bg-netflix-red hover:bg-red-700 text-white"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export default QuestionsSection;
