
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
      return <div dangerouslySetInnerHTML={{
        __html: content
      }} className="whitespace-pre-wrap leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>em]:italic [&>u]:underline [&>br]:block [&>br]:my-1 [&>strong]:font-medium" />;
    }
    return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-2 sm:p-3 shadow-md">
                <Scale className="text-white" size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                  <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800/50 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1">
                    {question.area}
                  </Badge>
                  {showQuestionNumber && currentQuestion && totalQuestions && (
                    <Badge variant="outline" className="border-blue-600 text-blue-400 bg-blue-900/20 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1">
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
                      <span className="text-green-400 text-xs sm:text-sm font-medium hidden sm:inline">Correto</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-900/30 px-2 sm:px-3 py-1 rounded-full">
                      <XCircle className="text-red-500" size={16} />
                      <span className="text-red-400 text-xs sm:text-sm font-medium hidden sm:inline">Incorreto</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Statement */}
        <div className="p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <BookOpen className="text-blue-400" size={18} />
              <h3 className="text-blue-400 font-semibold text-base sm:text-lg">Enunciado da Questão</h3>
            </div>
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg shadow-inner">
              <div className="text-white text-base sm:text-lg leading-relaxed font-normal">
                {renderHTMLContent(question.enunciado)}
              </div>
            </div>
          </div>

          {/* Alternatives */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <h4 className="text-gray-300 font-semibold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded-full"></div>
              Alternativas
            </h4>
            {alternatives.map((alternative, index) => (
              <button
                key={alternative.key}
                onClick={() => handleAnswerSelect(alternative.key)}
                disabled={answered}
                className={`w-full p-3 sm:p-5 rounded-lg border-2 text-left transition-all duration-200 ${getAlternativeStyle(alternative.key)}`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="font-bold text-base sm:text-lg min-w-[28px] sm:min-w-[32px] flex-shrink-0 bg-black/30 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-transform duration-150 shadow-md">
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
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg shadow-md"
            >
              Confirmar Resposta
            </Button>
          )}

          {/* Correct Answer Display */}
          {answered && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-lg border border-gray-700/50 shadow-inner">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <CheckCircle className="text-green-500" size={18} />
                <span className="text-green-400 font-semibold text-sm sm:text-base">Resposta Correta:</span>
                <Badge variant="outline" className="border-green-600 text-green-400 bg-green-900/20 font-medium text-xs sm:text-sm">
                  Alternativa {question.resposta_correta}
                </Badge>
              </div>
              {question.alternativa_correta && (
                <div className="text-gray-300 text-sm sm:text-base leading-relaxed pl-6 sm:pl-8">
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
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 shadow-md"
              >
                <MessageSquare size={18} />
                Ver Comentário da Questão
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
