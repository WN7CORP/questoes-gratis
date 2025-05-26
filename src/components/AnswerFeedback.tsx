
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
        p-2 rounded-lg shadow-2xl text-center backdrop-blur-sm
        transform transition-all duration-500 ease-out
        animate-[scale-in_0.3s_ease-out,bounce_0.6s_ease-out_0.2s]
        ${isCorrect 
          ? 'bg-green-800/95 border border-green-400 text-green-50' 
          : 'bg-red-800/95 border border-red-400 text-red-50'}
      `}>
        <div className="flex flex-col items-center gap-1">
          <div className="text-4xl animate-bounce">
            {isCorrect ? '😄' : '😔'}
          </div>
          <h3 className="text-sm font-bold">
            {isCorrect ? 'Acertou!' : 'Errou!'}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AnswerFeedback;
