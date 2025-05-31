
import React, { useState, useEffect, useCallback } from 'react';
import { QuestionFinal, QuestionFilters } from '@/types/questionFinal';
import { transformSupabaseToQuestionsFinal } from '@/utils/questionFinalTransform';
import { supabase } from '@/integrations/supabase/client';
import QuestionCardFinal from './QuestionCardFinal';
import ProgressBar from './ProgressBar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, RotateCcw } from 'lucide-react';

interface StudySessionFinalProps {
  filters: QuestionFilters;
  onExit: () => void;
  maxQuestions?: number;
}

const StudySessionFinal = ({
  filters,
  onExit,
  maxQuestions = 10
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

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

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
      if (filters.aplicadaEm) {
        query = query.eq('aplicada_em', filters.aplicadaEm);
      }
      if (filters.numAlternativas) {
        if (filters.numAlternativas === '4') {
          query = query.is('E', null);
        } else if (filters.numAlternativas === '5') {
          query = query.not('E', 'is', null);
        }
      }

      const { data, error } = await query.limit(maxQuestions * 2);

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        const transformedQuestions = transformSupabaseToQuestionsFinal(data || []);
        const shuffledQuestions = transformedQuestions.sort(() => Math.random() - 0.5).slice(0, maxQuestions);
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
    
    setAnsweredQuestions(prev => new Set(prev).add(questionId));
    setSessionStats(prev => ({
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct
    }));
  }, [answeredQuestions]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const restartSession = () => {
    setCurrentQuestionIndex(0);
    setSessionStats({
      correct: 0,
      total: 0
    });
    setAnsweredQuestions(new Set());
    fetchQuestions();
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
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 px-0">
      {/* Progress Bar at the top */}
      <ProgressBar
        current={sessionStats.total}
        total={questions.length}
        correct={sessionStats.correct}
        timeSpent={timeSpent}
        showStats={true}
        streak={0}
      />

      {/* Question Card */}
      <div className="flex-grow">
        <QuestionCardFinal 
          question={currentQuestion} 
          onAnswer={handleAnswer} 
          showQuestionNumber={true} 
          currentQuestion={currentQuestionIndex + 1} 
          totalQuestions={questions.length} 
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button 
          onClick={goToPreviousQuestion} 
          disabled={currentQuestionIndex === 0} 
          variant="outline" 
          className="w-32"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">
            {currentQuestionIndex + 1} de {questions.length}
          </span>
        </div>

        <Button 
          onClick={goToNextQuestion} 
          disabled={isLastQuestion} 
          variant="outline" 
          className="w-32"
        >
          Próxima
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StudySessionFinal;
