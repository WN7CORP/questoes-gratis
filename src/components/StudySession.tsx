import { useState, useEffect } from 'react';
import MinimalQuestionCard from './MinimalQuestionCard';
import ProgressBar from './ProgressBar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Star, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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

interface StudySessionProps {
  questions: Question[];
  onExit: () => void;
  title?: string;
  mode?: 'practice' | 'favorites' | 'review';
}

const StudySession = ({ 
  questions, 
  onExit, 
  title = "Sessão de Estudo",
  mode = 'practice'
}: StudySessionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string; correct: boolean; timeSpent: number }>>({});
  const [sessionStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(a => a.correct).length;
  const totalTimeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  // Função aprimorada para scroll suave
  const scrollToTop = () => {
    try {
      // Tentar encontrar o container da sessão ou usar o body
      const container = document.getElementById('study-session-container') || document.body;
      
      container.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } catch (error) {
      // Fallback para navegadores antigos
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Garantir que funcione após mudança de questão
    setTimeout(() => {
      try {
        const container = document.getElementById('study-session-container') || document.body;
        container.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } catch (error) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAnswer = (questionId: number, selectedAnswer: string, isCorrect: boolean) => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer: selectedAnswer,
        correct: isCorrect,
        timeSpent
      }
    }));

    // Update streak
    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Auto-advance after 2 seconds with improved scroll
    setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentIndex(prev => prev + 1);
        // Scroll suave após mudança de questão
        setTimeout(() => scrollToTop(), 50);
      } else {
        handleSessionComplete();
      }
    }, 2000);
  };

  const handleSessionComplete = () => {
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    
    toast({
      title: "Sessão Concluída!",
      description: `Você acertou ${correctCount} de ${answeredCount} questões (${accuracy}%)`,
    });

    saveSessionStats();
    
    // Para sessões de área, mostrar opção de continuar ou finalizar
    if (mode === 'practice') {
      setTimeout(() => {
        onExit();
      }, 2000);
    }
  };

  const saveSessionStats = async () => {
    // This would integrate with Supabase to save session statistics
    console.log('Session stats:', {
      mode,
      totalQuestions: questions.length,
      answeredCount,
      correctCount,
      totalTimeSpent,
      accuracy: answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0,
      finalStreak: streak
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => scrollToTop(), 50);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => scrollToTop(), 50);
    }
  };

  const handleForceFinish = () => {
    handleSessionComplete();
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'favorites':
        return <Star className="text-yellow-500" size={20} />;
      case 'review':
        return <RotateCcw className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div id="study-session-container" className="min-h-screen bg-netflix-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onExit}
            className="text-netflix-text-secondary hover:text-white"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-2">
            {getModeIcon()}
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-netflix-text-secondary text-sm">
              Questão {currentIndex + 1} de {questions.length}
            </div>
            
            {/* Botão para finalizar antecipadamente */}
            {answeredCount > 5 && (
              <Button
                onClick={handleForceFinish}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Finalizar
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar with Achievements */}
        <ProgressBar
          current={answeredCount}
          total={questions.length}
          correct={correctCount}
          timeSpent={totalTimeSpent}
          streak={streak}
        />

        {/* Question Card */}
        {currentQuestion && (
          <div className="mb-6">
            <MinimalQuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              isAnswered={!!answers[currentQuestion.id]}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="border-netflix-border text-gray-300 hover:bg-gray-800"
          >
            Anterior
          </Button>

          <div className="text-center">
            <div className="text-netflix-text-secondary text-sm">
              Progresso: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </div>
            <div className="text-netflix-text-secondary text-xs mt-1">
              {correctCount} acertos de {answeredCount} respondidas
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={isLastQuestion}
            className="border-netflix-border text-gray-300 hover:bg-gray-800"
          >
            {isLastQuestion ? 'Finalizar' : 'Próxima'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudySession;
