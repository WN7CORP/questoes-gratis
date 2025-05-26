
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Target, Clock, TrendingUp } from 'lucide-react';

interface StudyOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onStart: (options: { mode: string; questionCount: number; areas: string[] }) => void;
  mode: string;
}

const StudyOptionsModal = ({ isVisible, onClose, onStart, mode }: StudyOptionsModalProps) => {
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const areas = [
    'Direito Constitucional',
    'Direito Civil',
    'Direito Penal',
    'Direito Processual Civil',
    'Direito Processual Penal',
    'Direito Administrativo',
    'Direito Tributário',
    'Direito do Trabalho',
    'Direito Empresarial',
    'Ética Profissional'
  ];

  const questionOptions = mode === 'simulado' ? [20] : [5, 10, 15, 20, 30];

  const handleAreaToggle = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleStart = () => {
    onStart({
      mode,
      questionCount,
      areas: selectedAreas
    });
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'random': return 'Questões Aleatórias';
      case 'simulado': return 'Simulado Rápido';
      case 'recent': return 'Questões Recentes';
      default: return 'Estudo';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'random': return <Target className="text-white" size={24} />;
      case 'simulado': return <Clock className="text-white" size={24} />;
      case 'recent': return <TrendingUp className="text-white" size={24} />;
      default: return <Target className="text-white" size={24} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="bg-netflix-card border-netflix-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-netflix-red rounded-lg p-3">
              {getModeIcon()}
            </div>
            <h2 className="text-2xl font-bold text-white">{getModeTitle()}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Quantidade de Questões */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            {mode === 'simulado' ? 'Quantidade de Questões (Fixo)' : 'Quantidade de Questões'}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {questionOptions.map(count => (
              <Button
                key={count}
                variant={questionCount === count ? "default" : "outline"}
                onClick={() => setQuestionCount(count)}
                disabled={mode === 'simulado'}
                className={`${questionCount === count 
                  ? 'bg-netflix-red hover:bg-red-700 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                } ${mode === 'simulado' ? 'opacity-75' : ''}`}
              >
                {count} questões
              </Button>
            ))}
          </div>
        </div>

        {/* Seleção de Áreas */}
        {mode !== 'simulado' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Áreas de Estudo (Opcional)
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Deixe vazio para incluir todas as áreas
            </p>
            <div className="flex gap-2 flex-wrap">
              {areas.map(area => (
                <Badge
                  key={area}
                  variant={selectedAreas.includes(area) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedAreas.includes(area)
                      ? 'bg-netflix-red hover:bg-red-700 text-white'
                      : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  }`}
                  onClick={() => handleAreaToggle(area)}
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Resumo */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h4 className="text-white font-semibold mb-2">Resumo do Estudo:</h4>
          <p className="text-gray-300">
            • {questionCount} questões
          </p>
          {selectedAreas.length > 0 && (
            <p className="text-gray-300">
              • {selectedAreas.length} área(s) selecionada(s)
            </p>
          )}
          {selectedAreas.length === 0 && mode !== 'simulado' && (
            <p className="text-gray-300">
              • Todas as áreas incluídas
            </p>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleStart}
            className="flex-1 bg-netflix-red hover:bg-red-700 text-white"
          >
            Iniciar Estudo
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StudyOptionsModal;
