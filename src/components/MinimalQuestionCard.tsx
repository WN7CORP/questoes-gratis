
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AnswerFeedback from './AnswerFeedback';
import QuestionJustification from './QuestionJustification';

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

const MinimalQuestionCard = ({ question, onAnswer, isAnswered = false }: MinimalQuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(isAnswered);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showJustification, setShowJustification] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setShowResult(false);
    setAnswered(isAnswered);
    setShowFeedback(false);
    setShowJustification(false);
  }, [question.id, isAnswered]);

  const alternatives = [
    { key: 'A', value: question.alternativa_a },
    { key: 'B', value: question.alternativa_b },
    { key: 'C', value: question.alternativa_c },
    { key: 'D', value: question.alternativa_d },
  ].filter(alt => alt.value && alt.value.trim() !== '');

  const handleAnswerSelect = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || answered) return;
    
    const isCorrect = selectedAnswer === question.resposta_correta;
    setAnswered(true);
    setShowResult(true);
    
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
      description: isFavorite 
        ? "Questão removida da sua lista de favoritos" 
        : "Questão salva na sua lista de favoritos"
    });
  };

  const getAlternativeStyle = (key: string) => {
    if (!answered) {
      return selectedAnswer === key 
        ? 'bg-netflix-red border-red-500 text-white shadow-lg transform scale-[1.02] transition-all duration-200 ring-2 ring-red-300' 
        : 'bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 active:scale-95';
    }
    
    if (key === question.resposta_correta) {
      return 'bg-green-600 border-green-500 text-white shadow-lg ring-2 ring-green-300';
    }
    
    if (key === selectedAnswer && key !== question.resposta_correta) {
      return 'bg-red-600 border-red-500 text-white shadow-lg ring-2 ring-red-300';
    }
    
    return 'bg-gray-800 border-gray-600 text-gray-400 opacity-60';
  };

  const isCorrect = selectedAnswer === question.resposta_correta;

  return (
    <>
      <Card className="bg-netflix-card border-netflix-border p-4 sm:p-6 max-w-4xl mx-auto shadow-xl">
        {/* Question Info - Mostrar SEMPRE no topo */}
        <div className="flex items-center justify-between flex-wrap gap-4 p-4 sm:p-5 bg-gray-800 rounded-xl mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-900 text-sm sm:text-base px-3 py-1">
              {question.exame}ª {question.ano}
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-900 text-sm sm:text-base px-3 py-1">
              Questão {question.numero}
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-900 text-sm sm:text-base px-3 py-1">
              {question.area}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className={`${isFavorite ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-gray-300'} transition-colors p-3 rounded-full active:scale-95`}
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
            </Button>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6 sm:mb-8">
          <div className="text-gray-100 text-lg sm:text-xl leading-relaxed whitespace-pre-wrap font-medium">
            {question.questao}
          </div>
        </div>

        {/* Alternatives - Mobile Optimized */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {alternatives.map((alternative) => (
            <button
              key={alternative.key}
              onClick={() => handleAnswerSelect(alternative.key)}
              disabled={answered}
              className={`w-full p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200 min-h-[60px] sm:min-h-[70px] ${getAlternativeStyle(alternative.key)}`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="font-bold text-xl sm:text-2xl min-w-[28px] sm:min-w-[32px] flex-shrink-0 mt-1">
                  {alternative.key})
                </span>
                <span className="flex-1 text-base sm:text-lg whitespace-pre-wrap leading-relaxed">
                  {alternative.value}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button ou Resultado */}
        {!answered ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="w-full bg-netflix-red hover:bg-red-700 text-white py-4 sm:py-5 text-lg sm:text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-xl shadow-lg min-h-[56px] sm:min-h-[64px] active:scale-95"
          >
            Responder
          </Button>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Feedback de Resultado */}
            <div className={`p-6 rounded-xl text-center ${isCorrect ? 'bg-green-900/30 border-2 border-green-500' : 'bg-red-900/30 border-2 border-red-500'}`}>
              <div className="flex items-center justify-center gap-3 mb-3">
                {isCorrect ? (
                  <CheckCircle className="text-green-500" size={32} />
                ) : (
                  <XCircle className="text-red-500" size={32} />
                )}
                <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? 'Parabéns! Você acertou!' : 'Ops! Resposta incorreta'}
                </h3>
              </div>
              <p className="text-gray-300 text-lg">
                {isCorrect 
                  ? 'Continue assim, você está indo muito bem!' 
                  : `A resposta correta era: ${question.resposta_correta}`
                }
              </p>
            </div>

            {/* Comment Button */}
            {question.justificativa && (
              <Button
                onClick={() => setShowJustification(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 sm:py-5 text-lg sm:text-xl font-semibold transition-all duration-200 rounded-xl shadow-lg min-h-[56px] sm:min-h-[64px] active:scale-95"
              >
                <MessageSquare size={24} className="mr-3" />
                Ver Comentário
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Feedback Animation */}
      <AnswerFeedback 
        isCorrect={selectedAnswer === question.resposta_correta} 
        show={showFeedback} 
      />

      {/* Justification Panel */}
      <QuestionJustification
        justification={question.justificativa}
        isVisible={showJustification}
        onClose={() => setShowJustification(false)}
      />
    </>
  );
};

export default MinimalQuestionCard;
