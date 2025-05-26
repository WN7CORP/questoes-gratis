
import { Button } from "@/components/ui/button";
import { Scale, BookOpen, Trophy } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-netflix-black to-gray-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-fade-in">
        {/* Logo Area */}
        <div className="mb-8">
          <div className="bg-netflix-red rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-4">
            <Scale size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            OAB Questões
          </h1>
          <p className="text-xl text-netflix-text-secondary">
            Comentadas
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-12 max-w-md">
          <div className="flex items-center gap-3 text-left">
            <BookOpen className="text-netflix-red flex-shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold">Questões Atualizadas</h3>
              <p className="text-netflix-text-secondary text-sm">
                Banco com milhares de questões comentadas
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-left">
            <Trophy className="text-netflix-red flex-shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold">Organizado por Disciplina</h3>
              <p className="text-netflix-text-secondary text-sm">
                Estude de forma direcionada e eficiente
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onStart}
          className="bg-netflix-red hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold rounded-lg w-full max-w-md transition-all duration-200 hover:scale-105"
        >
          Começar Agora
        </Button>

        <p className="text-netflix-text-secondary text-sm mt-6">
          Prepare-se para o exame da OAB com confiança
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
