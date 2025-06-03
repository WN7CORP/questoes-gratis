import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, CheckCircle, XCircle, BookOpen } from 'lucide-react';
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
        return 'bg-blue-600 border-blue-500 text-white shadow-xl transform scale-[1.02] transition-all duration-300 ring-2 ring-blue-300';
      }
      return 'bg-netflix-card border-netflix-border text-gray-100 hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.01] cursor-pointer transition-all duration-300 hover:shadow-lg';
    }
    if (key === question.resposta_correta) {
      return 'bg-green-600 border-green-500 text-white shadow-xl shadow-green-500/30 ring-2 ring-green-300 animate-pulse';
    }
    if (key === selectedAnswer && key !== question.resposta_correta) {
      return 'bg-red-600 border-red-500 text-white shadow-xl shadow-red-500/30 ring-2 ring-red-300';
    }
    return 'bg-gray-800/60 border-gray-700/60 text-gray-400/70 opacity-50';
  };
  const renderHTMLContent = (content: string) => {
    if (!content) return content;
    const hasHTML = /<[^>]*>/g.test(content);
    if (hasHTML) {
      return <div dangerouslySetInnerHTML={{
        __html: content
      }} className="whitespace-pre-wrap leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>strong]:font-bold [&>em]:italic [&>u]:underline [&>br]:block [&>br]:my-2" />;
    }
    return <div className="whitespace-pre-wrap leading-relaxed rounded-xl">{content}</div>;
  };
  return <>
      <Card className="bg-gradient-to-br from-netflix-card to-gray-900 border-netflix-border shadow-2xl transition-all duration-300 hover:shadow-3xl">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-netflix-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-netflix-red to-red-600 rounded-xl p-3 shadow-lg">
                <Scale className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <Badge variant="outline" className="border-netflix-border text-gray-300 bg-netflix-card/50 text-sm font-medium px-3 py-1">
                    {question.area}
                  </Badge>
                  {showQuestionNumber && currentQuestion && totalQuestions && <Badge variant="outline" className="border-blue-600 text-blue-400 bg-blue-900/20 text-sm font-bold px-3 py-1">
                      {currentQuestion}/{totalQuestions}
                    </Badge>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {answered && <div className="flex items-center gap-2">
                  {selectedAnswer === question.resposta_correta ? <div className="flex items-center gap-2 bg-green-900/30 px-3 py-1 rounded-full">
                      <CheckCircle className="text-green-500 animate-bounce" size={20} />
                      <span className="text-green-400 text-sm font-medium">Correto!</span>
                    </div> : <div className="flex items-center gap-2 bg-red-900/30 px-3 py-1 rounded-full">
                      <XCircle className="text-red-500 animate-pulse" size={20} />
                      <span className="text-red-400 text-sm font-medium">Incorreto</span>
                    </div>}
                </div>}
            </div>
          </div>
        </div>

        {/* Strategically highlighted Question Statement */}
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-blue-400" size={20} />
              <h3 className="text-blue-400 font-semibold text-lg">Enunciado da Questão</h3>
            </div>
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-l-4 border-blue-500 p-6 rounded-lg shadow-inner">
              <div className="text-white text-lg sm:text-xl leading-relaxed font-medium">
                {renderHTMLContent(question.enunciado)}
              </div>
            </div>
          </div>

          {/* Enhanced Alternatives */}
          <div className="space-y-4 mb-8">
            <h4 className="text-gray-300 font-semibold text-base mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-netflix-red rounded-full"></div>
              Alternativas
            </h4>
            {alternatives.map((alternative, index) => <button key={alternative.key} onClick={() => handleAnswerSelect(alternative.key)} disabled={answered} className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${getAlternativeStyle(alternative.key)}`} style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="flex items-start gap-4">
                  <span className="font-bold text-lg min-w-[32px] flex-shrink-0 bg-black/30 rounded-full w-8 h-8 flex items-center justify-center transition-transform duration-200 shadow-lg">
                    {alternative.key}
                  </span>
                  <div className="flex-1 text-base sm:text-lg">
                    {renderHTMLContent(alternative.value)}
                  </div>
                </div>
              </button>)}
          </div>

          {/* Enhanced Submit Button */}
          {!answered && <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full bg-gradient-to-r from-netflix-red to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl shadow-lg">
              Confirmar Resposta
            </Button>}

          {/* Enhanced Correct Answer Display */}
          {answered && <div className="mt-6 p-5 bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 shadow-inner">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-green-400 font-semibold text-base">Resposta Correta:</span>
                <Badge variant="outline" className="border-green-600 text-green-400 bg-green-900/20 font-bold">
                  Alternativa {question.resposta_correta}
                </Badge>
              </div>
              {question.alternativa_correta && <div className="text-gray-300 text-base leading-relaxed pl-8">
                  {renderHTMLContent(question.alternativa_correta)}
                </div>}
            </div>}
        </div>
      </Card>

      {/* Enhanced Answer Feedback */}
      <AnswerFeedback isCorrect={isCorrectAnswer} show={showFeedback} />

      {/* Question Justification Modal */}
      <QuestionJustification justification={question.justificativa} isVisible={showJustification} onClose={() => setShowJustification(false)} />
    </>;
};
export default QuestionCardFinal;