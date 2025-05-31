
import { Button } from "@/components/ui/button";
import { Scale, BookOpen, Filter, Target } from 'lucide-react';

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
            Questões Comentadas
          </h1>
          <p className="text-xl text-netflix-text-secondary">
            Direito de forma completa e organizada
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-12 max-w-md">
          <div className="flex items-center gap-3 text-left">
            <BookOpen className="text-netflix-red flex-shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold">Questões de Direito</h3>
              <p className="text-netflix-text-secondary text-sm">
                Banco completo com questões comentadas e justificativas
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-left">
            <Filter className="text-netflix-red flex-shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold">Filtros Avançados</h3>
              <p className="text-netflix-text-secondary text-sm">
                Filtre por área, tema, assunto e número de alternativas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left">
            <Target className="text-netflix-red flex-shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold">Estudo Direcionado</h3>
              <p className="text-netflix-text-secondary text-sm">
                Estude de forma focada nas áreas que mais precisa
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
          Prepare-se com questões de direito comentadas e organizadas
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
