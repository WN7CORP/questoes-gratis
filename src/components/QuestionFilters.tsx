
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from 'lucide-react';
import { QuestionFilters as Filters } from '@/types/questionFinal';
import { supabase } from '@/integrations/supabase/client';

interface QuestionFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  totalQuestions: number;
}

const QuestionFilters = ({
  onFiltersChange,
  totalQuestions
}: QuestionFiltersProps) => {
  const [filters, setFilters] = useState<Filters>({});
  const [areas, setAreas] = useState<string[]>([]);
  const [temas, setTemas] = useState<string[]>([]);
  const [assuntos, setAssuntos] = useState<string[]>([]);
  const [aplicacoesEm, setAplicacoesEm] = useState<string[]>([]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (filters.area) {
      fetchTemas(filters.area);
    } else {
      setTemas([]);
    }
  }, [filters.area]);

  useEffect(() => {
    if (filters.area && filters.tema) {
      fetchAssuntos(filters.area, filters.tema);
    } else {
      setAssuntos([]);
    }
  }, [filters.area, filters.tema]);

  const fetchFilterOptions = async () => {
    try {
      // Buscar todas as áreas
      const {
        data: areasData
      } = await supabase.from('QUESTOES_FINAL').select('area').not('area', 'is', null);
      if (areasData) {
        const uniqueAreas = [...new Set(areasData.map(item => item.area))].filter(Boolean) as string[];
        setAreas(uniqueAreas);
      }

      // Buscar todas as aplicações
      const {
        data: aplicacoesData
      } = await supabase.from('QUESTOES_FINAL').select('aplicada_em').not('aplicada_em', 'is', null);
      if (aplicacoesData) {
        const uniqueAplicacoes = [...new Set(aplicacoesData.map(item => item.aplicada_em))].filter(Boolean) as string[];
        setAplicacoesEm(uniqueAplicacoes);
      }
    } catch (error) {
      console.error('Erro ao buscar opções de filtro:', error);
    }
  };

  const fetchTemas = async (area: string) => {
    try {
      const {
        data
      } = await supabase.from('QUESTOES_FINAL').select('tema').eq('area', area).not('tema', 'is', null);
      if (data) {
        const uniqueTemas = [...new Set(data.map(item => item.tema))].filter(Boolean) as string[];
        setTemas(uniqueTemas);
      }
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
    }
  };

  const fetchAssuntos = async (area: string, tema: string) => {
    try {
      const {
        data
      } = await supabase.from('QUESTOES_FINAL').select('assunto').eq('area', area).eq('tema', tema).not('assunto', 'is', null);
      if (data) {
        const uniqueAssuntos = [...new Set(data.map(item => item.assunto))].filter(Boolean) as string[];
        setAssuntos(uniqueAssuntos);
      }
    } catch (error) {
      console.error('Erro ao buscar assuntos:', error);
    }
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    const newFilters = {
      ...filters
    };
    if (value === 'todas' || value === 'todos' || value === 'todas-areas' || value === 'todos-temas' || value === 'todos-assuntos' || value === 'todas-aplicacoes') {
      delete newFilters[key];
    } else {
      if (key === 'numAlternativas') {
        newFilters[key] = value as 'todas' | '4' | '5';
      } else {
        newFilters[key] = value;
      }
    }

    // Limpar filtros dependentes quando mudamos um filtro pai
    if (key === 'area') {
      delete newFilters.tema;
      delete newFilters.assunto;
    } else if (key === 'tema') {
      delete newFilters.assunto;
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <Card className="bg-netflix-card border-netflix-border p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="text-netflix-red" size={20} />
            <h3 className="text-white font-semibold">Filtros</h3>
            <Badge className="bg-netflix-red text-white text-xs">
              {totalQuestions} questões
            </Badge>
          </div>
          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X size={16} className="mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Área */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Área</label>
            <Select value={filters.area || 'todas-areas'} onValueChange={(value) => updateFilter('area', value)}>
              <SelectTrigger className="bg-netflix-card border-netflix-border text-white">
                <SelectValue placeholder="Todas as áreas" />
              </SelectTrigger>
              <SelectContent className="bg-netflix-card border-netflix-border">
                <SelectItem value="todas-areas" className="text-white hover:bg-netflix-red">Todas as áreas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area} value={area} className="text-white hover:bg-netflix-red">
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tema */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Tema</label>
            <Select 
              value={filters.tema || 'todos-temas'} 
              onValueChange={(value) => updateFilter('tema', value)}
              disabled={!filters.area}
            >
              <SelectTrigger className="bg-netflix-card border-netflix-border text-white disabled:opacity-50">
                <SelectValue placeholder="Todos os temas" />
              </SelectTrigger>
              <SelectContent className="bg-netflix-card border-netflix-border">
                <SelectItem value="todos-temas" className="text-white hover:bg-netflix-red">Todos os temas</SelectItem>
                {temas.map((tema) => (
                  <SelectItem key={tema} value={tema} className="text-white hover:bg-netflix-red">
                    {tema}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assunto */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Assunto</label>
            <Select 
              value={filters.assunto || 'todos-assuntos'} 
              onValueChange={(value) => updateFilter('assunto', value)}
              disabled={!filters.tema}
            >
              <SelectTrigger className="bg-netflix-card border-netflix-border text-white disabled:opacity-50">
                <SelectValue placeholder="Todos os assuntos" />
              </SelectTrigger>
              <SelectContent className="bg-netflix-card border-netflix-border">
                <SelectItem value="todos-assuntos" className="text-white hover:bg-netflix-red">Todos os assuntos</SelectItem>
                {assuntos.map((assunto) => (
                  <SelectItem key={assunto} value={assunto} className="text-white hover:bg-netflix-red">
                    {assunto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aplicada Em */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Aplicada Em</label>
            <Select value={filters.aplicadaEm || 'todas-aplicacoes'} onValueChange={(value) => updateFilter('aplicadaEm', value)}>
              <SelectTrigger className="bg-netflix-card border-netflix-border text-white">
                <SelectValue placeholder="Todas as aplicações" />
              </SelectTrigger>
              <SelectContent className="bg-netflix-card border-netflix-border">
                <SelectItem value="todas-aplicacoes" className="text-white hover:bg-netflix-red">Todas as aplicações</SelectItem>
                {aplicacoesEm.map((aplicacao) => (
                  <SelectItem key={aplicacao} value={aplicacao} className="text-white hover:bg-netflix-red">
                    {aplicacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Número de Alternativas */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Alternativas</label>
            <Select value={filters.numAlternativas || 'todas'} onValueChange={(value) => updateFilter('numAlternativas', value)}>
              <SelectTrigger className="bg-netflix-card border-netflix-border text-white">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-netflix-card border-netflix-border">
                <SelectItem value="todas" className="text-white hover:bg-netflix-red">Todas</SelectItem>
                <SelectItem value="4" className="text-white hover:bg-netflix-red">4 alternativas</SelectItem>
                <SelectItem value="5" className="text-white hover:bg-netflix-red">5 alternativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuestionFilters;
