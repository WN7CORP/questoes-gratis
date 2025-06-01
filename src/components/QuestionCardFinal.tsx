import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, CheckCircle, XCircle, BookOpen, MessageSquare, Calendar, Hash } from 'lucide-react';
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

  // Reset state completely when question changes
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

    // Hide feedback after 600ms (more subtle)
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
        return 'bg-blue-600 border-blue-500 text-white shadow-lg transform scale-[1.01] transition-all duration-200';
      }
      return 'bg-netflix-card border-netflix-border text-gray-100 hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.005] cursor-pointer transition-all duration-200';
    }
    if (key === question.resposta_correta) {
      return 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20';
    }
    if (key === selectedAnswer && key !== question.resposta_correta) {
      return 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20';
    }
    return 'bg-gray-800/60 border-gray-700/60 text-gray-400/70 opacity-50';
  };

  // Function to safely render HTML content
  const renderHTMLContent = (content: string) => {
    if (!content) return content;

    // Check if content contains HTML tags
    const hasHTML = /<[^>]*>/g.test(content);
    if (hasHTML) {
      return <div dangerouslySetInnerHTML={{
        __html: content
      }} className="whitespace-pre-wrap my-[32px] [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>strong]:font-bold [&>em]:italic [&>u]:underline [&>br]:block [&>br]:my-2" />;
    }
    return <div className="whitespace-pre-wrap my-0">{content}</div>;
  };
  return <>
      <Card className="bg-netflix-card border-netflix-border p-4 sm:p-6 max-w-4xl mx-auto shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-netflix-red rounded-lg p-2 sm:p-3 transition-transform duration-200 hover:scale-110">
              <Scale className="text-white" size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="outline" className="border-netflix-border text-gray-300 bg-netflix-card text-xs">
                  {question.area}
                </Badge>
                {question.tema && <Badge variant="outline" className="border-blue-600 text-blue-400 bg-blue-900/20 text-xs">
                    {question.tema}
                  </Badge>}
                {question.assunto && <Badge variant="outline" className="border-green-600 text-green-400 bg-green-900/20 text-xs">
                    {question.assunto}
                  </Badge>}
                {showQuestionNumber && currentQuestion && totalQuestions && <Badge variant="outline" className="border-netflix-border text-gray-300 bg-netflix-card text-xs font-bold">
                    {currentQuestion}/{totalQuestions}
                  </Badge>}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 py-[8px] flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Aplicada em: {question.aplicada_em}</span>
                </div>
                {question.numero_questao && <div className="flex items-center gap-1">
                    
                    
                  </div>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {answered && (selectedAnswer === question.resposta_correta ? <CheckCircle className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />)}
          </div>
        </div>

        {/* Question text */}
        <div className="mb-4 sm:mb-6">
          <div className="text-gray-100 text-base sm:text-xl leading-relaxed">
            {renderHTMLContent(question.enunciado)}
          </div>
        </div>

        {/* Alternatives */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 py-[8px]">
          {alternatives.map((alternative, index) => <button key={alternative.key} onClick={() => handleAnswerSelect(alternative.key)} disabled={answered} className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-[1.005] active:scale-[0.99] ${getAlternativeStyle(alternative.key)}`} style={{
          animationDelay: `${index * 50}ms`
        }}>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="font-bold text-sm min-w-[18px] flex-shrink-0 bg-black/20 rounded-full w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center transition-transform duration-200">
                  {alternative.key}
                </span>
                <span className="flex-1 text-sm sm:text-lg">
                  {renderHTMLContent(alternative.value)}
                </span>
              </div>
            </button>)}
        </div>

        {/* Submit Button */}
        {!answered && <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full bg-netflix-red hover:bg-red-700 text-white sm:py-4 text-base sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg py-[14px] my-[24px]">
            Responder
          </Button>}

        {/* Show correct answer info when answered */}
        {answered && <div className="mt-4 p-4 bg-gray-800/40 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-300 text-sm">Resposta correta:</span>
              <Badge variant="outline" className="border-green-600 text-green-400 bg-green-900/20">
                Alternativa {question.resposta_correta}
              </Badge>
            </div>
            {question.alternativa_correta && <div className="text-gray-400 text-sm">
                {renderHTMLContent(question.alternativa_correta)}
              </div>}
          </div>}
      </Card>

      {/* Answer Feedback Animation - More subtle */}
      <AnswerFeedback isCorrect={isCorrectAnswer} show={showFeedback} />

      {/* Justification Modal */}
      <QuestionJustification justification={question.justificativa} isVisible={showJustification} onClose={() => setShowJustification(false)} />
    </>;
};
export default QuestionCardFinal;