
import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/question';
import { supabase } from '@/integrations/supabase/client';
import QuestionCard from './QuestionCard';
import Options from './Options';
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import { useConfettiStore } from '@/stores/confettiStore';
import CelebrationModal from './CelebrationModal';

interface AreaStats {
  area: string;
  correct: number;
  total: number;
}

interface SessionStats {
  correct: number;
  total: number;
  startTime: number;
}

interface StudySessionProps {
  selectedArea?: string;
  questions?: Question[];
  onComplete: () => void;
  onChooseNewArea?: () => void;
  onExit?: () => void;
  title?: string;
  mode?: string;
}

const StudySession = ({ 
  selectedArea, 
  questions: providedQuestions, 
  onComplete, 
  onChooseNewArea,
  onExit,
  title,
  mode 
}: StudySessionProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [areaStats, setAreaStats] = useState<AreaStats[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats>({ correct: 0, total: 0, startTime: Date.now() });
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);
  const confetti = useConfettiStore()

  useEffect(() => {
    if (providedQuestions && providedQuestions.length > 0) {
      setQuestions(providedQuestions);
      setLoading(false);
    } else if (selectedArea) {
      fetchQuestions();
    }
  }, [selectedArea, providedQuestions]);

  const fetchQuestions = async () => {
    if (!selectedArea) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
        .select('*')
        .eq('area', selectedArea)
        .limit(10);

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        // Transform data to match Question interface
        const transformedData = data?.map(item => ({
          ...item,
          resposta: item.resposta_correta,
          opcoes: [item.alternativa_a, item.alternativa_b, item.alternativa_c, item.alternativa_d]
        })) || [];
        
        // Randomize questions
        const shuffledQuestions = transformedData.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = useCallback(() => {
    if (selectedOption === null) {
      alert('Por favor, selecione uma opção antes de confirmar.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = selectedOption === currentQuestion.resposta_correta;
    setIsCorrect(isAnswerCorrect);

    setSessionStats(prevStats => ({
      ...prevStats,
      total: prevStats.total + 1,
      correct: isAnswerCorrect ? prevStats.correct + 1 : prevStats.correct
    }));

    setAreaStats(prevStats => {
      const areaIndex = prevStats.findIndex(stat => stat.area === (selectedArea || currentQuestion.area));
      const area = selectedArea || currentQuestion.area;
      if (areaIndex === -1) {
        return [...prevStats, { area, correct: isAnswerCorrect ? 1 : 0, total: 1 }];
      } else {
        const updatedAreaStats = [...prevStats];
        updatedAreaStats[areaIndex] = {
          ...updatedAreaStats[areaIndex],
          correct: updatedAreaStats[areaIndex].correct + (isAnswerCorrect ? 1 : 0),
          total: updatedAreaStats[areaIndex].total + 1
        };
        return updatedAreaStats;
      }
    });

    if (isAnswerCorrect) {
      setStreak(prevStreak => prevStreak + 1);
      if (streak >= 2) {
        confetti.pop()
      }
    } else {
      setStreak(0);
    }

    if (isAnswerCorrect) {
      setShowCelebration(true);
    } else {
      setTimeout(() => {
        goToNextQuestion();
      }, 1500);
    }
  }, [selectedOption, questions, currentQuestionIndex, selectedArea, confetti, streak]);

  const goToNextQuestion = () => {
    setIsCorrect(null);
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleGoToNext = () => {
    goToNextQuestion();
  };

  const restartSession = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setAreaStats([]);
    setSessionStats({ correct: 0, total: 0, startTime: Date.now() });
    setStreak(0);
    if (selectedArea && !providedQuestions) {
      fetchQuestions();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando...
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="flex items-center justify-center h-full text-white">Nenhuma questão encontrada para esta área.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const percentageCorrect = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header with title and exit button */}
      {(title || onExit) && (
        <div className="flex justify-between items-center mb-4 p-4 bg-netflix-card rounded-lg">
          {title && <h2 className="text-white text-xl font-semibold">{title}</h2>}
          {onExit && (
            <Button onClick={onExit} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Sair
            </Button>
          )}
        </div>
      )}

      {/* Question Card */}
      <div className="mb-4">
        <QuestionCard
          question={currentQuestion}
          totalQuestions={questions.length}
        />
      </div>

      {/* Options */}
      <div className="flex-grow">
        <Options
          options={currentQuestion.opcoes}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
          isCorrect={isCorrect}
          correctAnswer={currentQuestion.resposta_correta}
        />
      </div>

      {/* Submit Button */}
      {isCorrect === null && (
        <Button onClick={handleSubmit} className="w-full mt-4">
          Confirmar
        </Button>
      )}

      {/* Navigation Buttons */}
      {isCorrect !== null && (
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={restartSession}
            className="w-1/2 mr-2"
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Reiniciar
          </Button>
          <Button
            onClick={handleGoToNext}
            className="w-1/2 ml-2"
          >
            Próxima
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isVisible={showCelebration}
        onClose={() => {
          setShowCelebration(false);
          if (sessionStats.total >= 10) {
            onComplete();
          }
        }}
        onChooseNewArea={onChooseNewArea}
        isAreaStudy={true}
        streak={streak}
        percentage={sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}
        questionsAnswered={sessionStats.total}
      />
    </div>
  );
};

export default StudySession;
