
import { CheckCircle, XCircle } from 'lucide-react';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  show: boolean;
}

const AnswerFeedback = ({ isCorrect, show }: AnswerFeedbackProps) => {
  if (!show) return null;

  return (
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 
      ${isCorrect ? 'animate-bounce' : 'animate-pulse'}`}>
      <div className={`
        p-6 rounded-lg shadow-xl border-2 text-center min-w-[280px]
        ${isCorrect 
          ? 'bg-green-900/90 border-green-500 text-green-100' 
          : 'bg-red-900/90 border-red-500 text-red-100'}
      `}>
        <div className="flex items-center justify-center mb-3">
          {isCorrect ? (
            <CheckCircle size={48} className="text-green-400" />
          ) : (
            <XCircle size={48} className="text-red-400" />
          )}
        </div>
        <h3 className="text-xl font-bold mb-1">
          {isCorrect ? 'Parabéns!' : 'Ops, você errou!'}
        </h3>
        <p className="text-sm opacity-90">
          {isCorrect 
            ? 'Você acertou a questão!' 
            : 'Não desanime, continue estudando!'}
        </p>
      </div>
    </div>
  );
};

export default AnswerFeedback;
