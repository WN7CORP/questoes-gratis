
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

const QuestionFilters = ({ onFiltersChange, totalQuestions }: QuestionFiltersProps) => {
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
      const { data: areasData } = await supabase
        .from('QUESTOES_FINAL')
        .select('area')
        .not('area', 'is', null);
      
      if (areasData) {
        const uniqueAreas = [...new Set(areasData.map(item => item.area))].filter(Boolean) as string[];
        setAreas(uniqueAreas);
      }

      // Buscar todas as aplicações
      const { data: aplicacoesData } = await supabase
        .from('QUESTOES_FINAL')
        .select('aplicada_em')
        .not('aplicada_em', 'is', null);
      
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
      const { data } = await supabase
        .from('QUESTOES_FINAL')
        .select('tema')
        .eq('area', area)
        .not('tema', 'is', null);
      
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
      const { data } = await supabase
        .from('QUESTOES_FINAL')
        .select('assunto')
        .eq('area', area)
        .eq('tema', tema)
        .not('assunto', 'is', null);
      
      if (data) {
        const uniqueAssuntos = [...new Set(data.map(item => item.assunto))].filter(Boolean) as string[];
        setAssuntos(uniqueAssuntos);
      }
    } catch (error) {
      console.error('Erro ao buscar assuntos:', error);
    }
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters };
    
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
      <div className="flex items-center gap-2 mb-4">
        <Filter className="text-netflix-red" size={20} />
        <h3 className="text-white font-semibold">Filtros</h3>
        <Badge variant="secondary" className="ml-auto">
          {totalQuestions} questões
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Filtro por Área */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Área do Direito</label>
          <Select value={filters.area || 'todas-areas'} onValueChange={(value) => updateFilter('area', value)}>
            <SelectTrigger className="bg-netflix-black border-netflix-border">
              <SelectValue placeholder="Todas as áreas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas-areas">Todas as áreas</SelectItem>
              {areas.map(area => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Tema */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Tema</label>
          <Select 
            value={filters.tema || 'todos-temas'} 
            onValueChange={(value) => updateFilter('tema', value)}
            disabled={!filters.area}
          >
            <SelectTrigger className="bg-netflix-black border-netflix-border">
              <SelectValue placeholder="Todos os temas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos-temas">Todos os temas</SelectItem>
              {temas.map(tema => (
                <SelectItem key={tema} value={tema}>{tema}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Assunto */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Assunto</label>
          <Select 
            value={filters.assunto || 'todos-assuntos'} 
            onValueChange={(value) => updateFilter('assunto', value)}
            disabled={!filters.tema}
          >
            <SelectTrigger className="bg-netflix-black border-netflix-border">
              <SelectValue placeholder="Todos os assuntos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos-assuntos">Todos os assuntos</SelectItem>
              {assuntos.map(assunto => (
                <SelectItem key={assunto} value={assunto}>{assunto}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Aplicação */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Aplicada em</label>
          <Select value={filters.aplicadaEm || 'todas-aplicacoes'} onValueChange={(value) => updateFilter('aplicadaEm', value)}>
            <SelectTrigger className="bg-netflix-black border-netflix-border">
              <SelectValue placeholder="Todas as aplicações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas-aplicacoes">Todas as aplicações</SelectItem>
              {aplicacoesEm.map(aplicacao => (
                <SelectItem key={aplicacao} value={aplicacao}>{aplicacao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Número de Alternativas */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Alternativas</label>
          <Select value={filters.numAlternativas || 'todas'} onValueChange={(value) => updateFilter('numAlternativas', value)}>
            <SelectTrigger className="bg-netflix-black border-netflix-border">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="4">4 alternativas (A-D)</SelectItem>
              <SelectItem value="5">5 alternativas (A-E)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-300">Filtros ativos:</span>
          {filters.area && (
            <Badge variant="secondary" className="bg-netflix-red/20 text-netflix-red">
              Área: {filters.area}
            </Badge>
          )}
          {filters.tema && (
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
              Tema: {filters.tema}
            </Badge>
          )}
          {filters.assunto && (
            <Badge variant="secondary" className="bg-green-600/20 text-green-400">
              Assunto: {filters.assunto}
            </Badge>
          )}
          {filters.aplicadaEm && (
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">
              Aplicada em: {filters.aplicadaEm}
            </Badge>
          )}
          {filters.numAlternativas && filters.numAlternativas !== 'todas' && (
            <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">
              {filters.numAlternativas} alternativas
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white"
          >
            <X size={14} className="mr-1" />
            Limpar filtros
          </Button>
        </div>
      )}
    </Card>
  );
};

export default QuestionFilters;
