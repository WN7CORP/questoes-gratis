import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuestionFinal, QuestionFilters } from '@/types/questionFinal';
import { transformSupabaseToQuestionsFinal } from '@/utils/questionFinalTransform';
import { supabase } from "@/integrations/supabase/client";
import QuestionCardFinal from './QuestionCardFinal';
import ProgressBar from './ProgressBar';
import QuestionJustification from './QuestionJustification';
import SessionResults from './SessionResults';
import EnhancedUserStats from './EnhancedUserStats';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Flag } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface StudySessionFinalProps {
  filters: QuestionFilters;
  onExit: () => void;
}

const StudySessionFinal = ({
  filters,
  onExit
}: StudySessionFinalProps) => {
  const [questions, setQuestions] = useState<QuestionFinal[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0
  });
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [timeSpent, setTimeSpent] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [showJustification, setShowJustification] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [currentQuestionIndex]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('QUESTOES_FINAL')
        .select('*')
        .not('enunciado', 'is', null)
        .not('A', 'is', null)
        .not('B', 'is', null)
        .not('C', 'is', null)
        .not('resposta_correta', 'is', null);

      if (filters.area) {
        query = query.eq('area', filters.area);
      }
      if (filters.tema) {
        query = query.eq('tema', filters.tema);
      }
      if (filters.assunto) {
        query = query.eq('assunto', filters.assunto);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        const transformedQuestions = transformSupabaseToQuestionsFinal(data || []);
        const shuffledQuestions = transformedQuestions.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveQuestionProgress = async (questionId: number, selectedAnswer: string, isCorrect: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentQuestion = questions.find(q => q.id === questionId);

      const { error } = await supabase
        .from('progresso_questos1')
        .insert({
          user_id: user.id,
          question_id: questionId,
          area: currentQuestion?.area,
          tema: currentQuestion?.tema,
          assunto: currentQuestion?.assunto,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
          time_spent: Math.floor((Date.now() - sessionStartTime) / 1000),
          session_id: `study_session_${sessionStartTime}`
        });

      if (error) {
        console.error('Error saving question progress:', error);
      } else {
        console.log('Question progress saved successfully');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleAnswer = useCallback(async (questionId: number, selectedAnswer: string, isCorrect: boolean) => {
    if (answeredQuestions.has(questionId)) return;

    console.log('Handling answer for question:', questionId, 'Answer:', selectedAnswer, 'Correct:', isCorrect);
    
    setAnsweredQuestions(prev => new Set(prev).add(questionId));
    setSessionStats(prev => ({
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct
    }));

    await saveQuestionProgress(questionId, selectedAnswer, isCorrect);
  }, [answeredQuestions, sessionStartTime, questions]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowJustification(false);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowJustification(false);
    }
  };

  const restartSession = () => {
    setCurrentQuestionIndex(0);
    setSessionStats({ correct: 0, total: 0 });
    setAnsweredQuestions(new Set());
    setShowJustification(false);
    setShowResults(false);
    fetchQuestions();
  };

  const finishSession = () => {
    setShowResults(true);
  };

  const handleShowJustification = () => {
    setShowJustification(true);
  };

  const isCurrentQuestionAnswered = () => {
    return answeredQuestions.has(questions[currentQuestionIndex]?.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-4" />
          <span className="text-white text-lg">Carregando questões...</span>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-900">
        <div className="text-white text-xl mb-6">
          Nenhuma questão encontrada com os filtros aplicados
        </div>
        <Button onClick={onExit} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar aos filtros
        </Button>
      </div>
    );
  }

  if (showResults) {
    return (
      <SessionResults 
        sessionStats={{
          ...sessionStats,
          timeSpent,
          area: filters.area,
          tema: filters.tema,
          assunto: filters.assunto
        }} 
        onRestart={restartSession} 
        onHome={onExit} 
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 sm:p-4 flex items-center justify-between shadow-lg">
        <Button 
          onClick={onExit} 
          variant="ghost" 
          size="sm"
          className="text-white hover:text-blue-400 hover:bg-gray-700 transition-all duration-200"
        >
          <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Voltar</span>
        </Button>
        
        <div className="text-white font-semibold text-sm sm:text-lg">
          Questão {currentQuestionIndex + 1} de {questions.length}
        </div>
        
        <Button 
          onClick={finishSession} 
          variant="outline" 
          size="sm"
          className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
        >
          <Flag className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Finalizar</span>
        </Button>
      </div>

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="max-w-6xl mx-auto p-3 sm:p-6">
          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <ProgressBar 
              current={sessionStats.total} 
              total={questions.length} 
              correct={sessionStats.correct} 
              timeSpent={timeSpent} 
              showStats={true}
              streak={0}
            />
          </div>

          {/* User Stats */}
          <div className="mb-4 sm:mb-6">
            <EnhancedUserStats />
          </div>

          {/* Question Card */}
          <div className="mb-6 sm:mb-8">
            <QuestionCardFinal 
              question={currentQuestion} 
              onAnswer={handleAnswer}
              showQuestionNumber={true}
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onShowJustification={handleShowJustification}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mb-16 sm:mb-24">
            <Button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              size="sm"
              className="w-24 sm:w-32 h-10 sm:h-12 text-sm sm:text-base font-medium hover:scale-105 transition-transform duration-200 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
              Anterior
            </Button>

            <Button
              onClick={goToNextQuestion}
              disabled={isLastQuestion}
              variant="outline"
              size="sm"
              className="w-24 sm:w-32 h-10 sm:h-12 text-sm sm:text-base font-medium hover:scale-105 transition-transform duration-200 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Próxima
              <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Modals */}
      <QuestionJustification 
        justification={currentQuestion?.justificativa || ''} 
        isVisible={showJustification} 
        onClose={() => setShowJustification(false)} 
      />
    </div>
  );
};

export default StudySessionFinal;
