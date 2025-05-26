import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AnswerFeedback from './AnswerFeedback';
import QuestionJustification from './QuestionJustification';
import { getAreaColors } from '../utils/areaColors';
interface Question {
  id: number;
  ano: string;
  exame: string;
  area: string;
  numero: string;
  questao: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  resposta_correta: string;
  justificativa: string;
}
interface MinimalQuestionCardProps {
  question: Question;
  onAnswer?: (questionId: number, selectedAnswer: string, isCorrect: boolean) => void;
  isAnswered?: boolean;
}
const MinimalQuestionCard = ({
  question,
  onAnswer,
  isAnswered = false
}: MinimalQuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(isAnswered);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showJustification, setShowJustification] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [answerResult, setAnswerResult] = useState<boolean | null>(null);
  const {
    toast
  } = useToast();
  const areaColorScheme = getAreaColors(question.area);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setShowResult(false);
    setAnswered(isAnswered);
    setShowFeedback(false);
    setShowJustification(false);
    setAnswerResult(null);
  }, [question.id, isAnswered]);
  const alternatives = [{
    key: 'A',
    value: question.alternativa_a
  }, {
    key: 'B',
    value: question.alternativa_b
  }, {
    key: 'C',
    value: question.alternativa_c
  }, {
    key: 'D',
    value: question.alternativa_d
  }].filter(alt => alt.value && alt.value.trim() !== '');
  const handleAnswerSelect = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
  };
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || answered) return;
    const isCorrect = selectedAnswer === question.resposta_correta;
    console.log('Selected answer:', selectedAnswer);
    console.log('Correct answer:', question.resposta_correta);
    console.log('Is correct:', isCorrect);
    setAnswered(true);
    setShowResult(true);
    setAnswerResult(isCorrect);

    // Show feedback animation
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
    if (onAnswer) {
      onAnswer(question.id, selectedAnswer, isCorrect);
    }
  };
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite ? "Questão removida da sua lista de favoritos" : "Questão salva na sua lista de favoritos"
    });
  };
  const getAlternativeStyle = (key: string) => {
    if (!answered) {
      return selectedAnswer === key ? `${areaColorScheme.primary} ${areaColorScheme.border} text-white shadow-lg transform scale-[1.02] transition-all duration-200 ring-2 ring-opacity-50 border-2` : 'bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 active:scale-95 border-2';
    }
    if (key === question.resposta_correta) {
      return 'bg-green-600 border-green-500 text-white shadow-lg ring-2 ring-green-300 border-2';
    }
    if (key === selectedAnswer && key !== question.resposta_correta) {
      return 'bg-red-600 border-red-500 text-white shadow-lg ring-2 ring-red-300 border-2';
    }
    return 'bg-gray-800 border-gray-600 text-gray-400 opacity-60 border-2';
  };
  return <>
      <Card className="bg-netflix-card border-netflix-border p-4 sm:p-6 max-w-4xl mx-auto shadow-xl transition-all duration-300 hover:shadow-2xl">
        {/* Question Info with area colors */}
        <div className={`flex items-center justify-between flex-wrap gap-4 p-4 sm:p-5 bg-gray-800 rounded-xl mb-6 border-l-4 ${areaColorScheme.border}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`${areaColorScheme.border} ${areaColorScheme.text} ${areaColorScheme.bg} text-sm sm:text-base px-3 py-1 border`}>
              {question.exame}ª {question.ano}
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-900 text-sm sm:text-base px-3 py-1">
              Questão {question.numero}
            </Badge>
            <Badge variant="outline" className={`${areaColorScheme.primary} text-white text-sm sm:text-base px-3 py-1 font-semibold`}>
              {question.area}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            
          </div>
        </div>

        {/* Question */}
        <div className="mb-6 sm:mb-8">
          <div className="text-gray-100 text-lg sm:text-xl leading-relaxed whitespace-pre-wrap font-medium">
            {question.questao}
          </div>
        </div>

        {/* Alternatives - with area colors */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {alternatives.map(alternative => <button key={alternative.key} onClick={() => handleAnswerSelect(alternative.key)} disabled={answered} className={`w-full p-4 sm:p-5 rounded-xl text-left transition-all duration-200 min-h-[60px] sm:min-h-[70px] ${getAlternativeStyle(alternative.key)}`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="font-bold text-xl sm:text-2xl min-w-[28px] sm:min-w-[32px] flex-shrink-0 mt-1">
                  {alternative.key})
                </span>
                <span className="flex-1 text-base sm:text-lg whitespace-pre-wrap leading-relaxed">
                  {alternative.value}
                </span>
              </div>
            </button>)}
        </div>

        {/* Submit Button with area colors */}
        {!answered ? <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className={`w-full ${areaColorScheme.primary} ${areaColorScheme.hover} text-white py-4 sm:py-5 text-lg sm:text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-xl shadow-lg min-h-[56px] sm:min-h-[64px] active:scale-95`}>
            Responder
          </Button> : <div className="space-y-4 sm:space-y-6">
            {/* Enhanced Feedback - Now using answerResult state */}
            

            {/* Comment Button with area colors */}
            {question.justificativa && <Button onClick={() => setShowJustification(true)} className={`w-full ${areaColorScheme.secondary} ${areaColorScheme.hover} text-white py-4 sm:py-5 text-lg sm:text-xl font-semibold transition-all duration-200 rounded-xl shadow-lg min-h-[56px] sm:min-h-[64px] active:scale-95`}>
                <MessageSquare size={24} className="mr-3" />
                Ver Comentário
              </Button>}
          </div>}
      </Card>

      {/* Feedback Animation - Now using answerResult state */}
      <AnswerFeedback isCorrect={answerResult || false} show={showFeedback} />

      {/* Justification Panel */}
      <QuestionJustification justification={question.justificativa} isVisible={showJustification} onClose={() => setShowJustification(false)} />
    </>;
};
export default MinimalQuestionCard;