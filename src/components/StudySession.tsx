
import { useState, useEffect } from 'react';
import MinimalQuestionCard from './MinimalQuestionCard';
import ProgressBar from './ProgressBar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Star, Trophy, CheckCircle, Flag } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  onComplete: (results: any) => void;
  title?: string;
  mode?: 'practice' | 'favorites' | 'review' | 'area';
}

const StudySession = ({ 
  questions, 
  onExit, 
  onComplete,
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

  const scrollToTop = () => {
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

    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleComplete = () => {
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    
    // Calcular estatísticas por área
    const areaStats: Record<string, { correct: number; total: number; }> = {};
    
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        if (!areaStats[question.area]) {
          areaStats[question.area] = { correct: 0, total: 0 };
        }
        areaStats[question.area].total++;
        if (answer.correct) {
          areaStats[question.area].correct++;
        }
      }
    });

    const areaStatsArray = Object.entries(areaStats).map(([area, data]) => ({
      area,
      correct: data.correct,
      total: data.total,
      percentage: Math.round((data.correct / data.total) * 100)
    }));

    const results = {
      sessionStats: {
        correct: correctCount,
        total: answeredCount,
        startTime: sessionStartTime
      },
      areaStats: areaStatsArray,
      totalTime: totalTimeSpent,
      accuracy,
      finalStreak: streak
    };

    onComplete(results);
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

  const getModeIcon = () => {
    switch (mode) {
      case 'favorites':
        return <Star className="text-yellow-500" size={20} />;
      case 'review':
        return <RotateCcw className="text-blue-500" size={20} />;
      case 'area':
        return <Trophy className="text-green-500" size={20} />;
      default:
        return null;
    }
  };

  const allQuestionsAnswered = answeredCount === questions.length;
  const canFinish = answeredCount > 0;

  return (
    <div id="study-session-container" className="min-h-screen bg-netflix-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onExit}
            className="text-netflix-text-secondary hover:text-white transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-2">
            {getModeIcon()}
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
          
          <div className="text-netflix-text-secondary text-sm">
            {currentIndex + 1} de {questions.length}
          </div>
        </div>

        {/* Enhanced Progress with Finish Option */}
        <div className="mb-6">
          <ProgressBar
            current={answeredCount}
            total={questions.length}
            correct={correctCount}
            timeSpent={totalTimeSpent}
            streak={streak}
          />
          
          {/* Finish Button - Always available when there are answered questions */}
          {canFinish && (
            <div className="mt-4 text-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 transition-all duration-200 mx-auto"
                  >
                    <Flag size={20} />
                    Finalizar e Ver Resultados
                    {allQuestionsAnswered && (
                      <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Completo!
                      </span>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-netflix-card border-netflix-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white flex items-center gap-2">
                      <Trophy className="text-green-500" size={24} />
                      {allQuestionsAnswered ? 'Sessão Completa!' : 'Finalizar Sessão?'}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      {allQuestionsAnswered ? (
                        <>
                          Parabéns! Você respondeu todas as {questions.length} questões desta área.
                          <br />
                          <span className="text-green-400 font-medium">
                            Taxa de acerto: {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
                          </span>
                        </>
                      ) : (
                        <>
                          Você respondeu {answeredCount} de {questions.length} questões ({Math.round((answeredCount / questions.length) * 100)}%).
                          <br />
                          <span className="text-green-400 font-medium">
                            Taxa de acerto atual: {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
                          </span>
                          <br />
                          <span className="text-yellow-400 text-sm">
                            Você pode continuar estudando ou ver seus resultados agora.
                          </span>
                        </>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                      {allQuestionsAnswered ? 'Revisar' : 'Continuar Estudando'}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleComplete} 
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Ver Resultados
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

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

        {/* Enhanced Navigation */}
        <div className="flex justify-between items-center gap-4">
          <Button 
            onClick={handlePrevious} 
            disabled={currentIndex === 0} 
            variant="outline" 
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-all duration-200 hover:scale-105 px-6 py-3"
          >
            ← Anterior
          </Button>
          
          <div className="text-center flex-1">
            <div className="text-gray-400 text-sm mb-2">
              Progresso: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-netflix-red to-red-600" 
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`
                }} 
              />
            </div>
          </div>
          
          <Button 
            onClick={handleNext} 
            disabled={currentIndex === questions.length - 1} 
            className="bg-netflix-red hover:bg-red-700 text-white disabled:opacity-50 transition-all duration-200 hover:scale-105 px-6 py-3"
          >
            Próxima →
          </Button>
        </div>

        {/* Motivational Messages */}
        {streak >= 5 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-600/30 rounded-lg text-center animate-pulse">
            <span className="text-green-400 font-bold">🔥 Sequência incrível de {streak} acertos! Continue assim!</span>
          </div>
        )}
        
        {answeredCount > 0 && answeredCount % 10 === 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-600/30 rounded-lg text-center">
            <span className="text-blue-400 font-bold">🎯 Parabéns! Você já respondeu {answeredCount} questões!</span>
          </div>
        )}

        {/* Progress Motivation */}
        {answeredCount > 0 && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              {answeredCount < questions.length ? (
                <>Restam {questions.length - answeredCount} questões • Continue focado! 💪</>
              ) : (
                <>🎉 Todas as questões respondidas! Clique em "Finalizar" para ver seus resultados.</>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySession;
