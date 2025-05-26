
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
        p-3 rounded-xl shadow-xl border-2 text-center min-w-[180px] backdrop-blur-sm
        transform transition-all duration-300 animate-scale-in
        ${isCorrect 
          ? 'bg-green-900/95 border-green-500 text-green-100' 
          : 'bg-red-900/95 border-red-500 text-red-100'}
      `}>
        <div className="flex items-center justify-center mb-2">
          <div className="text-3xl mb-1">
            {isCorrect ? '😊' : '😢'}
          </div>
        </div>
        <h3 className="text-base font-bold mb-1">
          {isCorrect ? 'Parabéns!' : 'Ops! Você errou!'}
        </h3>
        <p className="text-xs opacity-90">
          {isCorrect 
            ? 'Você acertou!' 
            : 'Continue tentando!'}
        </p>
      </div>
    </div>
  );
};

export default AnswerFeedback;
