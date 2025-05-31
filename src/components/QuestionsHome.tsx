
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, TrendingUp, Play } from 'lucide-react';
import { QuestionFilters } from '@/types/questionFinal';
import { supabase } from '@/integrations/supabase/client';
import QuestionFiltersComponent from './QuestionFilters';
import StudySessionFinal from './StudySessionFinal';

interface QuestionsHomeProps {
  onHideNavigation?: (hide: boolean) => void;
}

const QuestionsHome = ({ onHideNavigation }: QuestionsHomeProps) => {
  const [showFilters, setShowFilters] = useState(true);
  const [showStudySession, setShowStudySession] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<QuestionFilters>({});
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionStats, setQuestionStats] = useState({
    totalWith4Alternatives: 0,
    totalWith5Alternatives: 0,
    totalAreas: 0
  });

  useEffect(() => {
    fetchQuestionStats();
  }, []);

  useEffect(() => {
    fetchFilteredQuestionCount();
  }, [selectedFilters]);

  const fetchQuestionStats = async () => {
    try {
      // Contar total de questões
      const { count: total } = await supabase
        .from('QUESTOES_FINAL')
        .select('*', { count: 'exact', head: true });

      // Contar questões com 4 alternativas (sem E)
      const { count: with4 } = await supabase
        .from('QUESTOES_FINAL')
        .select('*', { count: 'exact', head: true })
        .is('E', null);

      // Contar questões com 5 alternativas (com E)
      const { count: with5 } = await supabase
        .from('QUESTOES_FINAL')
        .select('*', { count: 'exact', head: true })
        .not('E', 'is', null);

      // Contar áreas distintas
      const { data: areasData } = await supabase
        .from('QUESTOES_FINAL')
        .select('area')
        .not('area', 'is', null);

      const uniqueAreas = areasData ? new Set(areasData.map(item => item.area)).size : 0;

      setQuestionStats({
        totalWith4Alternatives: with4 || 0,
        totalWith5Alternatives: with5 || 0,
        totalAreas: uniqueAreas
      });

      setTotalQuestions(total || 0);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchFilteredQuestionCount = async () => {
    try {
      let query = supabase
        .from('QUESTOES_FINAL')
        .select('*', { count: 'exact', head: true });

      // Aplicar filtros
      if (selectedFilters.area) {
        query = query.eq('area', selectedFilters.area);
      }
      if (selectedFilters.tema) {
        query = query.eq('tema', selectedFilters.tema);
      }
      if (selectedFilters.assunto) {
        query = query.eq('assunto', selectedFilters.assunto);
      }
      if (selectedFilters.aplicadaEm) {
        query = query.eq('aplicada_em', selectedFilters.aplicadaEm);
      }
      if (selectedFilters.numAlternativas) {
        if (selectedFilters.numAlternativas === '4') {
          query = query.is('E', null);
        } else if (selectedFilters.numAlternativas === '5') {
          query = query.not('E', 'is', null);
        }
      }

      const { count } = await query;
      setTotalQuestions(count || 0);
    } catch (error) {
      console.error('Erro ao contar questões filtradas:', error);
    }
  };

  const handleStartStudy = () => {
    setShowFilters(false);
    setShowStudySession(true);
    onHideNavigation?.(true);
  };

  const handleExitStudySession = () => {
    setShowStudySession(false);
    setShowFilters(true);
    onHideNavigation?.(false);
  };

  if (showStudySession) {
    return (
      <StudySessionFinal
        filters={selectedFilters}
        onExit={handleExitStudySession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Questões Comentadas
          </h1>
          <p className="text-netflix-text-secondary text-lg">
            Resolva questões de direito organizadas por área, tema e assunto
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-netflix-card border-netflix-border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-netflix-red rounded-lg p-2">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <div className="text-white font-semibold text-xl">{totalQuestions}</div>
                <div className="text-gray-400 text-sm">Total de Questões</div>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Target className="text-white" size={20} />
              </div>
              <div>
                <div className="text-white font-semibold text-xl">{questionStats.totalAreas}</div>
                <div className="text-gray-400 text-sm">Áreas do Direito</div>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 rounded-lg p-2">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <div className="text-white font-semibold text-xl">{questionStats.totalWith4Alternatives}</div>
                <div className="text-gray-400 text-sm">4 Alternativas</div>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 rounded-lg p-2">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <div className="text-white font-semibold text-xl">{questionStats.totalWith5Alternatives}</div>
                <div className="text-gray-400 text-sm">5 Alternativas</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <QuestionFiltersComponent
          onFiltersChange={setSelectedFilters}
          totalQuestions={totalQuestions}
        />

        {/* Start Study Button */}
        <div className="text-center">
          <Button
            onClick={handleStartStudy}
            disabled={totalQuestions === 0}
            className="bg-netflix-red hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Play className="mr-2" size={20} />
            Iniciar Sessão de Estudos
            {totalQuestions > 0 && (
              <Badge className="ml-2 bg-white text-netflix-red">
                {Math.min(totalQuestions, 10)} questões
              </Badge>
            )}
          </Button>
          {totalQuestions === 0 && (
            <p className="text-gray-400 text-sm mt-2">
              Ajuste os filtros para encontrar questões
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsHome;
