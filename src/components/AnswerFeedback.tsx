
import { CheckCircle, XCircle } from 'lucide-react';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  show: boolean;
}

const AnswerFeedback = ({ isCorrect, show }: AnswerFeedbackProps) => {
  if (!show) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className={`
        p-4 rounded-2xl shadow-2xl text-center backdrop-blur-md border-2
        transform transition-all duration-300 ease-out
        animate-[scale-in_0.2s_ease-out] 
        ${isCorrect 
          ? 'bg-green-900/95 border-green-400 text-green-50 shadow-green-500/50' 
          : 'bg-red-900/95 border-red-400 text-red-50 shadow-red-500/50'}
      `}>
        <div className="flex flex-col items-center gap-3">
          <div className="text-6xl animate-bounce select-none" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>
            {isCorrect ? '😄' : '😔'}
          </div>
          <h3 className="text-xl font-bold tracking-wide">
            {isCorrect ? 'Acertou!' : 'Errou!'}
          </h3>
          {isCorrect ? (
            <div className="flex items-center gap-2 text-green-300">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">Parabéns!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-300">
              <XCircle size={20} />
              <span className="text-sm font-medium">Tente novamente!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerFeedback;
