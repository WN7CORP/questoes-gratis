
import { useEffect, useState } from 'react';
import { CheckCircle, Star, Trophy, Target } from 'lucide-react';

interface CelebrationModalProps {
  isVisible: boolean;
  onClose: () => void;
  streak: number;
  percentage: number;
  questionsAnswered: number;
}

const CelebrationModal = ({ isVisible, onClose, streak, percentage, questionsAnswered }: CelebrationModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

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
      <div className={`bg-netflix-card border-netflix-border rounded-xl p-8 max-w-md w-full text-center transform transition-all duration-500 ${showConfetti ? 'animate-scale-in' : ''}`}>
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
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

        <div className="text-6xl mb-4 animate-bounce">
          {percentage >= 90 ? "🏆" : percentage >= 80 ? "🌟" : percentage >= 70 ? "👍" : "💪"}
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">{getTitle()}</h2>
        <p className="text-gray-300 mb-6 text-lg">{getMessage()}</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-3">
            <CheckCircle className="text-green-400 mx-auto mb-1" size={24} />
            <div className="text-white font-bold text-lg">{percentage}%</div>
            <div className="text-gray-400 text-sm">Acertos</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3">
            <Target className="text-blue-400 mx-auto mb-1" size={24} />
            <div className="text-white font-bold text-lg">{questionsAnswered}</div>
            <div className="text-gray-400 text-sm">Questões</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3">
            <Star className="text-yellow-400 mx-auto mb-1" size={24} />
            <div className="text-white font-bold text-lg">{streak}</div>
            <div className="text-gray-400 text-sm">Sequência</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Continuar Estudando
        </button>
      </div>
    </div>
  );
};

export default CelebrationModal;
