import React, { useState, useEffect, useCallback } from 'react';
import { QuestionFinal, QuestionFilters } from '@/types/questionFinal';
import { transformSupabaseToQuestionsFinal } from '@/utils/questionFinalTransform';
import { supabase } from "@/integrations/supabase/client";
import QuestionCardFinal from './QuestionCardFinal';
import ProgressBar from './ProgressBar';
import QuestionJustification from './QuestionJustification';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, RotateCcw, MessageSquare } from 'lucide-react';
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

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Scroll to top when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase.from('QUESTOES_FINAL').select('*').not('enunciado', 'is', null).not('A', 'is', null).not('B', 'is', null).not('C', 'is', null).not('resposta_correta', 'is', null);

      // Apply filters
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

  const handleAnswer = useCallback((questionId: number, selectedAnswer: string, isCorrect: boolean) => {
    if (answeredQuestions.has(questionId)) return;
    
    console.log('Handling answer for question:', questionId, 'Answer:', selectedAnswer, 'Correct:', isCorrect);
    setAnsweredQuestions(prev => new Set(prev).add(questionId));
    setSessionStats(prev => ({
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct
    }));
  }, [answeredQuestions]);

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
    setSessionStats({
      correct: 0,
      total: 0
    });
    setAnsweredQuestions(new Set());
    setShowJustification(false);
    fetchQuestions();
  };

  const handleShowJustification = () => {
    setShowJustification(true);
  };

  const isCurrentQuestionAnswered = () => {
    return answeredQuestions.has(questions[currentQuestionIndex]?.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-netflix-red" />
        <span className="text-white">Carregando questões...</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="text-white text-xl mb-4">
          Nenhuma questão encontrada com os filtros aplicados
        </div>
        <Button onClick={onExit} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar aos filtros
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="h-full flex flex-col">
      {/* Header with Back Button */}
      <div className="bg-netflix-card border-b border-netflix-border p-4 flex items-center justify-between">
        <Button
          onClick={onExit}
          variant="ghost"
          className="text-white hover:text-netflix-red"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="text-white font-semibold">
          Questão {currentQuestionIndex + 1} de {questions.length}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto p-4">
          {/* Progress Bar */}
          <ProgressBar
            current={sessionStats.total}
            total={questions.length}
            correct={sessionStats.correct}
            timeSpent={timeSpent}
            showStats={true}
            streak={0}
          />

          {/* Question Card */}
          <div className="mb-6">
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
          <div className="flex justify-between items-center mb-20">
            <Button 
              onClick={goToPreviousQuestion} 
              disabled={currentQuestionIndex === 0} 
              variant="outline" 
              className="w-24 sm:w-32"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            <Button 
              onClick={goToNextQuestion} 
              disabled={isLastQuestion} 
              variant="outline" 
              className="w-24 sm:w-32"
            >
              Próxima
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Blue Comment Button - Fixed position at bottom */}
      {isCurrentQuestionAnswered() && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <Button
            onClick={handleShowJustification}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
          >
            <MessageSquare size={18} />
            Ver Comentário
          </Button>
        </div>
      )}

      {/* Question Justification */}
      <QuestionJustification 
        justification={currentQuestion?.justificativa || ''}
        isVisible={showJustification}
        onClose={() => setShowJustification(false)}
      />
    </div>
  );
};

export default StudySessionFinal;
