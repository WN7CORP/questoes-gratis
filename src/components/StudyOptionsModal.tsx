
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Target, Clock, TrendingUp, BookOpen, Zap, Brain } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface StudyOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onStart: (options: { mode: string; questionCount: number; areas: string[] }) => void;
  mode: string;
}

const StudyOptionsModal = ({ isVisible, onClose, onStart, mode }: StudyOptionsModalProps) => {
  const [questionCount, setQuestionCount] = useState(10);
  const [customQuestionCount, setCustomQuestionCount] = useState('');
  const [useCustomCount, setUseCustomCount] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [totalQuestionsAvailable, setTotalQuestionsAvailable] = useState(0);

  // Define question options based on mode
  const getQuestionOptions = () => {
    switch (mode) {
      case 'quick':
        return [10]; // Fixed 10 questions for quick mode
      case 'desafio':
        return [5]; // Fixed 5 questions for daily challenge
      case 'area':
        return [5, 10, 15, 20, 30]; // Variable for area study
      default:
        return [5, 10, 15, 20, 30];
    }
  };

  const questionOptions = getQuestionOptions();

  useEffect(() => {
    if (isVisible) {
      fetchAvailableAreas();
      // Set default question count based on mode
      if (mode === 'quick') {
        setQuestionCount(10);
      } else if (mode === 'desafio') {
        setQuestionCount(5);
      }
    }
  }, [isVisible, mode]);

  const fetchAvailableAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
        .select('area')
        .not('area', 'is', null);

      if (error) {
        console.error('Error fetching areas:', error);
        return;
      }

      const uniqueAreas = [...new Set(data.map(item => item.area))].filter(Boolean).sort();
      setAvailableAreas(uniqueAreas);
      
      // Count total questions
      setTotalQuestionsAvailable(data.length);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAreaToggle = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleStart = () => {
    const finalQuestionCount = useCustomCount && customQuestionCount 
      ? parseInt(customQuestionCount) 
      : questionCount;

    onStart({
      mode,
      questionCount: finalQuestionCount,
      areas: selectedAreas
    });
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'area': return 'Estudar por Área';
      case 'quick': return 'Questões Rápidas';
      case 'desafio': return 'Desafio Diário';
      default: return 'Estudo';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'area': return <BookOpen className="text-white" size={24} />;
      case 'quick': return <Zap className="text-white" size={24} />;
      case 'desafio': return <Brain className="text-white" size={24} />;
      default: return <Target className="text-white" size={24} />;
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'area': return 'Escolha uma área específica para focar seus estudos';
      case 'quick': return 'Pratique com 10 questões aleatórias para aquecimento';
      case 'desafio': return 'Teste seus conhecimentos com 5 questões desafiadoras';
      default: return 'Configure suas opções de estudo';
    }
  };

  const shouldShowAreaSelection = () => {
    return mode === 'area' || mode === 'quick';
  };

  const shouldShowQuestionCount = () => {
    return mode === 'area';
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
            <div>
              <h2 className="text-2xl font-bold text-white">{getModeTitle()}</h2>
              <p className="text-netflix-text-secondary text-sm">{getModeDescription()}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-700 bg-transparent border-gray-600"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Quantidade de Questões */}
        {shouldShowQuestionCount() && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Quantidade de Questões
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="customCount"
                  checked={useCustomCount}
                  onChange={(e) => setUseCustomCount(e.target.checked)}
                  className="w-4 h-4 text-netflix-red bg-gray-800 border-gray-600 rounded focus:ring-netflix-red"
                />
                <label htmlFor="customCount" className="text-gray-300 text-sm">
                  Usar quantidade personalizada (máximo: {totalQuestionsAvailable})
                </label>
              </div>
              
              {useCustomCount && (
                <input
                  type="number"
                  min="1"
                  max={totalQuestionsAvailable}
                  value={customQuestionCount}
                  onChange={(e) => setCustomQuestionCount(e.target.value)}
                  placeholder="Digite a quantidade"
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 mb-3"
                />
              )}
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {questionOptions.map(count => (
                <Button
                  key={count}
                  variant="outline"
                  onClick={() => {
                    setQuestionCount(count);
                    setUseCustomCount(false);
                  }}
                  disabled={useCustomCount}
                  className={`${!useCustomCount && questionCount === count 
                    ? 'bg-netflix-red hover:bg-red-700 text-white border-netflix-red' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent'
                  } ${useCustomCount ? 'opacity-75' : ''}`}
                >
                  {count} questões
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => {
                  setUseCustomCount(true);
                  setCustomQuestionCount(totalQuestionsAvailable.toString());
                }}
                className={`${useCustomCount && customQuestionCount === totalQuestionsAvailable.toString()
                  ? 'bg-netflix-red hover:bg-red-700 text-white border-netflix-red' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent'
                }`}
              >
                Todas ({totalQuestionsAvailable})
              </Button>
            </div>
          </div>
        )}

        {/* Seleção de Áreas */}
        {shouldShowAreaSelection() && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              {mode === 'area' ? 'Selecione a Área' : 'Áreas de Estudo (Opcional)'}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {mode === 'area' 
                ? 'Escolha uma área específica para estudar' 
                : 'Deixe vazio para incluir todas as áreas'
              }
            </p>
            <div className="flex gap-2 flex-wrap max-h-48 overflow-y-auto">
              {availableAreas.map(area => (
                <Badge
                  key={area}
                  variant="outline"
                  className={`cursor-pointer transition-colors ${
                    selectedAreas.includes(area)
                      ? 'bg-netflix-red hover:bg-red-700 text-white border-netflix-red'
                      : 'border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent'
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
            • {useCustomCount && customQuestionCount ? customQuestionCount : questionCount} questões
          </p>
          {selectedAreas.length > 0 && (
            <p className="text-gray-300">
              • {selectedAreas.length} área(s) selecionada(s): {selectedAreas.slice(0, 3).join(', ')}
              {selectedAreas.length > 3 && ` +${selectedAreas.length - 3} mais`}
            </p>
          )}
          {selectedAreas.length === 0 && shouldShowAreaSelection() && (
            <p className="text-gray-300">
              • Todas as áreas incluídas
            </p>
          )}
          {mode === 'desafio' && (
            <p className="text-gray-300">
              • Questões de nível avançado selecionadas automaticamente
            </p>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleStart}
            disabled={mode === 'area' && selectedAreas.length === 0}
            className="flex-1 bg-netflix-red hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Iniciar Estudo
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StudyOptionsModal;
