
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Shuffle, RotateCcw, Settings, X } from 'lucide-react';

interface StudyModeSelectorProps {
  studyMode: 'all' | 'favorites' | 'wrong';
  setStudyMode: (mode: 'all' | 'favorites' | 'wrong') => void;
  selectedAreaFilter: string;
  setSelectedAreaFilter: (area: string) => void;
  areas: string[];
  onShuffle: () => void;
  onReset: () => void;
}

const StudyModeSelector = ({
  studyMode,
  setStudyMode,
  selectedAreaFilter,
  setSelectedAreaFilter,
  areas,
  onShuffle,
  onReset
}: StudyModeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const studyModes = [
    { key: 'all' as const, label: 'Todas as Questões' },
    { key: 'favorites' as const, label: 'Favoritas' },
    { key: 'wrong' as const, label: 'Erradas' },
  ];

  if (!isOpen) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-netflix-red hover:bg-red-700 text-white rounded-full p-3 shadow-lg"
          size="sm"
        >
          <Settings size={20} />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Floating Card */}
      <div className="fixed top-20 right-4 z-50 w-80 max-w-[90vw]">
        <Card className="bg-netflix-card border-netflix-border p-4 shadow-xl animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Configurações de Estudo</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </Button>
          </div>

          {/* Study Mode */}
          <div className="mb-4">
            <label className="text-gray-300 text-sm font-medium mb-2 block">Modo de Estudo:</label>
            <div className="space-y-2">
              {studyModes.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStudyMode(key)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    studyMode === key
                      ? 'bg-netflix-red text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Area Filter */}
          <div className="mb-4">
            <label className="text-gray-300 text-sm font-medium mb-2 block">Área:</label>
            <select
              value={selectedAreaFilter}
              onChange={(e) => setSelectedAreaFilter(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            >
              <option value="">Todas as áreas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={() => { onShuffle(); setIsOpen(false); }}
              variant="outline"
              size="sm"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
            >
              <Shuffle size={16} className="mr-2" />
              Embaralhar
            </Button>

            <Button
              onClick={() => { onReset(); setIsOpen(false); }}
              variant="outline"
              size="sm"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-800"
            >
              <RotateCcw size={16} className="mr-2" />
              Reiniciar
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default StudyModeSelector;
