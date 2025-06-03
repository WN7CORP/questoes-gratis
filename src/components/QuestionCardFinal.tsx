
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, CheckCircle, XCircle, BookOpen, MessageSquare } from 'lucide-react';
import { QuestionFinal } from '@/types/questionFinal';
import QuestionJustification from './QuestionJustification';
import AnswerFeedback from './AnswerFeedback';

interface QuestionCardFinalProps {
  question: QuestionFinal;
  onAnswer?: (questionId: number, selectedAnswer: string, isCorrect: boolean) => void;
  showQuestionNumber?: boolean;
  currentQuestion?: number;
  totalQuestions?: number;
  onShowJustification?: () => void;
}

const QuestionCardFinal = ({
  question,
  onAnswer,
  showQuestionNumber = false,
  currentQuestion,
  totalQuestions,
  onShowJustification
}: QuestionCardFinalProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showJustification, setShowJustification] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  useEffect(() => {
    console.log('Question changed - resetting state for question:', question.id);
    setSelectedAnswer('');
    setShowResult(false);
    setAnswered(false);
    setShowJustification(false);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
  }, [question.id]);

  const alternatives = [{
    key: 'A',
    value: question.A
  }, {
    key: 'B',
    value: question.B
  }, {
    key: 'C',
    value: question.C
  }, {
    key: 'D',
    value: question.D
  }, {
    key: 'E',
    value: question.E
  }].filter(alt => alt.value && alt.value.trim() !== '');

  const handleAnswerSelect = (answer: string) => {
    if (answered) {
      console.log('Question already answered, ignoring click');
      return;
    }
    console.log('Answer selected:', answer);
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || answered) {
      console.log('Cannot submit - no answer selected or already answered');
      return;
    }
    console.log('Submitting answer:', selectedAnswer);
    const isCorrect = selectedAnswer === question.resposta_correta;
    setIsCorrectAnswer(isCorrect);
    setAnswered(true);
    setShowResult(true);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
    }, 600);

    if (onAnswer) {
      onAnswer(question.id, selectedAnswer, isCorrect);
    }
  };

  const handleShowJustification = () => {
    if (onShowJustification) {
      onShowJustification();
    } else {
      setShowJustification(true);
    }
  };

  const getAlternativeStyle = (key: string) => {
    if (!answered) {
      if (selectedAnswer === key) {
        return 'bg-blue-600 border-blue-500 text-white shadow-lg transform scale-[1.01] transition-all duration-200 ring-1 ring-blue-300';
      }
      return 'bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.005] cursor-pointer transition-all duration-200 hover:shadow-md';
    }

    if (key === question.resposta_correta) {
      return 'bg-green-600 border-green-500 text-white shadow-lg ring-1 ring-green-300';
    }

    if (key === selectedAnswer && key !== question.resposta_correta) {
      return 'bg-red-600 border-red-500 text-white shadow-lg ring-1 ring-red-300';
    }

    return 'bg-gray-800/60 border-gray-600/60 text-gray-400/70 opacity-50';
  };

  const renderHTMLContent = (content: string) => {
    if (!content) return content;
    
    const hasHTML = /<[^>]*>/g.test(content);
    if (hasHTML) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: content }} 
          className="whitespace-pre-wrap leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>em]:italic [&>u]:underline [&>br]:block [&>br]:my-1 [&>strong]:font-medium"
        />
      );
    }
    
    return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  };

  return (
    <>
      <Card className="bg-gray-900 border-gray-700 shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-red-600 rounded-lg p-2 shadow-md">
                <Scale className="text-white" size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                  <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800/50 text-xs font-medium px-2 py-1">
                    {question.area}
                  </Badge>
                  {showQuestionNumber && currentQuestion && totalQuestions && (
                    <Badge variant="outline" className="border-red-600 text-red-400 bg-red-900/30 text-xs font-medium px-2 py-1">
                      {currentQuestion}/{totalQuestions}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {answered && (
                <div className="flex items-center gap-2">
                  {selectedAnswer === question.resposta_correta ? (
                    <div className="flex items-center gap-2 bg-green-900/30 px-2 sm:px-3 py-1 rounded-full">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-green-400 text-xs font-medium hidden sm:inline">Correto</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-900/30 px-2 sm:px-3 py-1 rounded-full">
                      <XCircle className="text-red-500" size={16} />
                      <span className="text-red-400 text-xs font-medium hidden sm:inline">Incorreto</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-4 sm:p-6 bg-gray-900">
          {/* Topic and Subject Info */}
          <div className="mb-4 sm:mb-6 bg-gray-800/60 border border-gray-700 rounded-lg p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {question.tema && (
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-semibold text-xs uppercase tracking-wide">TEMA:</span>
                  <span className="text-white text-sm font-medium truncate">{question.tema}</span>
                </div>
              )}
              {question.assunto && (
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-semibold text-xs uppercase tracking-wide">ASSUNTO:</span>
                  <span className="text-white text-sm font-medium truncate">{question.assunto}</span>
                </div>
              )}
            </div>
            {question.aplicada_em && (
              <div className="pt-3 border-t border-gray-700 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <span className="text-yellow-400 font-medium text-xs">Aplicada em:</span>
                  <span className="text-gray-400 text-xs">{question.aplicada_em}</span>
                </div>
              </div>
            )}
          </div>

          {/* Question Statement */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <BookOpen className="text-red-400" size={16} />
              <h3 className="text-red-400 font-semibold text-sm sm:text-base">Enunciado da Questão</h3>
            </div>
            <div className="bg-gray-800/60 border-l-4 border-red-600 p-4 sm:p-5 rounded-lg">
              <div className="text-white text-base sm:text-lg leading-relaxed font-normal">
                {renderHTMLContent(question.enunciado)}
              </div>
            </div>
          </div>

          {/* Alternatives */}
          <div className="space-y-3 mb-6 sm:mb-8">
            <h4 className="text-gray-400 font-semibold text-sm mb-3 flex items-center gap-2">
              Alternativas
            </h4>
            {alternatives.map((alternative, index) => (
              <button
                key={alternative.key}
                onClick={() => handleAnswerSelect(alternative.key)}
                disabled={answered}
                className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 ${getAlternativeStyle(alternative.key)}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <span className="font-bold text-sm min-w-[24px] flex-shrink-0 bg-black/30 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center transition-transform duration-150">
                    {alternative.key}
                  </span>
                  <div className="flex-1 text-sm sm:text-base">
                    {renderHTMLContent(alternative.value)}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          {!answered && (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg"
            >
              Confirmar Resposta
            </Button>
          )}

          {/* Correct Answer Display */}
          {answered && (
            <div className="mt-4 sm:mt-6 p-4 bg-gray-800/60 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <CheckCircle className="text-green-500" size={16} />
                <span className="text-green-400 font-semibold text-sm">Resposta Correta:</span>
                <Badge variant="outline" className="border-green-600 text-green-400 bg-green-900/20 font-medium text-xs">
                  Alternativa {question.resposta_correta}
                </Badge>
              </div>
              {question.alternativa_correta && (
                <div className="text-gray-400 text-sm leading-relaxed pl-6">
                  {renderHTMLContent(question.alternativa_correta)}
                </div>
              )}
            </div>
          )}

          {/* Comment Button */}
          {answered && (
            <div className="mt-4 sm:mt-6">
              <Button
                onClick={handleShowJustification}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 sm:py-5 text-base sm:text-lg font-normal transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg border border-blue-500/30 hover:border-blue-400/50 hover:shadow-blue-500/20"
              >
                <MessageSquare size={20} />
                <span className="tracking-wide">Ver Comentário da Questão</span>
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Answer Feedback */}
      <AnswerFeedback isCorrect={isCorrectAnswer} show={showFeedback} />

      {/* Question Justification Modal */}
      <QuestionJustification 
        justification={question.justificativa} 
        isVisible={showJustification} 
        onClose={() => setShowJustification(false)} 
      />
    </>
  );
};

export default QuestionCardFinal;
