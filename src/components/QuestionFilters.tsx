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
  return;
};
export default QuestionFilters;