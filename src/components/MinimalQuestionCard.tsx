
import { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

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

interface MinimalQuestionCardProps {
  question: Question;
  onAnswer?: (questionId: number, selectedAnswer: string, isCorrect: boolean) => void;
  isAnswered?: boolean;
  isAnnulled?: boolean;
}

const MinimalQuestionCard = ({
  question,
  onAnswer,
  isAnswered = false,
  isAnnulled = false
}: MinimalQuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(isAnswered);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedAnswer('');
    setShowResult(false);
    setAnswered(isAnswered);
  }, [question.id, isAnswered]);

  const alternatives = [
    { key: 'A', value: question.alternativa_a },
    { key: 'B', value: question.alternativa_b },
    { key: 'C', value: question.alternativa_c },
    { key: 'D', value: question.alternativa_d },
  ].filter(alt => alt.value && alt.value.trim() !== '');

  const handleAnswerSelect = (answer: string) => {
    if (answered || isAnnulled || isSubmitting) return;
    setSelectedAnswer(answer);
    
    // Vibração sutil em dispositivos móveis
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || answered || isAnnulled || isSubmitting) return;

    setIsSubmitting(true);
    const isCorrect = selectedAnswer === question.resposta_correta;
    
    // Animação de resposta
    if (cardRef.current) {
      cardRef.current.classList.add('animate-pulse');
      setTimeout(() => {
        cardRef.current?.classList.remove('animate-pulse');
      }, 500);
    }

    setTimeout(() => {
      setAnswered(true);
      setShowResult(true);
      setIsSubmitting(false);

      if (onAnswer) {
        onAnswer(question.id, selectedAnswer, isCorrect);
      }
    }, 300);
  };

  const getAlternativeStyle = (key: string) => {
    if (isAnnulled) {
      return 'bg-gray-800/50 border-gray-600/50 text-gray-500 cursor-not-allowed';
    }
    
    if (!answered) {
      if (selectedAnswer === key) {
        return 'bg-netflix-red border-netflix-red text-white shadow-lg transform scale-[1.02] transition-all duration-300';
      }
      return 'bg-netflix-card border-netflix-border text-gray-100 hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.01] transition-all duration-200 cursor-pointer';
    }
    
    // Questão já respondida - feedback visual aprimorado
    if (key === question.resposta_correta) {
      return 'bg-green-600 border-green-500 text-white shadow-lg animate-scale-in';
    }
    
    if (key === selectedAnswer && key !== question.resposta_correta) {
      return 'bg-red-600 border-red-500 text-white shadow-lg animate-scale-in';
    }
    
    // Outras alternativas em vermelho claro para indicar que estão "erradas"
    return 'bg-red-900/20 border-red-800/40 text-red-200/70 opacity-60';
  };

  if (isAnnulled) {
    return (
      <Card ref={cardRef} className="bg-netflix-card border-netflix-border p-4 sm:p-6 max-w-4xl mx-auto shadow-xl opacity-75">
        {/* Header for annulled question */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-gray-600 rounded-lg p-2 sm:p-3">
              <AlertTriangle className="text-gray-300" size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="outline" className="border-gray-600 text-gray-400 bg-gray-800/50 text-xs">
                  {question.exame} - {question.ano}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-400 bg-gray-800/50 text-xs font-bold">
                  Questão {question.numero}
                </Badge>
                <Badge variant="outline" className="border-red-600 text-red-400 bg-red-900/20 text-xs">
                  ANULADA
                </Badge>
              </div>
              <h3 className="text-gray-400 font-medium text-xs sm:text-sm">{question.area}</h3>
            </div>
          </div>
        </div>

        {/* Question text */}
        <div className="mb-4 sm:mb-6">
          <div className="text-gray-400 text-base sm:text-xl leading-relaxed whitespace-pre-wrap">
            {question.enunciado}
          </div>
        </div>

        {/* Alternatives - disabled */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {alternatives.map(alternative => (
            <div key={alternative.key} className="w-full p-3 sm:p-4 rounded-lg border-2 bg-gray-800/50 border-gray-600/50 text-gray-500 cursor-not-allowed">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="font-bold text-sm min-w-[20px] flex-shrink-0">
                  {alternative.key})
                </span>
                <span className="flex-1 text-sm whitespace-pre-wrap">
                  {alternative.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Annulled message */}
        <div className="p-3 sm:p-4 bg-red-900/20 rounded-lg border border-red-600/30">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={14} />
            <span className="font-semibold text-sm">Questão Anulada</span>
          </div>
          <p className="text-red-300 text-xs sm:text-sm mt-1">
            Esta questão foi anulada no exame original e não conta para a pontuação.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card ref={cardRef} className="bg-netflix-card border-netflix-border p-4 sm:p-6 max-w-4xl mx-auto shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-netflix-red rounded-lg p-2 sm:p-3 transition-transform duration-200 hover:scale-110">
            <Scale className="text-white" size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="outline" className="border-netflix-border text-gray-300 bg-netflix-card text-xs transition-colors duration-200">
                {question.exame} - {question.ano}
              </Badge>
              <Badge variant="outline" className="border-netflix-border text-gray-300 bg-netflix-card text-xs font-bold px-2 py-1 transition-colors duration-200">
                Questão {question.numero}
              </Badge>
            </div>
            <h3 className="text-white font-medium text-xs sm:text-sm">{question.area}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {answered && (
            <div className="flex items-center gap-2">
              {selectedAnswer === question.resposta_correta ? (
                <CheckCircle className="text-green-500 animate-bounce" size={20} />
              ) : (
                <XCircle className="text-red-500 animate-pulse" size={20} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Question text - fonte aumentada */}
      <div className="mb-4 sm:mb-6">
        <div className="text-gray-100 text-base sm:text-xl leading-relaxed whitespace-pre-wrap">
          {question.enunciado}
        </div>
      </div>

      {/* Alternatives - fonte aumentada */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {alternatives.map((alternative, index) => (
          <button
            key={alternative.key}
            onClick={() => handleAnswerSelect(alternative.key)}
            disabled={answered || isSubmitting}
            className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] ${getAlternativeStyle(alternative.key)}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="font-bold text-sm min-w-[18px] flex-shrink-0 bg-black/20 rounded-full w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center transition-transform duration-200">
                {alternative.key}
              </span>
              <span className="flex-1 text-sm sm:text-lg whitespace-pre-wrap">
                {alternative.value}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Submit Button */}
      {!answered && (
        <Button
          onClick={handleSubmitAnswer}
          disabled={!selectedAnswer || isSubmitting}
          className="w-full bg-netflix-red hover:bg-red-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processando...
            </div>
          ) : (
            'Responder'
          )}
        </Button>
      )}
    </Card>
  );
};

export default MinimalQuestionCard;
