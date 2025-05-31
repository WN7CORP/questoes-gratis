
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
        p-3 rounded-lg shadow-lg text-center backdrop-blur-sm border
        transform transition-all duration-200 ease-out
        animate-[scale-in_0.15s_ease-out,fade-in_0.15s_ease-out] 
        ${isCorrect 
          ? 'bg-green-800/80 border-green-400 text-green-50 shadow-green-500/20' 
          : 'bg-red-800/80 border-red-400 text-red-50 shadow-red-500/20'}
      `}>
        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl select-none" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>
            {isCorrect ? '✅' : '❌'}
          </div>
          {isCorrect ? (
            <div className="flex items-center gap-2 text-green-200">
              <CheckCircle size={14} />
              <span className="text-xs font-medium">Correto!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-200">
              <XCircle size={14} />
              <span className="text-xs font-medium">Incorreto</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerFeedback;
