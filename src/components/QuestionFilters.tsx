
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X, Target } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { QuestionFilters as QuestionFiltersType } from '@/types/questionFinal';

interface QuestionFiltersProps {
  onFiltersChange: (filters: QuestionFiltersType) => void;
  totalQuestions: number;
  onStartStudy: () => void;
}

const QuestionFilters = ({ onFiltersChange, totalQuestions, onStartStudy }: QuestionFiltersProps) => {
  const [areas, setAreas] = useState<string[]>([]);
  const [temas, setTemas] = useState<string[]>([]);
  const [assuntos, setAssuntos] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedTema, setSelectedTema] = useState<string>('');
  const [selectedAssunto, setSelectedAssunto] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (selectedArea) {
      fetchTemas(selectedArea);
    } else {
      setTemas([]);
      setSelectedTema('');
    }
  }, [selectedArea]);

  useEffect(() => {
    if (selectedTema) {
      fetchAssuntos(selectedArea, selectedTema);
    } else {
      setAssuntos([]);
      setSelectedAssunto('');
    }
  }, [selectedTema, selectedArea]);

  useEffect(() => {
    const filters: QuestionFiltersType = {};
    if (selectedArea) filters.area = selectedArea;
    if (selectedTema) filters.tema = selectedTema;
    if (selectedAssunto) filters.assunto = selectedAssunto;
    
    onFiltersChange(filters);
  }, [selectedArea, selectedTema, selectedAssunto, onFiltersChange]);

  const fetchFilterOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('QUESTOES_FINAL')
        .select('area')
        .not('area', 'is', null);

      if (error) {
        console.error('Error fetching areas:', error);
      } else {
        const uniqueAreas = Array.from(new Set(data?.map(item => item.area).filter(Boolean))).sort();
        setAreas(uniqueAreas);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemas = async (area: string) => {
    try {
      const { data, error } = await supabase
        .from('QUESTOES_FINAL')
        .select('tema')
        .eq('area', area)
        .not('tema', 'is', null);

      if (error) {
        console.error('Error fetching temas:', error);
      } else {
        const uniqueTemas = Array.from(new Set(data?.map(item => item.tema).filter(Boolean))).sort();
        setTemas(uniqueTemas);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAssuntos = async (area: string, tema: string) => {
    try {
      const { data, error } = await supabase
        .from('QUESTOES_FINAL')
        .select('assunto')
        .eq('area', area)
        .eq('tema', tema)
        .not('assunto', 'is', null);

      if (error) {
        console.error('Error fetching assuntos:', error);
      } else {
        const uniqueAssuntos = Array.from(new Set(data?.map(item => item.assunto).filter(Boolean))).sort();
        setAssuntos(uniqueAssuntos);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const clearFilters = () => {
    setSelectedArea('');
    setSelectedTema('');
    setSelectedAssunto('');
  };

  const hasActiveFilters = selectedArea || selectedTema || selectedAssunto;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  return (
    <Card className="bg-netflix-card border-netflix-border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="text-netflix-red" size={24} />
          <h2 className="text-xl font-semibold text-white">Filtros de Estudo</h2>
          {hasActiveFilters && (
            <Badge variant="outline" className="border-netflix-red text-netflix-red">
              Filtros ativos
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="outline" size="sm">
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Área */}
        <div className="space-y-2">
          <Label htmlFor="area" className="text-gray-300">Área</Label>
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="bg-netflix-card border-netflix-border text-white">
              <SelectValue placeholder="Selecione uma área" />
            </SelectTrigger>
            <SelectContent>
              {areas.map(area => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tema */}
        <div className="space-y-2">
          <Label htmlFor="tema" className="text-gray-300">Tema</Label>
          <Select value={selectedTema} onValueChange={setSelectedTema} disabled={!selectedArea}>
            <SelectTrigger className="bg-netflix-card border-netflix-border text-white disabled:opacity-50">
              <SelectValue placeholder="Selecione um tema" />
            </SelectTrigger>
            <SelectContent>
              {temas.map(tema => (
                <SelectItem key={tema} value={tema}>{tema}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assunto */}
        <div className="space-y-2">
          <Label htmlFor="assunto" className="text-gray-300">Assunto</Label>
          <Select value={selectedAssunto} onValueChange={setSelectedAssunto} disabled={!selectedTema}>
            <SelectTrigger className="bg-netflix-card border-netflix-border text-white disabled:opacity-50">
              <SelectValue placeholder="Selecione um assunto" />
            </SelectTrigger>
            <SelectContent>
              {assuntos.map(assunto => (
                <SelectItem key={assunto} value={assunto}>{assunto}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Start Study Button */}
      <div className="flex items-center justify-between pt-4 border-t border-netflix-border">
        <div className="text-gray-400">
          {totalQuestions > 0 ? (
            <span>{totalQuestions.toLocaleString()} questões encontradas</span>
          ) : (
            <span>Nenhuma questão encontrada com os filtros aplicados</span>
          )}
        </div>
        <Button 
          onClick={onStartStudy} 
          className="bg-netflix-red hover:bg-red-700 text-white px-6 py-2"
          disabled={totalQuestions === 0}
        >
          <Target className="mr-2 h-4 w-4" />
          Iniciar Estudo
        </Button>
      </div>
    </Card>
  );
};

export default QuestionFilters;
