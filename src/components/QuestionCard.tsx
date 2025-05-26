
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';

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

interface QuestionCardProps {
  question: Question;
  onAnswer?: (questionId: number, selectedAnswer: string, isCorrect: boolean) => void;
}

const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

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

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || answered) return;
    
    const isCorrect = selectedAnswer === question.resposta_correta;
    setAnswered(true);
    setShowResult(true);
    
    if (onAnswer) {
      onAnswer(question.id, selectedAnswer, isCorrect);
    }
  };

  const getAlternativeStyle = (key: string) => {
    if (!answered) {
      return selectedAnswer === key 
        ? 'bg-netflix-red border-netflix-red text-white' 
        : 'bg-netflix-card border-netflix-border hover:bg-gray-800';
    }
    
    if (key === question.resposta_correta) {
      return 'bg-green-600 border-green-600 text-white';
    }
    
    if (key === selectedAnswer && key !== question.resposta_correta) {
      return 'bg-red-600 border-red-600 text-white';
    }
    
    return 'bg-netflix-card border-netflix-border opacity-50';
  };

  return (
    <Card className="bg-netflix-card border-netflix-border p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-netflix-red rounded-lg p-2">
          <BookOpen className="text-white" size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-netflix-border text-netflix-text-secondary">
              {question.exame}ª {question.ano}
            </Badge>
            <Badge variant="outline" className="border-netflix-border text-netflix-text-secondary">
              Questão {question.numero}
            </Badge>
          </div>
          <h3 className="text-white font-medium">{question.area}</h3>
        </div>
        {answered && (
          <div className="flex items-center gap-2">
            {selectedAnswer === question.resposta_correta ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <XCircle className="text-red-500" size={24} />
            )}
          </div>
        )}
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-white text-lg leading-relaxed">
          {question.questao}
        </p>
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
              <span className="font-bold text-lg min-w-[24px]">
                {alternative.key})
              </span>
              <span className="flex-1">
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
          disabled={!selectedAnswer}
          className="w-full bg-netflix-red hover:bg-red-700 text-white py-3 text-lg font-semibold"
        >
          Responder
        </Button>
      )}

      {/* Justification */}
      {showResult && question.justificativa && (
        <div className="mt-6 p-4 bg-netflix-black rounded-lg border border-netflix-border">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Clock size={16} />
            Comentário da Questão
          </h4>
          <p className="text-netflix-text-secondary leading-relaxed">
            {question.justificativa}
          </p>
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;
