
import { useEffect, useState } from 'react';
import { CheckCircle, Star, Trophy, Target, BookOpen, RotateCcw } from 'lucide-react';

interface CelebrationModalProps {
  isVisible: boolean;
  onClose: () => void;
  streak: number;
  percentage: number;
  questionsAnswered: number;
  onChooseNewArea?: () => void;
  isAreaStudy?: boolean;
}

const CelebrationModal = ({ 
  isVisible, 
  onClose, 
  streak, 
  percentage, 
  questionsAnswered,
  onChooseNewArea,
  isAreaStudy = false
}: CelebrationModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      // Don't auto-close, let user choose action
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const getTitle = () => {
    if (percentage >= 90) return "🏆 Excelente!";
    if (percentage >= 80) return "🌟 Muito Bom!";
    if (percentage >= 70) return "👍 Bom Trabalho!";
    return "💪 Continue Praticando!";
  };

  const getMessage = () => {
    if (percentage >= 90) return "Performance excepcional! Você está dominando a matéria!";
    if (percentage >= 80) return "Ótimo desempenho! Continue assim!";
    if (percentage >= 70) return "Bom trabalho! Você está progredindo bem!";
    return "Não desista! A prática leva à perfeição!";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`bg-netflix-card border-netflix-border rounded-xl p-6 sm:p-8 max-w-md w-full text-center transform transition-all duration-500 ${showConfetti ? 'animate-scale-in' : ''}`}>
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-bounce">
          {percentage >= 90 ? "🏆" : percentage >= 80 ? "🌟" : percentage >= 70 ? "👍" : "💪"}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{getTitle()}</h2>
        <p className="text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg">{getMessage()}</p>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
            <CheckCircle className="text-green-400 mx-auto mb-1" size={20} />
            <div className="text-white font-bold text-base sm:text-lg">{percentage}%</div>
            <div className="text-gray-400 text-xs sm:text-sm">Acertos</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
            <Target className="text-blue-400 mx-auto mb-1" size={20} />
            <div className="text-white font-bold text-base sm:text-lg">{questionsAnswered}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Questões</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
            <Star className="text-yellow-400 mx-auto mb-1" size={20} />
            <div className="text-white font-bold text-base sm:text-lg">{streak}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Sequência</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {isAreaStudy && onChooseNewArea && (
            <button
              onClick={onChooseNewArea}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <BookOpen size={18} />
              Escolher outra área
            </button>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-netflix-red hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <RotateCcw size={18} />
            {isAreaStudy ? 'Ver resultados detalhados' : 'Continuar Estudando'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationModal;
