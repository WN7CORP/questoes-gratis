import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
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
  useEffect(() => {
    setSelectedAnswer('');
    setShowResult(false);
    setAnswered(isAnswered);
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
    if (answered || isAnnulled) return;
    setSelectedAnswer(answer);
  };
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || answered || isAnnulled) return;
    const isCorrect = selectedAnswer === question.resposta_correta;
    setAnswered(true);
    setShowResult(true);
    if (onAnswer) {
      onAnswer(question.id, selectedAnswer, isCorrect);
    }
  };
  const getAlternativeStyle = (key: string) => {
    if (isAnnulled) {
      return 'bg-gray-800/50 border-gray-600/50 text-gray-500 cursor-not-allowed';
    }
    if (!answered) {
      return selectedAnswer === key ? 'bg-netflix-red border-netflix-red text-white shadow-lg transform scale-[1.02] transition-all duration-200' : 'bg-netflix-card border-netflix-border text-gray-100 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 cursor-pointer';
    }
    if (key === question.resposta_correta) {
      return 'bg-green-600 border-green-500 text-white shadow-lg';
    }
    if (key === selectedAnswer && key !== question.resposta_correta) {
      return 'bg-red-600 border-red-500 text-white shadow-lg';
    }
    return 'bg-netflix-card border-netflix-border text-gray-400 opacity-60';
  };
  if (isAnnulled) {
    return <Card className="bg-netflix-card border-netflix-border p-6 max-w-4xl mx-auto shadow-xl opacity-75">
        {/* Header for annulled question */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gray-600 rounded-lg p-2">
              <AlertTriangle className="text-gray-300" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="outline" className="border-gray-600 text-gray-400 bg-gray-800/50">
                  {question.exame} - {question.ano}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-400 bg-gray-800/50">
                  Questão {question.numero}
                </Badge>
                <Badge variant="outline" className="border-red-600 text-red-400 bg-red-900/20">
                  ANULADA
                </Badge>
              </div>
              <h3 className="text-gray-400 font-medium text-sm sm:text-base">{question.area}</h3>
            </div>
          </div>
        </div>

        {/* Question text */}
        <div className="mb-6">
          <div className="text-gray-400 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {question.questao}
          </div>
        </div>

        {/* Alternatives - disabled */}
        <div className="space-y-3 mb-6">
          {alternatives.map(alternative => <div key={alternative.key} className="w-full p-3 sm:p-4 rounded-lg border-2 bg-gray-800/50 border-gray-600/50 text-gray-500 cursor-not-allowed">
              <div className="flex items-start gap-3">
                <span className="font-bold text-lg min-w-[24px] flex-shrink-0">
                  {alternative.key})
                </span>
                <span className="flex-1 text-sm sm:text-base whitespace-pre-wrap">
                  {alternative.value}
                </span>
              </div>
            </div>)}
        </div>

        {/* Annulled message */}
        <div className="p-4 bg-red-900/20 rounded-lg border border-red-600/30">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={16} />
            <span className="font-semibold">Questão Anulada</span>
          </div>
          <p className="text-red-300 text-sm mt-1">
            Esta questão foi anulada no exame original e não conta para a pontuação.
          </p>
        </div>
      </Card>;
  }
  return <Card className="bg-netflix-card border-netflix-border p-6 max-w-4xl mx-auto shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-netflix-red rounded-lg p-2">
            <BookOpen className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="outline" className="border-netflix-border text-gray-300 bg-netflix-card">
                {question.exame} - {question.ano}
              </Badge>
              <Badge variant="outline" className="border-netflix-border text-gray-300 bg-netflix-card">
                Questão {question.numero}
              </Badge>
            </div>
            <h3 className="text-white font-medium text-sm sm:text-base">{question.area}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {answered && <div className="flex items-center gap-2">
              {selectedAnswer === question.resposta_correta ? <CheckCircle className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
            </div>}
        </div>
      </div>

      {/* Question text */}
      <div className="mb-6">
        <div className="text-gray-100 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
          {question.questao}
        </div>
      </div>

      {/* Alternatives */}
      <div className="space-y-3 mb-6 py-0 my-0 mx-0 px-0">
        {alternatives.map(alternative => <button key={alternative.key} onClick={() => handleAnswerSelect(alternative.key)} disabled={answered} className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 ${getAlternativeStyle(alternative.key)}`}>
            <div className="flex items-start gap-3">
              <span className="font-bold text-lg min-w-[24px] flex-shrink-0">
                {alternative.key})
              </span>
              <span className="flex-1 text-sm sm:text-base whitespace-pre-wrap">
                {alternative.value}
              </span>
            </div>
          </button>)}
      </div>

      {/* Submit Button */}
      {!answered && <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full bg-netflix-red hover:bg-red-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
          Responder
        </Button>}

      {/* Justification */}
      {showResult && question.justificativa && <div className="mt-6 p-4 bg-netflix-card rounded-lg border border-netflix-border">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <BookOpen size={16} className="text-netflix-red" />
            Comentário da Questão
          </h4>
          <div className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
            {question.justificativa}
          </div>
        </div>}
    </Card>;
};
export default MinimalQuestionCard;