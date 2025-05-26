
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare } from 'lucide-react';
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
        ? 'bg-netflix-red border-red-500 text-white shadow-lg transform scale-[1.02] transition-all duration-200' 
        : 'bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200';
    }
    
    if (key === question.resposta_correta) {
      return 'bg-green-600 border-green-500 text-white shadow-lg';
    }
    
    if (key === selectedAnswer && key !== question.resposta_correta) {
      return 'bg-red-600 border-red-500 text-white shadow-lg';
    }
    
    return 'bg-gray-800 border-gray-600 text-gray-400 opacity-60';
  };

  return (
    <>
      <Card className="bg-netflix-card border-netflix-border p-6 max-w-4xl mx-auto shadow-xl">
        {/* Question */}
        <div className="mb-6">
          <div className="text-gray-100 text-lg leading-relaxed whitespace-pre-wrap">
            {question.questao}
          </div>
        </div>

        {/* Alternatives */}
        <div className="space-y-3 mb-6">
          {alternatives.map((alternative) => (
            <button
              key={alternative.key}
              onClick={() => handleAnswerSelect(alternative.key)}
              disabled={answered}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${getAlternativeStyle(alternative.key)}`}
            >
              <div className="flex items-start gap-3">
                <span className="font-bold text-lg min-w-[24px] flex-shrink-0">
                  {alternative.key})
                </span>
                <span className="flex-1 text-base whitespace-pre-wrap">
                  {alternative.value}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button or Action Buttons */}
        {!answered ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="w-full bg-netflix-red hover:bg-red-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Responder
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Question Info (appears after answering) */}
            <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-900">
                  {question.exame}ª {question.ano}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-900">
                  Questão {question.numero}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-900">
                  {question.area}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFavorite}
                  className={`${isFavorite ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-gray-300'} transition-colors`}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </Button>
              </div>
            </div>

            {/* Comment Button */}
            {question.justificativa && (
              <Button
                onClick={() => setShowJustification(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-all duration-200"
              >
                <MessageSquare size={20} className="mr-2" />
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
