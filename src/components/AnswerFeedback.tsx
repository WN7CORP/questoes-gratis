
import { CheckCircle, XCircle } from 'lucide-react';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  show: boolean;
}

const AnswerFeedback = ({ isCorrect, show }: AnswerFeedbackProps) => {
  if (!show) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className={`
        p-3 rounded-xl shadow-2xl text-center backdrop-blur-sm border-2
        transform transition-all duration-300 ease-out
        animate-[scale-in_0.2s_ease-out] hover:scale-105
        ${isCorrect 
          ? 'bg-green-900/95 border-green-400 text-green-50' 
          : 'bg-red-900/95 border-red-400 text-red-50'}
      `}>
        <div className="flex flex-col items-center gap-2">
          <div className="text-5xl animate-bounce">
            {isCorrect ? '😄' : '😔'}
          </div>
          <h3 className="text-lg font-bold">
            {isCorrect ? 'Acertou!' : 'Errou!'}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AnswerFeedback;
